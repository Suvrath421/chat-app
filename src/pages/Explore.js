import React, { useState, useEffect, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';

const Explore = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [iteration, setIteration] = useState(1);
  const scrollableDivRef = useRef(null); // Ref for the scrollable div

  // Function to fetch data
  const fetchData = useCallback(async () => {
    console.log('Fetching data for iteration:', iteration);
    setLoading(true);

    const userRecommendations = Cookies.get('userRecommendations');

    try {
      const payload = userRecommendations
      ? { iteration, recommendations: JSON.parse(userRecommendations) } // Send both
      : { iteration }; // Send only iteration

     console.log('Payload being sent to Lambda:', payload);

      const response = await fetch('http://localhost:3001/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( userRecommendations
          ? { iteration, interests: JSON.parse(userRecommendations) } // Send both
          : { iteration })
      });

      const responseData = await response.json();
      console.log('Data fetched:', responseData);

      const clubs = responseData.message || [];

      // Append new data to existing data
      setData(prevData => [...prevData, ...clubs]);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err);
      setLoading(false);
    }
  }, [iteration]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Function to handle scroll event
  const handleScroll = () => {
    const scrollableDiv = scrollableDivRef.current;

    if (scrollableDiv) {
      const scrollTop = scrollableDiv.scrollTop;
      const scrollHeight = scrollableDiv.scrollHeight;
      const clientHeight = scrollableDiv.clientHeight;

      console.log('Scroll Top:', scrollTop);
      console.log('Scroll Height:', scrollHeight);
      console.log('Client Height:', clientHeight);

      if (scrollTop + clientHeight >= scrollHeight - 50) { // Trigger 50px before the bottom
        console.log('Scrolled to bottom of the div, loading more data...');
        setIteration(prevIteration => prevIteration + 1);
      }
    }
  };

  useEffect(() => {
    const scrollableDiv = scrollableDivRef.current;

    if (scrollableDiv) {
      console.log('Attaching scroll event listener');
      scrollableDiv.addEventListener('scroll', handleScroll);
    } else {
      console.log('Scrollable div ref is null');
    }

    return () => {
      if (scrollableDiv) {
        console.log('Removing scroll event listener');
        scrollableDiv.removeEventListener('scroll', handleScroll);
      }
    };
  });

  if (loading && data.length === 0) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div ref={scrollableDivRef} className="p-8 flex-1 overflow-y-scroll" style={{ height: '99vh' }}>
      <h1 className="text-2xl font-bold mb-4">Explore Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg shadow">
              {item.image_link && (
                <img
                  src={item.image_link}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-700 mb-4">{item.description}</p>
              {item.source_link && (
                <a
                  href={item.source_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Learn More
                </a>
              )}
            </div>
          ))
        ) : (
          <div>No data available</div>
        )}
      </div>
      {loading && <div className="text-center py-4">Loading more...</div>}
    </div>
  );
};

export default Explore;
