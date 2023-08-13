import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, List, ListItem, Container, ArrowBack , Grid} from '@mui/material';
import ChatMessage from './components/ChatMessage';


function ChatBotApp() {
  const [questions] = useState([
    //'How are you feeling today?',
    //'What is your favorite color?',
    //'Tell me about your day.',
    "Are you feeling happy or sad. How often u feel so?",
"What do you think about your future?"
//"Do you feel like a failure?",
//"How satisfied are you with things you used to enjoy?",
//"How often do you feel guilty?"
//,"Do you feel like you're being punished?"
,"How do you feel about yourself?"
//,"Do you blame yourself for things?"
//,"Do you have thoughts of killing yourself?"
//,"How often do you cry?"
,"How are you behaving with others usually nowadays?"
//,"Have you lost interest in other people?"
,"How well can you make decisions?"
,"What do you feel about your appearance?"
//,"How well can you work compared to before?"
//,"How well are you sleeping?"
//,"Do you feel more tired than usual?"
//,"How's your appetite compared to usual?"
//,"Have you lost weight recently?"
,"How worried are you about anything in last few days?"
//,"Have you lost interest in sex?"
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
  <Paper elevation={3} style={{ padding: '20px', height: '80vh', overflowY: 'auto' }}>
    {/* Header */}
    <Grid container justifyContent="space-between" alignItems="center" marginBottom="20px">
      <Typography variant="h4" align="center">
        MedAid Dost
      </Typography>
      {currentQuestionIndex === questions.length && (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => window.location.reload()} // Reload the page to go back to the "home"
        >
          Go to Home
        </Button>
      )}
    </Grid>

    {/* Message List */}
    <List sx={{ overflowY: 'auto', maxHeight: '60vh', marginBottom: '15px', borderRadius: '10px', padding: '10px', backgroundColor: '#f4f4f4' }}>
      {messageHistory.map((messageData, index) => (
        <ListItem
          key={index}
          sx={{
            marginBottom: '10px',
            borderRadius: '10px',
            padding: '10px',
            display: 'flex',
            justifyContent: messageData.isUser ? 'flex-end' : 'flex-start',
          }}
        >
          <ChatMessage message={messageData.message} isUser={messageData.isUser} />
        </ListItem>
      ))}
    </List>

    {/* User Input */}
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

    {/* Chatbot Finished */}
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
