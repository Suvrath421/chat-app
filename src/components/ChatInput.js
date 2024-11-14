import React, { useState } from 'react';

/*
colors: {
      salmon: '#FF908B',
      ruby: '#8D021F',
      peach: '#FF5858'
    }
*/

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage(''); // Clear the input after sending
    }
  };

  return (
    <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
      <div className="relative flex-grow">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-4 pl-10 pr-16 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          style={{ height: '60px' }}
          placeholder="Type your message here..."
        ></textarea>
        <button
          onClick={handleSend}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
