import React from 'react';
import ChatInput from './ChatInput';

const ChatWindow = () => {
  return (
    <div className="flex-1 h-full bg-white flex flex-col p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="mb-4">
          <div className="bg-blue-100 p-2 rounded">Hello, how can I help you today?</div>
        </div>
        <div className="mb-4">
          <div className="bg-gray-100 p-2 rounded">I need some information about your services.</div>
        </div>
      </div>
      <ChatInput />
    </div>
  );
}

export default ChatWindow;
