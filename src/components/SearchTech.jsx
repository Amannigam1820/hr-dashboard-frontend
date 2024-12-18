import React, { useState, useEffect } from 'react';

const SearchTech = () => {
  const [techstack, setTechstack] = useState([]);
  const [selectedTech, setSelectedTech] = useState(''); // To store selected techstack

  useEffect(() => {
    // Fetch techstack data from the API
    const fetchTechstack = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/employee/techstack', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent with the request
        });
        const data = await response.json();
        if (data.success) {
          setTechstack(data['tech-stack']); // Access the 'tech-stack' array
        }
      } catch (error) {
        console.error('Error fetching techstack:', error);
      }
    };

    fetchTechstack();
  }, []);

  const handleTechSelect = (e) => {
    setSelectedTech(e.target.value); // Set the selected tech stack
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <select
        value={selectedTech}
        onChange={handleTechSelect}
        className="w-full p-2 border rounded-md"
      >
        <option value="" disabled>Select a techstack</option>
        {techstack.length > 0 ? (
          techstack.map((tech, index) => (
            <option key={index} value={tech.trim()}>{tech.trim()}</option> // Display tech name in dropdown
          ))
        ) : (
          <option value="" disabled>No tech stacks available</option>
        )}
      </select>

      {/* {selectedTech && (
        <div className="mt-2">
          <p className="text-gray-700">You selected: <strong>{selectedTech}</strong></p>
        </div>
      )} */}
    </div>
  );
};

export default SearchTech;
