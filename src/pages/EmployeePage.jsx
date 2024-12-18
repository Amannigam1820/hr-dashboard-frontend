import React, { useEffect, useState } from "react";
import { useTable, useSortBy, usePagination } from "react-table";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import SearchTech from "../components/SearchTech";

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
    Header: "Gender",
    accessor: "gender",
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
        <h1 className="hover:scale-110 transition-transform duration-300 ease-in-out">Experience_letter.pdf</h1>
      </a>
    ),
  },
  {
    Header: "Releiving Letter",
    accessor: "releiving_letter",
    Cell: ({ value }) => (
      <a href={value} target="_blank" rel="noopener noreferrer">
        <h1 className="hover:scale-110 transition-transform duration-300 ease-in-out">releiving_letter.pdf</h1>
      </a>
    ),
  },
  {
    Header: "Resume",
    accessor: "resume",
    Cell: ({ value }) => (
      <a href={value} target="_blank" rel="noopener noreferrer">
        <h1 className="hover:scale-110 transition-transform duration-300 ease-in-out">DownLoad Resume</h1>
      </a>
    ),
  },
  {
    Header: "Performance",
    accessor: "performance",
    Cell: ({ value }) => {
      const performance = parseInt(value, 10);
      const totalStars = 5;

      const yellowStars = performance >= 0 ? Math.min(performance, totalStars) : 0;
      const grayStars = totalStars - yellowStars;

      const stars = [];
      for (let i = 0; i < yellowStars; i++) {
        stars.push(
          <span key={`yellow-${i}`} className="text-yellow-400">
            🤩
          </span>
        );
      }

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
    Header: "Department",
    accessor: "department",
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
        <button
          className="px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded hover:bg-blue-600"
        >
          Edit
        </button>

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
    const confirmed = window.confirm(`Are you sure you want to delete ${employee.name}?`);
    if (!confirmed) return;

    // Make DELETE request
    await axios.delete(`http://127.0.0.1:8080/api/employee/${employee.id}`, {
      withCredentials: true,
    });

    toast.success(`Employee ${employee.name} deleted successfully!`);
    window.location.reload();
  } catch (err) {
    alert("Failed to delete the employee: " + err.message);
  }
};

const EmployeePage = () => {
  const [data, setData] = useState([{}]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the API with credentials
    axios
      .get("http://127.0.0.1:8080/api/employee/all", { withCredentials: true })
      .then((response) => {
        const dataArray = Object.values(response.data.data);
        setData(dataArray);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching data: " + err.message);
        setLoading(false);
      });
  }, []);

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
      initialState: { pageSize: 5 },
    },
    useSortBy,
    usePagination
  );

  const handleRowClick = (employeeId) => {
    navigate(`/employee-detail/${employeeId}`);
  };

  return (
    <div className="flex">
      {/* Left side for Employee Table */}
      <div className="w-3/4 p-6">
        <div className="overflow-x-auto bg-white p-6 rounded-lg shadow-md">
          <table {...getTableProps()} className="min-w-full table-auto border-separate border-spacing-0">
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
                    className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50 transition-colors duration-200 cursor-pointer`}
                    onClick={() => handleRowClick(row.original.id)}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="px-4 py-3 text-xs text-gray-700 border-b border-gray-200">
                        {cell.column.id === "actions" ? cell.render("Cell") : cell.value || "-"}
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
              canPreviousPage ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500" : "bg-gray-300 cursor-not-allowed"
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
              canNextPage ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500" : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!canNextPage}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
      </div>

      {/* Right side for SearchTech */}
      <div className="flex flex-col bg-white p-6 shadow-lg rounded-lg border border-gray-200">
  <h3 className="text-xl font-semibold text-gray-700 mb-4">Filters</h3>
  
  <div className="w-full p-6">
    <SearchTech />
  </div>
</div>
    </div>
  );
};

export default EmployeePage;
