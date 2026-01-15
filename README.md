# YOLOv8 Safety Equipment Detection System

This project implements a complete pipeline for fine-tuning YOLOv8 on the Hard Hat Workers dataset and deploying it with a modern web interface.

## 🚀 Project Structure
- `yolov8_safety_training.ipynb`: Google Colab/Jupyter notebook for dataset download, training, and evaluation.
- `backend/`: FastAPI server for low-latency model inference.
- `frontend/`: Premium glassmorphism UI for interacting with the model.

## 🛠️ Step 1: Training (Google Colab)
1. Open `yolov8_safety_training.ipynb` in [Google Colab](https://colab.research.google.com/).
2. **Get your Roboflow API Key**:
   - Log in to your [Roboflow Account](https://app.roboflow.com).
   - Click your **Profile Picture** in the top right > **Settings**.
   - Select **Workspaces** in the left sidebar.
   - Click **Roboflow API** and copy your **Private API Key**.
3. Paste the API Key in the notebook (Step 2 cell) and run all cells.
4. Once training is complete, download the `runs/detect/train/weights/best.pt` file.

## �️ Step 2: Running the Backend
1. Install dependencies:
   ```bash
   pip install ultralytics fastapi uvicorn python-multipart
   ```
2. Place your fine-tuned `best.pt` inside the `backend/` folder (or it will fallback to `yolov8n.pt`).
3. Start the server:
   ```bash
   cd backend
   python main.py
   ```
   The API will be available at `http://localhost:8000`.

## 🎨 Step 3: Running the Frontend
1. Simply open `frontend/index.html` in your browser.
2. Drag and drop an image of a construction site or worker.
3. The system will automatically detect and label:
   - **Hard Hat** (Helmet)
   - **Safety Vest**
   - **Head** (No helmet)

## 📊 Key Metrics
- **mAP50**: Expected > 80% (0.8) after 50-100 epochs.
- **Inference Time**: ~20-50ms on modern CPUs.

## � Best Practices Implemented
- **Transfer Learning**: Built on top of `yolov8n.pt`.
- **Data Augmentation**: Handled by Roboflow/Ultralytics during training.
- **Validation**: Separate validation set used to calculate mAP.
- **Modern UI**: High-end visuals using Glassmorphism for a professional feel.
