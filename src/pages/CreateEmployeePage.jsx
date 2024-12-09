import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAddEmployeeMutation } from "../redux/api/Hr_api.js";

const CreateEmployeePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    ContactNumber: "",
    TechStack: "",
    DateOfJoining: "",
    position: "",
    YearsOfExperience: "",
    CasualLeave: "",
    EarnedLeave: "",
    salary: "",
    performance: "",
    birth_date: "",
    address: "",
    resume: null,
    experience_letter: null,
    releiving_letter: null,
  });

  const [loading, setLoading] = useState(false); // Loading state for tracking submission progress
  const navigate = useNavigate();
  const [addEmployee] = useAddEmployeeMutation();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prevData) => ({ ...prevData, [name]: files[0] })); // Handle file uploads
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading to true when submission starts
    setLoading(true);

    // Prepare the payload
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        payload.append(key, formData[key]);
      }
    });

    try {
      const res = await addEmployee(payload);
      console.log(formData);

      if ("data" in res) {
        // Success Response
        toast.success(res.data.message);
        navigate("/employees"); // Navigate to another page
      } else {
        // Error Response
        const error = res.error;
        const message = error?.data?.message || "An unknown error occurred.";
        toast.error(message);
      }
    } catch (error) {
      toast.error("Submission Failed");
    } finally {
      // Set loading to false after request is complete
      setLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 overflow-hidden"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Hides scrollbar
    >
      <div className="w-full max-w-7xl p-8 bg-white rounded-lg shadow-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Add New Employee
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Text Fields */}
            {[
              { label: "Name", name: "name", type: "text", placeholder: "Enter name" },
              { label: "Email", name: "email", type: "email", placeholder: "Enter email" },
              { label: "Contact Number", name: "ContactNumber", type: "text", placeholder: "Enter contact number" },
              { label: "Tech Stack", name: "TechStack", type: "text", placeholder: "Enter tech stack" },
              { label: "Date of Joining", name: "date_of_joining", type: "date" },
              { label: "Position", name: "position", type: "text", placeholder: "Enter position" },
              { label: "Years of Experience", name: "YearsOfExperience", type: "number", placeholder: "Enter experience in years" },
              { label: "Casual Leaves (CL)", name: "CasualLeave", type: "number" },
              { label: "Earned Leaves (EL)", name: "EarnedLeave", type: "number" },
              { label: "Salary", name: "salary", type: "number", placeholder: "Enter salary" },
              { label: "Performance", name: "performance", type: "text", placeholder: "Enter performance rating" },
              { label: "Birth Date", name: "birth_date", type: "date" },
              { label: "Address", name: "address", type: "text", placeholder: "Enter address" },
            ].map((field) => (
              <div className="flex flex-col w-1/4" key={field.name}>
                <label
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500 transition"
                  placeholder={field.placeholder || ""}
                />
              </div>
            ))}

            {/* File Upload Fields */}
            {[
              { label: "Resume", name: "resume" },
              { label: "Experience Letter", name: "experience_letter" },
              { label: "Relieving Letter", name: "releiving_letter" },
            ].map((fileField) => (
              <div className="flex flex-col w-1/4" key={fileField.name}>
                <label
                  htmlFor={fileField.name}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {fileField.label}
                </label>
                <input
                  type="file"
                  id={fileField.name}
                  name={fileField.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-400 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-purple-600 transition"
              disabled={loading} // Disable the button while loading
            >
              {loading ? (
                <span>Loading...</span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeePage;
