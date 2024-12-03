import React from 'react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-8">HR Dashboard</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Employees */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Total Employees</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">150</p>
        </div>

        {/* New Hires */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">New Hires</h3>
          <p className="text-4xl font-bold text-gray-900 mt-2">15</p>
        </div>

        {/* Payroll Processed */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-700">Payroll Processed</h3>
          <p className="text-2xl font-bold text-gray-900 mt-2">November - $45,000</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Activities</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li className="text-gray-700">Employee Onboarding: John Doe (IT Department)</li>
          
          <li className="text-gray-700">Payroll Processed for November</li>
          <li className="text-gray-700">New Leave Requests: 5 pending approvals</li>
        </ul>
      </div>

      {/* Employee Overview Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Employee Overview</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left text-gray-600">Name</th>
              <th className="py-2 px-4 text-left text-gray-600">Department</th>
              <th className="py-2 px-4 text-left text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 text-gray-700">John Doe</td>
              <td className="py-2 px-4 text-gray-700">IT</td>
              <td className="py-2 px-4 text-gray-700">Active</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 text-gray-700">Jane Smith</td>
              <td className="py-2 px-4 text-gray-700">HR</td>
              <td className="py-2 px-4 text-gray-700">Active</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 text-gray-700">Mike Johnson</td>
              <td className="py-2 px-4 text-gray-700">Marketing</td>
              <td className="py-2 px-4 text-gray-700">On Leave</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Tasks/Reminders */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Upcoming Tasks/Reminders</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li className="text-gray-700">Performance Reviews due for 10 employees</li>
          <li className="text-gray-700">Schedule a meeting with the legal team</li>
          <li className="text-gray-700">Send monthly benefits reminders</li>
          <li className="text-gray-700">Approve leave requests for 5 employees</li>
        </ul>
      </div>
    </div>
  );
};

export default HomePage;
