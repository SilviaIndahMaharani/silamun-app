from fastapi import FASTAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from torchvision.models.detection import ssdlite320_mobilnete_v3_large
from torchvision.transforms import functional as F
from PIL import Image
import torch
import json
import io
from fastapi.staticfiles import StaticFiles
from torchvision.transforms import functional as F

# Initialize the FastAPI app
app = FastAPI()
app.mount("/seagrass_image", StaticFiles(directory="seagrass_image"), name="seagrass_image")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for CORS
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

