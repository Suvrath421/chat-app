import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Threads from './pages/Threads';
import ResponsePage from './pages/ResponsePage';
import './App.css';

function App() {
  return (
    <Router>
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/threads" element={<Threads />} />
            <Route path="/response" element={<ResponsePage />} />
          </Routes>
        </div>
      </div>
    </div>
  </Router>
  );
}

export default App;
