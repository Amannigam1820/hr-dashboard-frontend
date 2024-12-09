import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Registering required chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EmployeeDistributionChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetching data from the API (adjust URL to your backend API)
    fetch('http://127.0.0.1:8080/api/employee/stats', {
      method: 'GET',
      credentials: 'include', // Include cookies or other credentials
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  console.log(data?.data);
  

  // Check if data is not null and contains the required properties
  if (
    !data?.data ||
    !data?.data?.genderDistribution ||
    !data?.data?.departmentDistribution ||
    !data?.data?.
    positionDistribution
     ||
    !data?.data?.locationDistribution
  ) {
    return <div className="flex justify-center items-center h-screen text-gray-600">Loading...</div>;
  }

  // Data for the Gender Distribution Bar Chart
  const genderData = {
    labels: Object.keys(data.data.genderDistribution),
    datasets: [
      {
        label: 'Gender Distribution',
        data: Object.values(data.data.genderDistribution),
        backgroundColor: ['#F472B6','#3B82F6'], // Blue for Male, Pink for Female
        barThickness: 50,
      },
    ],
  };

  // Data for the Department Distribution Bar Chart
  const departmentData = {
    labels: Object.keys(data.data.departmentDistribution),
    datasets: [
      {
        label: 'Department Distribution',
        data: Object.values(data.data.departmentDistribution),
        backgroundColor:  [
            '#FF5733', // Red
            '#33FF57', // Green
            '#3357FF', // Blue
            '#FFC300', // Yellow
            '#C70039', // Crimson
          ], // Orange
        barThickness: 50,
      },
    ],
  };

  const positionData = {
    labels: Object.keys(data.data.
        positionDistribution
        ),
    datasets:[
        {
            label:"Position Distribution",
            data:Object.values(data.data.positionDistribution),
            backgroundColor:  [
                '#FF5733', // Red
                '#33FF57', // Green
                '#3357FF', // Blue
                '#FFC300', // Yellow
                '#C70039', // Crimson
              ], // Orange
            barThickness: 50,
        }
    ]
  }

  // Data for the Location Distribution Bar Chart
  const locationData = {
    labels: Object.keys(data.data.locationDistribution),
    datasets: [
      {
        label: 'Location Distribution',
        data: Object.values(data.data.locationDistribution),
        backgroundColor: 
             [
                '#FF5733', // Red
                '#33FF57', // Green
                '#3357FF', // Blue
                '#FFC300', // Yellow
                '#C70039', // Crimson
              ], 
        
        barThickness: 50,
      },
    ],
  };

  // Chart options (applied to all charts)
  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false, // Remove x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Remove y-axis grid lines
        },
        ticks: {
          stepSize: 2, // Display whole numbers on the y-axis
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">Employee Distribution Charts</h3>

      {/* Grid Layout for Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2 text-center">Gender Distribution</h4>
          <div className="h-64 w-full">
            <Bar data={genderData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2 text-center">Department Distribution</h4>
          <div className="h-64 w-full">
            <Bar data={departmentData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2 text-center">Department Distribution</h4>
          <div className="h-64 w-full">
            <Bar data={positionData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4">
          <h4 className="text-md font-semibold text-gray-700 mb-2 text-center">Location Distribution</h4>
          <div className="h-64 w-full">
            <Bar data={locationData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDistributionChart;
