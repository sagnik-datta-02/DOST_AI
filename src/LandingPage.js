import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

import './LandingPage.css'; // Import your custom CSS file

function LandingPage() {
   // const [openChatbot, setOpenChatbot] = useState(false);

  const handleOpenChatbot = () => {
   // setOpenChatbot(true);
  };

  const handleCloseChatbot = () => {
   // setOpenChatbot(false);
  };
  return (
    <div>
      <AppBar position="static" className="appBar">
        <Toolbar>
          <Typography variant="h6">MedAid</Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="container">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card className="card">
              <CardContent className="cardContent">
                <Typography variant="h5" component="h2">
                  Disease Predictor and Medical Department Finder
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Worried about your health? Our disease predictor utilizes
                  cutting-edge algorithms to assess your symptoms and provide
                  preliminary insights into potential health conditions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card className="card">
              <CardContent className="cardContent">
                <Typography variant="h5" component="h2">
                  Mental Health Chatbot Analyzer
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your mental well-being matters. Engage with our AI-powered
                  chatbot that analyzes your responses to detect signs of
                  depression and anxiety.
                </Typography>
                <Button
                sx={{marginTop:'100px'}}
        variant="contained"
        color="primary"
        size="large"
        className="chatbotButton"
        onClick={handleOpenChatbot}
      >
        Open Chatbot
      </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          color="primary"
          size="large"
          className="downloadButton"
          sx={{marginLeft : '100px' , marginBottom:'50px'}}
        >
          Download Now
        </Button>
      </Container>
    </div>
  );
}

export default LandingPage;
