import React, { useEffect, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
// import { useAllEmployeeQuery } from "../redux/api/Hr_api";
import axios from "axios";
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom";

const columns = [

  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Address",
    accessor: "address",
  },
  {
    Header: "Contact Number",
    accessor: "contact_number",
  },
  {
    Header: "Birth Date",
    accessor: "birth_date",
  },
  {
    Header: "Casual Leave",
    accessor: "CasualLeave",
  },
  {
    Header: "Earned Leave",
    accessor: "EarnedLeave",
  },
  {
    Header: "Creation On",
    accessor: "created_at",
  },
  {
    Header: "Date Of Joining",
    accessor: "date_of_joining",
  },
  {
    Header: "Experince Letter",
    accessor: "experience_letter",
    Cell: ({ value }) => (
      <a href={value} target="_blank" rel="noopener noreferrer">
        <img
          src={value}
          alt="Resume"
          className="h-12 w-12 object-cover rounded-md cursor-pointer"
        />
      </a>
    ),
  },
  {
    Header: "Releiving Letter",
    accessor: "releiving_letter",
    Cell: ({ value }) => (
      <a href={value} target="_blank" rel="noopener noreferrer">
        <img
          src={value}
          alt="Resume"
          className="h-12 w-12 object-cover rounded-md cursor-pointer"
        />
      </a>
    ),
  },
  {
    Header: "Reume",
    accessor: "resume",
    Cell: ({ value }) => (
      <a href={value} target="_blank" rel="noopener noreferrer">
        <img
          src={value}
          alt="Resume"
          className="h-12 w-12 object-cover rounded-md cursor-pointer"
        />
      </a>
    ),
  },
  {
    Header: "Performance",
    accessor: "performance",
    Cell: ({ value }) => {
      const performance = parseInt(value, 10);
      const totalStars = 5; // Total number of stars to display

      // Calculate yellow and gray stars based on performance value
      const yellowStars =
        performance >= 0 ? Math.min(performance, totalStars) : 0;
      const grayStars = totalStars - yellowStars;

      const stars = [];

      // Add yellow stars
      for (let i = 0; i < yellowStars; i++) {
        stars.push(
          <span key={`yellow-${i}`} className="text-yellow-400">
            🤩
          </span>
        );
      }

      // Add gray stars
      for (let i = 0; i < grayStars; i++) {
        stars.push(
          <span key={`gray-${i}`} className="text-gray-400">
            ⭐
          </span>
        );
      }

      return <div>{stars}</div>;
    },
  },
  {
    Header: "Position",
    accessor: "position",
  },
  {
    Header: "Salary",
    accessor: "salary",
  },
  {
    Header: "Tech Stack",
    accessor: "tech_stack",
  },
  {
    Header: "Year Of Experience",
    accessor: "YearsOfExperience",
  },
  {
    Header: "Updated ON",
    accessor: "updated_at",
  },
  {
    Header: "Actions",
    accessor: "actions",
    Cell: ({ row }) => (
      <div className="flex space-x-2">
        {/* Edit Button */}
        <button
        //  onClick={() => handleEdit(row.original)}
          className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded hover:bg-blue-600"
        >
          Edit
        </button>

        {/* Delete Button */}
        <button
          onClick={() => handleDelete(row.original)}
          className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    ),
  },
  
];
const handleDelete = async (employee) => {
  try {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );
    if (!confirmed) return;

    // Make DELETE request
    await axios.delete(`http://127.0.0.1:8080/api/employee/${employee.id}`, {
      withCredentials: true,
    });

    
toast.success(`Employee ${employee.name} deleted successfully!`)
window.location.reload()
    //alert(`Employee ${employee.name} deleted successfully!`);
  } catch (err) {
    alert("Failed to delete the employee: " + err.message);
  }
};
const EmployeePage = () => {
  // const { data, error, isLoading } = useAllEmployeeQuery();
  // console.log(data);
  const [data, setData] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch data from the API with credentials
    axios
      .get("http://127.0.0.1:8080/api/employee/all", { withCredentials: true })
      .then((response) => {
        //   console.log(typeof response.data.data); // Logs "object"
        //  console.log(response.data.data); // Logs the actual object

        // If it's an object and you want to convert it to an array of objects
        const dataArray = Object.values(response.data.data); // Convert object to array

        console.log(dataArray); // Logs the array

        setData(dataArray); // Set the data as an array
        setLoading(false); // Set loading to false after data is fetched
      })
      .catch((err) => {
        setError("Error fetching data: " + err.message); // Handle error
        setLoading(false); // Set loading to false in case of error
      });
  }, []);
  //console.log(data);

  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    state: { pageIndex },
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 6 }, // Set pageSize to 1 to show one row per page
    },
    useSortBy,
    usePagination
  );

  const handleRowClick = (employeeId) => {
    navigate(`/employee-detail/${employeeId}`); // Redirect to employee-detail page with employee ID
  };

  return (
    <>
      <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
        <table
          {...getTableProps()}
          className="min-w-full table-auto border-separate border-spacing-0"
        >
          <thead>
            {headerGroups.map((hg) => (
              <tr {...hg.getHeaderGroupProps()} className="bg-blue-100">
                {hg.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps)}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wide cursor-pointer"
                  >
                    {column.render("Header")}
                    {column.isSorted && (
                      <span className="ml-2 text-xs text-gray-500">
                        {column.isSortedDesc ? "⬇️" : "⬆️"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition-colors duration-200 cursor-pointer`}
                  onClick={() => handleRowClick(row.original.id)}
                >{row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-3 text-xs text-gray-700 border-b border-gray-200"
                  >
                    {cell.column.id === "actions"
                      ? cell.render("Cell") // Render buttons for the actions column
                      : cell.value === null || cell.value === undefined || cell.value === ""
                      ? "-" // Render "-" for null/undefined/empty values
                      : cell.render("Cell")} 
                  </td>
                ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-center space-x-4">
        <button
          className={`px-6 py-2 text-white font-semibold rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
            canPreviousPage
              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!canPreviousPage}
          onClick={previousPage}
        >
          Prev
        </button>
        <span>
          {pageIndex + 1} of {pageCount}
        </span>
        <button
          className={`px-6 py-2 text-white font-semibold rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all ${
            canNextPage
              ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={!canNextPage}
          onClick={nextPage}
        >
          Next
        </button>
      </div>
    </>
  );
};

//export default EmployeePage;

export default EmployeePage;
