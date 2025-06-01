from fastapi import FASTAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from torchvision.models.detection import ssdmobile_net_v3_large


