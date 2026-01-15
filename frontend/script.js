const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const uploadPrompt = document.getElementById('upload-prompt');
const previewContainer = document.getElementById('preview-container');
const imagePreview = document.getElementById('image-preview');
const loader = document.getElementById('loader');
const resultsArea = document.getElementById('results-area');
const detectionCount = document.getElementById('detection-count');
const inferenceTime = document.getElementById('inference-time');
const detectionList = document.getElementById('detection-list');
const resetBtn = document.getElementById('reset-btn');

// const API_URL = 'http://localhost:8000/predict';
const API_URL = 'https://yolo-safety-detector-1.onrender.com/predict';


// Drag and drop handlers
dropZone.addEventListener('click', () => fileInput.click());

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

async function handleFile(file) {
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file.');
        return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        uploadPrompt.classList.add('hidden');
        previewContainer.classList.remove('hidden');
        analyzeImage(file);
    };
    reader.readAsDataURL(file);
}

async function analyzeImage(file) {
    loader.classList.remove('hidden');
    resultsArea.classList.add('hidden');
    resetBtn.classList.add('hidden');

    const formData = new FormData();
    formData.append('file', file);

    const startTime = performance.now();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Inference failed');

        const data = await response.json();
        const endTime = performance.now();

        // Update UI
        imagePreview.src = data.image; // Annotated image
        detectionCount.innerText = data.detections.length;
        inferenceTime.innerText = `${Math.round(endTime - startTime)}ms`;

        // Update Detection List
        detectionList.innerHTML = '';
        if (data.detections.length === 0) {
            detectionList.innerHTML = '<p style="text-align:center; color: var(--text-dim)">No items detected.</p>';
        } else {
            data.detections.forEach(det => {
                const item = document.createElement('div');
                item.className = 'detection-item';
                item.innerHTML = `
                    <span class="class-tag">${det.class}</span>
                    <span class="conf-value">${(det.confidence * 100).toFixed(1)}%</span>
                `;
                detectionList.appendChild(item);
            });
        }

        resultsArea.classList.remove('hidden');
        resetBtn.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        alert('Error connecting to the API. Make sure the backend is running at ' + API_URL);
    } finally {
        loader.classList.add('hidden');
    }
}

resetBtn.addEventListener('click', () => {
    uploadPrompt.classList.remove('hidden');
    previewContainer.classList.add('hidden');
    resultsArea.classList.add('hidden');
    resetBtn.classList.add('hidden');
    imagePreview.src = '';
    fileInput.value = '';
});
