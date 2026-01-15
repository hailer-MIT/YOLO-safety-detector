import io
import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import base64

app = FastAPI(title="Safety Detection API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
# In production, replace 'yolov8n.pt' with your fine-tuned 'best.pt'
try:
    model = YOLO("best.pt")
except Exception:
    print("Fine-tuned 'best.pt' not found, falling back to 'yolov8n.pt'")
    model = YOLO("yolov8n.pt")

@app.get("/")
async def root():
    return {"message": "Safety Detection API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    
    # Run inference
    results = model.predict(source=image, conf=0.25)
    
    # Process results
    res = results[0]
    plot_img = res.plot() # BGR numpy array
    
    # Convert back to PIL then to base64 for frontend display
    plot_img_rgb = cv2.cvtColor(plot_img, cv2.COLOR_BGR2RGB)
    res_pil = Image.fromarray(plot_img_rgb)
    
    buffered = io.BytesIO()
    res_pil.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()

    # Extract detections
    detections = []
    for box in res.boxes:
        detections.append({
            "class": res.names[int(box.cls)],
            "confidence": float(box.conf),
            "bbox": [float(x) for x in box.xyxy[0]]
        })

    return {
        "image": f"data:image/jpeg;base64,{img_str}",
        "detections": detections
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
