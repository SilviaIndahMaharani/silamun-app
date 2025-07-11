from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import numpy as np
import cv2
import base64
import torch
from torchvision.models.detection import ssdlite320_mobilenet_v3_large
from torchvision.models import MobileNet_V3_Large_Weights
from torchvision.transforms import functional as F
from PIL import Image
import json
import io

# =====================================
# 🚀 INIT FASTAPI APP
# =====================================
app = FastAPI()
app.mount("/gambar_lamun", StaticFiles(directory="gambar_lamun"), name="gambar_lamun")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================
# 📚 LABEL MAPPING
# =====================================
COCO_CLASSES = {
    1: "Cymodocea_rotundata",
    2: "Enhalus_acoroides",
    3: "Syringodium_isoetifolium",
    4: "Thalassia_hemprichii",
}

# =====================================
# 🖼️ PREPROCESSING UTILS
# =====================================
def dehaze_clahe(img):
    lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    l_clahe = clahe.apply(l)
    lab_clahe = cv2.merge((l_clahe, a, b))
    return cv2.cvtColor(lab_clahe, cv2.COLOR_LAB2RGB)

def enhance_lab(img):
    lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    l = cv2.normalize(l, None, alpha=0, beta=180, norm_type=cv2.NORM_MINMAX)
    enhanced_lab = cv2.merge((l, a, b))
    enhanced = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2RGB)
    return cv2.GaussianBlur(enhanced, (5, 5), 0)

def sharpen_image(img):
    kernel = np.array([[-1, -1, -1],
                       [-1,  9, -1],
                       [-1, -1, -1]])
    return cv2.filter2D(img, -1, kernel)

def image_to_base64(img: Image.Image):
    buf = io.BytesIO()
    img.save(buf, format='JPEG')
    return base64.b64encode(buf.getvalue()).decode()

# =====================================
# 🔧 LOAD MODEL
# =====================================
def load_model(weights_path, num_classes=5, device="cpu"):
    backbone_weights = MobileNet_V3_Large_Weights.IMAGENET1K_V1
    model = ssdlite320_mobilenet_v3_large(
        weights=None,
        weights_backbone=backbone_weights,
        num_classes=num_classes
    )
    state_dict = torch.load(weights_path, map_location=device)
    model.load_state_dict(state_dict)
    model.to(device)
    model.eval()
    return model

MODEL_PATH = "best_model.pth"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")
print("Loading model...")
model = load_model(MODEL_PATH, num_classes=5, device=device)
print("Model loaded successfully.")

# =====================================
# 🔍 LOAD JSON DATA
# =====================================
with open("dataLamun.json") as f:
    lamun_data = json.load(f)

def get_lamun_by_label(label_name):
    # Ubah _ menjadi spasi, lowercase semua
    label_name_normalized = label_name.replace("_", " ").lower().strip()
    for data in lamun_data:
        data_name_normalized = data["nama"].lower().strip()
        if label_name_normalized == data_name_normalized:
            return data
    print(f"[!] Tidak ditemukan: {label_name_normalized}")  # opsional debugging
    return None

# =====================================
# 🛬 ROUTES
# =====================================
@app.get("/")
def root():
    return {"message": "FastAPI backend for lamun SSD Lite ready!"}

@app.get("/lamun/get-data")
def get_data():
    return JSONResponse(content=lamun_data)

@app.post("/lamun/preprocess")
async def preprocess_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    np_img = np.array(pil_image)

    # Preprocessing pipeline
    dehazed = dehaze_clahe(np_img)
    enhanced = enhance_lab(dehazed)
    sharpened = sharpen_image(enhanced)
    final_img = Image.fromarray(sharpened)

    # Convert both original and preprocessed to base64
    original_b64 = image_to_base64(pil_image)
    processed_b64 = image_to_base64(final_img)

    return {
        "original_base64": original_b64,
        "preprocessed_base64": processed_b64
    }

@app.post("/lamun/detect")
async def detect_image(file: UploadFile = File(...), threshold: float = 0.8):
    try:
        image_bytes = await file.read()
        pil_image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        np_image = np.array(pil_image)

        # Preprocess for detection
        dehazed = dehaze_clahe(np_image)
        enhanced = enhance_lab(dehazed)
        sharpened = sharpen_image(enhanced)
        enhanced_pil = Image.fromarray(sharpened)

        resized = enhanced_pil.resize((640, 640))
        image_tensor = F.to_tensor(resized).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(image_tensor)[0]

        results = []
        for box, label, score in zip(outputs["boxes"], outputs["labels"], outputs["scores"]):
            if score >= threshold:
                class_name = COCO_CLASSES.get(label.item(), f"Class {label.item()}")
                x1, y1, x2, y2 = map(float, box.tolist())
                scale_x = pil_image.width / 640
                scale_y = pil_image.height / 640
                x1 *= scale_x
                x2 *= scale_x
                y1 *= scale_y
                y2 *= scale_y
                data_lamun = get_lamun_by_label(class_name)
                results.append({
                    "label": class_name,
                    "score": round(float(score), 4),
                    "box": [x1, y1, x2, y2],
                    "data_lamun": data_lamun if data_lamun is not None else None
                })

        enhanced_base64 = image_to_base64(enhanced_pil)

        return JSONResponse(content={
            "message": "success",
            "detections": results,
            "enhancedBase64": enhanced_base64
        })
    except Exception as e:
        print("ERROR /lamun/detect:", str(e))
        return JSONResponse(content={"error": str(e)}, status_code=500)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5006, reload=False)