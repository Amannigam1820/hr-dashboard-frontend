import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch hook
import { filterExists } from '../redux/reducer/userReducer'; // Import the filterExists action

const SearchTech = () => {
  const [techstack, setTechstack] = useState([]);
  const [selectedTech, setSelectedTech] = useState('');
  const dispatch = useDispatch(); // Initialize useDispatch

  useEffect(() => {
    const fetchTechstack = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8080/api/employee/techstack', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success) {
          setTechstack(data['tech-stack']);
        }
      } catch (error) {
        console.error('Error fetching techstack:', error);
      }
    };

    fetchTechstack();
  }, []);

  const handleTechSelect = (e) => {
    const selectedTech = e.target.value;
    setSelectedTech(selectedTech);

    // Dispatch filterExists action with selected tech
    dispatch(filterExists(selectedTech));
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
            <option key={index} value={tech.trim()}>
              {tech.trim()}
            </option>
          ))
        ) : (
          <option value="" disabled>No tech stacks available</option>
        )}
      </select>
    </div>
  );
};

export default SearchTech;
