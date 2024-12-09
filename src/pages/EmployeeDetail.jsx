import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUpdateEmployeeMutation } from "../redux/api/Hr_api.js"; // Import the updateEmployee mutation

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility state
  const [editedEmployee, setEditedEmployee] = useState({}); // State to hold edited employee data
  const navigate = useNavigate();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation(); // Destructure the mutation

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8080/api/employee/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        setEmployee(response.data.hr);
        setEditedEmployee(response.data.hr); // Pre-fill modal with employee data
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching employee details: " + err.message);
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => {
    setModalOpen(true); // Open the modal when Edit button is clicked
  };

  const handleDelete = async () => {
    try {
      const confirmed = window.confirm(
        `Are you sure you want to delete ${employee.name}?`
      );
      if (!confirmed) return;

      await axios.delete(`http://127.0.0.1:8080/api/employee/${id}`, {
        withCredentials: true,
      });

      toast.success(`Employee ${employee.name} deleted successfully!`, {
        duration: 3000,
      });
      navigate("/employees");
      window.location.reload();
    } catch (err) {
      alert("Failed to delete the employee: " + err.message);
    }
  };

  const handleModalChange = (e) => {
    setEditedEmployee({
      ...editedEmployee,
      [e.target.name]: e.target.value, // Dynamically update the corresponding field
    });
  };

  console.log(editedEmployee);

  const handleSaveChanges = async () => {
    try {
      // Call the updateEmployee mutation
      const transformedData = {
        ...editedEmployee, // Spread the existing data
        //YearsOfExperience: editedEmployee.YearsOfExperience || editedEmployee.years_of_experience, // Handle both cases
        YearsOfExperience: parseFloat(editedEmployee.YearsOfExperience),
        CasualLeave: parseInt(editedEmployee.CasualLeave, 10),
        EarnedLeave: parseInt(editedEmployee.EarnedLeave, 10),
      };

      console.log(transformedData);

      // delete transformedData.years_of_experience;

      // console.log('Transformed Data:', transformedData);

      //delete transformedData.years_of_experience;
      const res = await updateEmployee({ id, empData: transformedData });
      console.log(res);
      toast.success("Employee details updated successfully!");
      setModalOpen(false); // Close the modal after successful update
      setEmployee(editedEmployee); // Update the displayed employee data
    } catch (err) {
      toast.error("Error updating employee details: " + err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  console.log(employee);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md flex gap-8">
        {/* Left Section: Employee Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Employee Details
          </h2>
          {employee ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">Name:</span>
                  <span className="text-gray-500">{employee.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">Email:</span>
                  <span className="text-gray-500">{employee.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">Gender:</span>
                  <span className="text-gray-500">{employee.gender}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">Address:</span>
                  <span className="text-gray-500">{employee.address}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">Department:</span>
                  <span className="text-gray-500">{employee.department}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">
                    Contact Number:
                  </span>
                  <span className="text-gray-500">
                    {employee.contact_number}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">
                    Date of Birth:
                  </span>
                  {employee.birth_date === null ? (
                    <span className="text-gray-300">NA</span>
                  ) : (
                    <span className="text-gray-500">{employee.birth_date}</span>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">Position:</span>
                  <span className="text-gray-500">{employee.position}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">Tech Stack:</span>
                  <span className="text-gray-500">{employee.tech_stack}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">
                    Years of Experience:
                  </span>
                  <span className="text-gray-500">
                    {employee.YearsOfExperience}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex flex-col mb-4">
                  <span className="font-bold text-gray-600">Casual Leave:</span>
                  <span className="text-gray-500">{employee.CasualLeave}</span>
                </div>
                <div className="flex flex-col mb-4">
                  <span className="font-bold text-gray-600">Earned Leave:</span>
                  <span className="text-gray-500">{employee.EarnedLeave}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">
                    Date of Joining:
                  </span>
                  {employee.date_of_joining === null ? (
                    <span className="text-gray-300">NA</span>
                  ) : (
                    <span className="text-gray-500">
                      {employee.date_of_joining}
                    </span>
                  )}
                </div>
                <div className="flex flex-col mb-4">
                  <span className="font-bold text-gray-600">
                    Creation Date:
                  </span>
                  <span className="text-gray-500">{employee.created_at}</span>
                </div>
              </div>

              <div className="mt-6 flex space-x-4">
                <a
                  href={employee.experience_letter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Experience Letter
                </a>
                <a
                  href={employee.releiving_letter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Relieving Letter
                </a>
                <a
                  href={employee.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  View Resume
                </a>
              </div>
            </div>
          ) : (
            <div>No employee data available</div>
          )}
        </div>

        {/* Right Section: Buttons (Edit and Delete) */}
        <div className="flex flex-col space-y-4">
          <button
            onClick={handleEdit}
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Modal for Editing Employee */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Edit Employee
            </h2>
            <form>
              {/* All fields attached here */}
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Name :</label>
                <input
                  type="text"
                  name="name"
                  value={editedEmployee.name}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's name"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Email :</label>
                <input
                  type="email"
                  name="email"
                  value={editedEmployee.email}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's email"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Address :</label>
                <input
                  type="text"
                  name="address"
                  value={editedEmployee.address}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's address"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Gender :</label>
                <input
                  type="text"
                  name="gender"
                  value={editedEmployee.gender}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's address"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Department :</label>
                <input
                  type="text"
                  name="department"
                  value={editedEmployee.department}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's address"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">
                  Contact Number :
                </label>
                <input
                  type="number"
                  name="contact_number"
                  value={editedEmployee.contact_number}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's Contact"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Position :</label>
                <input
                  type="text"
                  name="position"
                  value={editedEmployee.position}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's Contact"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Tech Stack :</label>
                <input
                  type="text"
                  name="tech_stack"
                  value={editedEmployee.tech_stack}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's Contact"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Year Of Exp :</label>
                <input
                  type="text"
                  name="YearsOfExperience"
                  value={editedEmployee.YearsOfExperience}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's Contact"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">
                  Casual Leave :
                </label>
                <input
                  type="text"
                  name="CasualLeave"
                  value={editedEmployee.CasualLeave}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's Contact"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">
                  Earned Leave :
                </label>
                <input
                  type="text"
                  name="EarnedLeave"
                  value={editedEmployee.EarnedLeave}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter employee's Contact"
                />
              </div>
              {/* Add more fields here as needed */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)} // Close modal without saving
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="bg-blue-500 text-white px-6 py-3 rounded-md"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetailPage;
