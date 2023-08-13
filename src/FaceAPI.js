import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Typography, Container, CircularProgress } from '@mui/material';

function WebcamEmotionAnalysis() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emotions, setEmotions] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Access the user's webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing webcam:', error);
        setMessage('Failed to access webcam.');
      });
  }, []);

  const handleEmotionAnalysis = () => {
    if (!videoRef.current) return;

    setLoading(true);
    setMessage('');
    setEmotions([]);

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Capture a frame from the video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the frame to Blob (JPEG format)
    canvas.toBlob((frameBlob) => {
      if (!frameBlob) return;

      const formData = new FormData();
      formData.append('frames', frameBlob);

      axios
        .post('https://chatu-rf63-git-master-swapnendu003.vercel.app/api/models/analyzeVideoEmotions', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          const { emotions } = response.data;
          setEmotions(emotions);
          setMessage('Emotion analysis completed.');
        })
        .catch((error) => {
          console.error('Error analyzing emotions:', error);
          setMessage('Failed to analyze emotions.');
        })
        .finally(() => {
          setLoading(false);
        });
    }, 'image/jpeg');
  };

  return (
    <Container>
      <Typography variant="h4" style={{ marginBottom: '20px' }}>
        Webcam Emotion Analysis
      </Typography>
      <video ref={videoRef} autoPlay muted />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleEmotionAnalysis}
        disabled={loading}
        style={{ marginTop: '10px' }}
      >
        Analyze Emotions
      </Button>
      {loading && <CircularProgress style={{ marginTop: '10px' }} />}
      {message && (
        <Typography variant="body1" style={{ marginTop: '10px' }}>
          {message}
        </Typography>
      )}
      {emotions.length > 0 && (
        <div>
          <Typography variant="h5" style={{ marginTop: '20px' }}>
            Emotion Analysis Results
          </Typography>
          <pre>{JSON.stringify(emotions, null, 2)}</pre>
        </div>
      )}
    </Container>
  );
}

export default WebcamEmotionAnalysis;