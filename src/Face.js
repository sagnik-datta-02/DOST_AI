import React, { useEffect, useRef } from 'react';

const FaceEmotionDetector = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    async function setupFaceDetection() {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.js';
      script.async = true;
      script.onload = async () => {
        await window.faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        await window.faceapi.nets.faceExpressionNet.loadFromUri('/models');
        await window.faceapi.nets.faceLandmark68Net.loadFromUri('/models'); // Load landmark model
        startVideo();
        detectEmotions();
      };
      
      document.body.appendChild(script);
    }
    
    async function startVideo() {
      if (navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        videoRef.current.srcObject = stream;
      }
    }

    async function detectEmotions() {
      const canvas = window.faceapi.createCanvasFromMedia(videoRef.current);
      document.body.appendChild(canvas);
      const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
      canvas.width = displaySize.width;
      canvas.height = displaySize.height;

      setInterval(async () => {
        if (videoRef.current && videoRef.current.readyState === 4) {
          const detections = await window.faceapi.detectAllFaces(
            videoRef.current,
            new window.faceapi.TinyFaceDetectorOptions()
          ).withFaceLandmarks().withFaceDescriptors().withFaceExpressions(); // Include landmarks and descriptors

          const resizedDetections = window.faceapi.resizeResults(detections, displaySize);
          canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
          window.faceapi.draw.drawDetections(canvas, resizedDetections);
          window.faceapi.draw.drawFaceLandmarks(canvas, resizedDetections); // Draw landmarks
          window.faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        }
      }, 100);
    }

    setupFaceDetection();
  }, []);

  return <video ref={videoRef} autoPlay muted playsInline style={{ transform: 'scaleX(-1)' }} />;
};

export default FaceEmotionDetector;
