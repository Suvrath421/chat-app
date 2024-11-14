import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Threads = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedConversations = JSON.parse(localStorage.getItem('conversations')) || [];
    setConversations(storedConversations);
  }, []);

  const handleConversationClick = (conversation) => {
    navigate('/response', { state: { responses: conversation.details, request: conversation.details[0]?.text } });
  };

  return (
    <div className="p-8 w-full">
      <h1 className="text-2xl font-bold mb-4">Threads Page</h1>
      {conversations.length === 0 ? (
        <p>No conversations found.</p>
      ) : (
        <ul>
          {conversations.map((conversation, index) => (
            <li
              key={index}
              className=" p-4 mb-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => handleConversationClick(conversation)}
            >
              <h2 className="text-lg font-semibold">{conversation.title}</h2>
              <p>Messages exchanged: {conversation.messages}</p>
              <p className="text-gray-600 truncate">
                {conversation.details[0]?.text || 'No preview available'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Threads;
