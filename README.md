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

## ⚙️ Step 2: Running the Backend
1. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Place your fine-tuned `best.pt` inside the `backend/` folder.
3. Start the server:
   ```bash
   cd backend
   python main.py
   ```
   The API will be available at `http://localhost:8000`.

## 🎨 Step 3: Running the Frontend
1. Simply open `frontend/index.html` in your browser.
2. Drag and drop an image of a construction site or worker.

## 🌐 Step 4: Cloud Deployment (Option A)

The easiest way to make your app public is using **Render** (for the backend) and **Vercel/Netlify** (for the frontend).

### 1. Deploy the Backend (Render)
1. Go to [Render.com](https://render.com/) and create a free account.
2. Click **New +** > **Web Service**.
3. Connect your GitHub repository.
4. **Settings**:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port 10000`
5. Render will give you a URL like `https://yolo-backend.onrender.com`. **Copy this.**

### 2. Update Frontend API Link
1. In `frontend/script.js`, replace the `API_URL` with your new Render URL:
   ```javascript
   const API_URL = 'https://yolo-backend.onrender.com/predict';
   ```
2. Commit and push: `git commit -am "Update API for production" && git push`

### 3. Deploy the Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com/) and connect your GitHub.
2. Select your repository.
3. **Settings**:
   - **Root Directory**: `frontend`
4. Click **Deploy**. Done!

## 📊 Key Metrics
- **mAP50**: Achieved **90.7%** on validation set.
- **Inference Time**: ~3-10ms (GPU) / ~50ms (CPU).

## 💡 Best Practices Implemented
- **Transfer Learning**: Built on top of `yolov8n.pt`.
- **Data Augmentation**: Handled by Roboflow/Ultralytics during training.
- **Validation**: Separate validation set used to calculate mAP.
- **Modern UI**: High-end visuals using Glassmorphism for a professional feel.
