import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

const Sidebar = () => {
  const location = useLocation();
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedApiKey = Cookies.get('canvasApiKey');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      fetchUserDetails(storedApiKey);
    }
  }, []);

  const validateApiKey = async (key, setCookies = false) => {
    try {
      const response = await axios.post('http://localhost:3001/api/validate', { apiKey: key });

      if (response.status === 200) {
        const { userData, recommendations } = response.data;

        if (setCookies) {
          // Store user data and recommendations in cookies
          Cookies.set('canvasApiKey', key, { expires: 7 });
          Cookies.set('userName', userData.name, { expires: 7 });
          Cookies.set('userAvatar', userData.avatar_url, { expires: 7 });
          Cookies.set('userRecommendations', JSON.stringify(recommendations), { expires: 7 });
        }

        setUser(userData);
        setError('');
        return true;
      } else {
        setError('Invalid API key. Please try again.');
        return false;
      }
    } catch (err) {
      console.error('Error validating API key:', err);
      setError('Error validating API key. Please try again.');
      return false;
    }
  };

  const fetchUserDetails = async (key) => {
    try {
      const response = await axios.post('http://localhost:3001/api/validate', { apiKey: key });

      if (response.status === 200) {
        const { userData, recommendations } = response.data;

        setUser(userData);
        setError('');
      } else {
        setError('Failed to fetch user details.');
      }
    } catch (err) {
      console.error('Error fetching user details:', err);
      setError('Error fetching user details.');
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      const apiKeyValid = await validateApiKey(apiKey, true);
      if (apiKeyValid) {
        alert('API key saved and valid!');
        window.location.reload(); // Reload the page
      }
    }
  };

  return (
    <div className="w-52 h-full bg-[#8D021F] flex flex-col justify-between grid grid-cols-1 divide-y">
      <div className="relative h-5/6 p-4">
        <div className="mb-8 flex flex-col items-center">
          <img src="/logo.png" alt="Company Logo" className="w-44 h-auto mb-8"/>
          <div className="flex items-center space-x-3 mb-8">
            <img src={user ? user.avatar_url : "/logo192.png"} alt="Profile" className="w-10 rounded-full border-4 border-rose-100"/>
            <span className="text-rose-100 text-lg">{user ? user.name : "User Name"}</span>
          </div>
        </div>
        <ul className="space-y-4">
          <li className={`flex items-center space-x-2 text-xl ${location.pathname === '/' ? 'text-[#FF908B]' : 'text-rose-100 hover:text-[#FF908B]'}`}>
            <i className="fas fa-home w-6"></i>
            <NavLink to="/" activeClassName="text-[#FF908B]">Home</NavLink>
          </li>
          <li className={`flex items-center space-x-2 text-xl ${location.pathname === '/explore' ? 'text-[#FF908B]' : 'text-rose-100 hover:text-[#FF908B]'}`}>
            <i className="fas fa-compass w-6"></i>
            <NavLink to="/explore" activeClassName="text-[#FF908B]">Explore</NavLink>
          </li>
          <li className={`flex items-center space-x-2 text-xl ${location.pathname === '/threads' ? 'text-[#FF908B]' : 'text-rose-100 hover:text-[#FF908B]'}`}>
            <i className="fas fa-comments w-6"></i>
            <NavLink to="/threads" activeClassName="text-[#FF908B]">Threads</NavLink>
          </li>
        </ul>
        <button className="mt-6 w-full bg-[#FF908B] hover:bg-[#FF5858] text-white font-bold py-2 px-4 rounded-full">
          Sign In
        </button>
        <div className='absolute bottom-0 left-0 p-4'>
          <p className='text-white mb-4 font-bold'>Canvas API Key:</p>
          <input 
            type="text" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter API Key" 
            className="w-full px-3 py-2 mb-4 border border-rose-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FF5858] focus:border-transparent"
          />
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </div>
      <div className="absolute bottom-0 w-52 mt-8 h-1/6 p-4 text-center">
        <p className="text-rose-100 text-md">Learn more about our mission and values.</p>
        <a href="/about" className="text-[#FF5858] hover:text-[#FF908B] flex items-center justify-center mt-2">
          About Us <i className="fas fa-arrow-right ml-2"></i>
        </a>
      </div>
    </div>
  );
}

export default Sidebar;
