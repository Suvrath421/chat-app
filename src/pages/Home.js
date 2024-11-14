import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInput from '../components/ChatInput';

const Home = () => {
  const navigate = useNavigate();

  const handleSend = (message) => {
    // Navigate immediately with the user's request
    navigate('/response', { state: { request: message } });

    // Send the request to the server (without awaiting)
    fetch('https://qjyu5j6dw4x26fy7sl6n526kja0kghvy.lambda-url.us-east-1.on.aws/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({query: message }),
    })
      .then(response => response.json())
      .then(data => {
        // Pass the response to the response page through URL state
        navigate('/response', { state: { request: message, response: data.message } });
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome</h1>
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default Home;
