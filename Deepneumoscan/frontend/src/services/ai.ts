import * as tf from '@tensorflow/tfjs';

// Load the pre-trained model once
let model: tf.LayersModel | null = null;

export const loadModel = async (): Promise<void> => {
  if (model) return;
  
  try {
    // Load model from public URL (replace with your own model in production)
    // This is a placeholder — we'll use a simple MobileNetV2 for demo
    model = await tf.loadLayersModel('https://raw.githubusercontent.com/rashika-nuthalapati/deepneumoscan-model/main/model.json');
    console.log('✅ AI Model loaded');
  } catch (err) {
    console.error('❌ Failed to load model:', err);
    throw new Error('Model loading failed. Using mock AI.');
  }
};

// Preprocess image to 224x224 and normalize
const preprocessImage = (img: HTMLImageElement): tf.Tensor => {
  const tensor = tf.browser.fromPixels(img)
    .resizeNearestNeighbor([224, 224])
    .toFloat()
    .div(tf.scalar(255.0))
    .expandDims();

  return tensor;
};

// Run prediction
export const predictPneumonia = async (img: HTMLImageElement): Promise<{
  prediction: 'Pneumonia' | 'Normal';
  confidence: number;
  modelUsed: 'TensorFlow.js';
}> => {
  if (!model) {
    throw new Error('Model not loaded');
  }

  const processedImg = preprocessImage(img);
  const predictions = model.predict(processedImg) as tf.Tensor;
  const scores = await predictions.data();
  predictions.dispose();
  processedImg.dispose();

  const pneumoniaScore = scores[0];
  const normalScore = scores[1];
  
  // Use softmax-like logic
  const confidence = Math.max(pneumoniaScore, normalScore) * 100;
  const prediction = pneumoniaScore > normalScore ? 'Pneumonia' : 'Normal';

  return {
    prediction,
    confidence: parseFloat(confidence.toFixed(2)),
    modelUsed: 'TensorFlow.js',
  };
};