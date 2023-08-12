import React from 'react';
import { Paper, Typography } from '@mui/material';
import './ChatMessage.css'; // Import custom styling

const ChatMessage = ({ message, isUser }) => {
  return (
    <Paper
      className={`chat-message ${isUser ? 'user' : 'chatbot'}`} // Apply different classes based on the message source
    >
      <Typography variant="body1">{message}</Typography>
    </Paper>
  );
};


export default ChatMessage;
