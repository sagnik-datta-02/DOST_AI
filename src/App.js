import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, List, ListItem, Container } from '@mui/material';
import ChatMessage from './components/ChatMessage';

function ChatBotApp() {
  const [questions] = useState([
    'How are you feeling today?',
    'What is your favorite color?',
    'Tell me about your day.',
    // Add more questions here
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [messageHistory, setMessageHistory] = useState([]);
  const [averageSentiment, setAverageSentiment] = useState('');
  const [userInput, setUserInput] = useState('');
  const [positiveSentiments, setPositiveSentiments] = useState([]);
  const [negativeSentiments, setNegativeSentiments] = useState([]);
  const [userResponses, setUserResponses] = useState([]);

  useEffect(() => {
    const updatedMessageHistory = messageHistory.slice(); // Create a copy of the message history
    if (currentQuestionIndex < questions.length) {
      updatedMessageHistory.push({
        message: questions[currentQuestionIndex],
        isUser: false,
      });
    }
    setMessageHistory(updatedMessageHistory);
  }, [currentQuestionIndex]);

  const handleUserResponse = async () => {
    try {
      console.log(userInput); // Log the user's response
      setMessageHistory((prevHistory) => [
        ...prevHistory,
        { message: userInput, isUser: true },
      ]);
      const sentiment = await fetchSentiment(userInput);
      console.log(sentiment);
      const sentimentValue = sentiment[0];
      setUserResponses((prevResponses) => [...prevResponses, { message: userInput, isUser: true }]);
      if (sentimentValue === 'POSITIVE') {
        setPositiveSentiments((prev) => [...prev, sentiment[1]]);
      } else {
        setNegativeSentiments((prev) => [...prev, sentiment[1]]);
      }

      if (currentQuestionIndex <= questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        calculateAverageSentiments();
      } else {
        calculateAverageSentiments();
      }
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
  };

  const fetchSentiment = async (text) => {
    const response = await fetch('https://chatu-rf63-git-master-swapnendu003.vercel.app/api/sentiment/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answers: [text] }),
    });
    const data = await response.json();
    return data.sentiments;
  };

  const calculateAverageSentiments = () => {
    const positiveAverage = calculateAverage(positiveSentiments);
    const negativeAverage = calculateAverage(negativeSentiments);

    const suggestion =
      positiveAverage >= negativeAverage ? 'positive' : 'negative';
    console.log(suggestion);
    setAverageSentiment(suggestion);
  };

  const calculateAverage = (values) => {
    if (values.length === 0) {
      return 0;
    }
    const total = values.reduce((sum, value) => sum + value, 0);
    return total / values.length;
  };

  
  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
      <Paper elevation={3} style={{ padding: '20px', height: '60vh', overflowY: 'auto' }}>
        <Typography variant="h4" align="center" gutterBottom>
          MedAid Dost
        </Typography>

        <List sx={{ overflowY: 'auto', maxHeight: '300px', marginBottom: '15px', borderRadius: '10px', padding: '10px', backgroundColor: '#f4f4f4' }}>
          {messageHistory.map((messageData, index) => (
            <ListItem key={index} sx={{ marginBottom: '10px', borderRadius: '10px', padding: '10px', display: 'flex', justifyContent: messageData.isUser ? 'flex-end' : 'flex-start' }}>
              <ChatMessage message={messageData.message} isUser={messageData.isUser} />
            </ListItem>
          ))}
        </List>

        {currentQuestionIndex < questions.length && (
          <div>
            <TextField
              label="Type your answer..."
              variant="outlined"
              fullWidth
              value={userInput}
              onChange={(event) => setUserInput(event.target.value)}
              sx={{ marginTop: '10px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUserResponse}
              sx={{ marginTop: '10px' }}
            >
              Submit
            </Button>
          </div>
        )}

        {currentQuestionIndex === questions.length && (
          <div>
            <Typography variant="h6">Chatbot</Typography>
            <Typography variant="body1">Thank you for answering the questions.</Typography>
            <Typography variant="body1">Average sentiment: {averageSentiment}</Typography>
          </div>
        )}
      </Paper>
    </Container>
  );
}

export default ChatBotApp;
