from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import torch
from torchvision.models.detection import ssdlite320_mobilenet_v3_large
from torchvision.models import MobileNet_V3_Large_Weights
from torchvision.transforms import functional as F
from PIL import Image
import json
import io
from fastapi.staticfiles import StaticFiles

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
# 🔧 LOAD MODEL
# =====================================
def load_model(weights_path, num_classes=5, device="cpu"):
    """
    Fungsi untuk memuat model SSD Lite dengan jumlah kelas yang disesuaikan dan weights pretrained.
    """
    # Menggunakan pretrained backbone MobileNetV3
    backbone_weights = MobileNet_V3_Large_Weights.IMAGENET1K_V1

    # Memuat model SSDlite tanpa weights di head-nya
    model = ssdlite320_mobilenet_v3_large(
        weights=None,  # Jangan memuat pretrained weights pada head
        weights_backbone=backbone_weights,
        num_classes=num_classes  # Jumlah kelas termasuk background
    )

    # Memuat weights yang sudah dilatih
    state_dict = torch.load(weights_path, map_location=device)
    model.load_state_dict(state_dict)

    # Pindahkan model ke device dan set eval mode
    model.to(device)
    model.eval()
    return model

# Load model saat startup
MODEL_PATH = "best_model.pth"  # Ganti dengan path model Anda yang telah dilatih
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
    # Normalize label_name to match the format in the dataLamun.json
    label_name_normalized = label_name.lower().replace(" ", "-")
    print(f"Looking for data for label: {label_name_normalized}")

    for data in lamun_data:
        # Normalize each label in the JSON data to match
        data_name_normalized = data["nama"].lower().replace(" ", "-")
        print(f"Comparing with: {data_name_normalized}")

        if label_name_normalized == data_name_normalized:
            return data

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

@app.post("/lamun/detect")
async def detect_image(file: UploadFile = File(...), threshold: float = 0.3):
    # Membaca file gambar yang diupload
    image_bytes = await file.read()
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Resize gambar ke 640x640 sesuai dengan kebutuhan model SSD Lite
    image_resized = image.resize((640, 640))

    # Mengkonversi gambar menjadi tensor
    image_tensor = F.to_tensor(image_resized).unsqueeze(0).to(device)

    with torch.no_grad():
        # Melakukan prediksi menggunakan model SSD Lite
        outputs = model(image_tensor)[0]

    results = []
    for box, label, score in zip(outputs["boxes"], outputs["labels"], outputs["scores"]):
        if score >= threshold:
            class_name = COCO_CLASSES.get(label.item(), f"Class {label.item()}")
            x1, y1, x2, y2 = map(float, box.tolist())

            # Scaling kembali ke dimensi gambar asli
            scale_x = image.width / 640
            scale_y = image.height / 640
            x1 *= scale_x
            x2 *= scale_x
            y1 *= scale_y
            y2 *= scale_y

            # Mendapatkan data lamun berdasarkan label yang terdeteksi
            data_lamun = get_lamun_by_label(class_name)

            if data_lamun:
                print(f"Data found for {class_name}: {data_lamun}")
            else:
                print(f"No data found for {class_name}")

            results.append({
                "label": class_name,
                "score": round(float(score), 4),
                "box": [x1, y1, x2, y2],
                "data_lamun": data_lamun or "Data not found"
            })

    return JSONResponse(content={"message": "success", "detections": results})

if name == "main":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5006, reload=False)