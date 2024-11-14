import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatInput from '../components/ChatInput';

const ResponsePage = () => {
  const location = useLocation();
  const initialResponses = location.state?.responses || [];
  const request = location.state?.request || 'Loading...';
  const [responses, setResponses] = useState(initialResponses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [loading, setLoading] = useState(!initialResponses.length);

  // Helper function to save or update conversations in local storage
  const saveConversationToLocalStorage = () => {
    const existingConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    const currentConversationTitle = request.substring(0, 30);
    
    // Check if the conversation already exists in local storage
    const conversationIndex = existingConversations.findIndex(convo => convo.title === currentConversationTitle);

    const currentConversation = {
      title: currentConversationTitle,
      messages: responses.length,
      details: responses,
    };

    if (conversationIndex !== -1) {
      // Update the existing conversation if found
      existingConversations[conversationIndex] = currentConversation;
    } else {
      // Add a new conversation if not found
      existingConversations.push(currentConversation);
    }

    localStorage.setItem('conversations', JSON.stringify(existingConversations));
  };

  useEffect(() => {
    if (responses.length > 0) {
      setLoading(false);
    }
  }, [responses]);

  useEffect(() => {
    if (!loading && responses.length > 1) {
      saveConversationToLocalStorage();
    }
  }, [responses, loading]);

  const handleSend = async (message) => {
    setResponses((prevResponses) => [...prevResponses, { type: 'request', text: message }]);
    setLoading(true);

    try {
      const response = await fetch('https://qjyu5j6dw4x26fy7sl6n526kja0kghvy.lambda-url.us-east-1.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setResponses((prevResponses) => [...prevResponses, { type: 'response', text: data.message }]);
      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
    }
  };

  const openModal = (response) => {
    setSelectedResponse(response);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResponse(null);
  };

  return (
    <div className="flex-1 flex flex-col p-8">
      <h1 className="text-2xl font-bold mb-4">{request}</h1>
      <div className="flex-1 overflow-y-auto mb-4">
        {responses.map((response, index) => (
          <div key={index} className={`p-4 mb-2 rounded-lg ${response.type === 'request' ? 'bg-blue-100' : 'bg-gray-100'}`}>
            {response.text.length > 100 ? (
              <>
                <p className="truncate">{response.text.substring(0, 100)}...</p>
                <button
                  className="text-blue-500 mt-2 underline"
                  onClick={() => openModal(response.text)}
                >
                  Read More
                </button>
              </>
            ) : (
              <p>{response.text}</p>
            )}
          </div>
        ))}
        {loading && (
          <div className="animate-pulse p-4 bg-gray-200 rounded-lg mb-4">
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-6 bg-gray-300 rounded"></div>
          </div>
        )}
      </div>
      <ChatInput onSend={handleSend} />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-3xl p-6 rounded-lg overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Full Response</h2>
            <div className="text-gray-700 whitespace-pre-wrap">{selectedResponse}</div>
            <button
              className="mt-4 text-white bg-blue-500 px-4 py-2 rounded"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponsePage;
