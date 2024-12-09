import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useUpdateHrMutation } from "../redux/api/Hr_api.js"; // Import the updateEmployee mutation

const HrDetail = () => {
  const { id } = useParams();
  const [hr, setHr] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false); // Modal visibility state
  const [editedHr, setEditedHr] = useState({}); // State to hold edited employee data
  const navigate = useNavigate();
  const [updateHr, { isLoading: isUpdating }] = useUpdateHrMutation(); // Destructure the mutation

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8080/api/hr/${id}`, { withCredentials: true })
      .then((response) => {
        setHr(response.data.hr);
        setEditedHr(response.data.hr); // Pre-fill modal with employee data
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
        `Are you sure you want to delete ${hr.name}?`
      );
      if (!confirmed) return;

      await axios.delete(`http://127.0.0.1:8080/api/hr/${id}`, {
        withCredentials: true,
      });

      toast.success(`Hr ${hr.name} deleted successfully!`, { duration: 3000 });
      navigate("/all-hr");
      window.location.reload();
    } catch (err) {
      alert("Failed to delete the employee: " + err.message);
    }
  };

  const handleModalChange = (e) => {
    setEditedHr({
      ...editedHr,
      [e.target.name]: e.target.value, // Dynamically update the corresponding field
    });
  };

  console.log(editedHr);

  const handleSaveChanges = async () => {
    try {
      // Call the updateEmployee mutation
      const res = await updateHr({ id, hrData: editedHr });
      console.log(res);
      toast.success("Hr details updated successfully!");
      setModalOpen(false); // Close the modal after successful update
      setHr(editedHr); // Update the displayed employee data
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

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-md flex gap-8">
        {/* Left Section: Employee Details */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Hr Details
          </h2>
          {hr ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">Name:</span>
                  <span className="text-gray-500">{hr.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">Email:</span>
                  <span className="text-gray-500">{hr.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-600">Role:</span>
                  <span className="text-gray-500">{hr.role}</span>
                </div>
              </div>
            </div>
          ) : (
            <div>No Hr data available</div>
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
              Edit Hr
            </h2>
            <form>
              {/* All fields attached here */}
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editedHr.name}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter Hr's name"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editedHr.email}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter hr's email"
                />
              </div>
              <div className="flex flex-col mb-4">
                <label className="font-bold text-gray-600">Role:</label>
                <input
                  type="text"
                  name="address"
                  value={editedHr.role}
                  onChange={handleModalChange}
                  className="px-4 py-2 border rounded-md"
                  placeholder="Enter hr's Role"
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

export default HrDetail;
