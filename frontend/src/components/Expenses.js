import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function ExpenseForm() {
  const { user } = useContext(UserContext);
  const [month, setMonth] = useState("");
  const [groceries, setGroceries] = useState(0);
  const [transportation, setTransportation] = useState(0);
  const [utilities, setUtilities] = useState(0);
  const [dining, setDining] = useState(0);
  const [entertainment, setEntertainment] = useState(0);
  const [healthcare, setHealthcare] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const expenseData = {
      username: user.username,
      month: `${month}-01`, // Append '-01' to set it to the first day of the month
      groceries,
      transportation,
      utilities,
      dining,
      entertainment,
      healthcare,
    };

    try {
      await axios.post(`${API_BASE_URL}/api/expenses/`, expenseData);
      alert("Expenses submitted successfully!");
    } catch (error) {
      console.error("Failed to submit expenses:", error);
      alert("Failed to submit expenses. Please try again.");
    }
  };

  const handleViewDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="month">
            Month & Year
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="month"
            id="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {createInputField("Groceries", groceries, setGroceries)}
          {createInputField(
            "Transportation",
            transportation,
            setTransportation
          )}
          {createInputField("Utilities", utilities, setUtilities)}
          {createInputField("Dining", dining, setDining)}
          {createInputField("Entertainment", entertainment, setEntertainment)}
          {createInputField("Healthcare", healthcare, setHealthcare)}
        </div>
        <div className="flex items-center justify-between mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit">
            Submit Expenses
          </button>
          <button
            onClick={handleViewDashboard}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button">
            View Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}

function createInputField(label, value, setValue) {
  return (
    <div className="mb-6">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={label.toLowerCase()}>
        {label}
      </label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="number"
        id={label.toLowerCase()}
        min="0"
        step="0.01"
        value={value}
        onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
        required
      />
    </div>
  );
}

export default ExpenseForm;

// import React, { useState, useEffect, useContext } from "react";
// import axios from "axios";
// import { UserContext } from "../context/UserContext";
// import { useNavigate } from "react-router-dom";

// function ExpenseForm() {
//   const { user } = useContext(UserContext);
//   const [month, setMonth] = useState("");
//   const [expenses, setExpenses] = useState({
//     groceries: 0,
//     transportation: 0,
//     utilities: 0,
//     dining: 0,
//     entertainment: 0,
//     healthcare: 0,
//   });
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (month !== "") {
//       axios
//         .get(
//           `http://127.0.0.1:8000/api/expenses/${month}?username=${user.username}`
//         )
//         .then((response) => {
//           setExpenses(response.data);
//         })
//         .catch((error) => {
//           console.error("Error fetching expenses:", error);
//           setExpenses({
//             groceries: 0,
//             transportation: 0,
//             utilities: 0,
//             dining: 0,
//             entertainment: 0,
//             healthcare: 0,
//           });
//         });
//     }
//   }, [month, user.username]);

//   const handleChange = (field, value) => {
//     setExpenses((prevState) => ({
//       ...prevState,
//       [field]: parseFloat(value) || 0,
//     }));
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     const year = new Date(month).getFullYear();
//     const monthNumber = new Date(month).getMonth() + 1; // JavaScript months are 0-indexed

//     try {
//       await axios.post(
//         `http://127.0.0.1:8000/api/expenses/${year}/${monthNumber}`,
//         {
//           username: user.username,
//           ...expenses,
//         }
//       );
//       alert("Expenses submitted successfully!");
//       navigate("/dashboard");
//     } catch (error) {
//       console.error("Failed to submit expenses:", error);
//       alert("Failed to submit expenses. Please try again.");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-5">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//         <div className="mb-4">
//           <label
//             className="block text-gray-700 text-sm font-bold mb-2"
//             htmlFor="month">
//             Month & Year
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             type="month"
//             id="month"
//             value={month}
//             onChange={(e) => setMonth(e.target.value)}
//             required
//           />
//         </div>
//         {Object.keys(expenses).map((key) => (
//           <div
//             className="mb-6"
//             key={key}>
//             <label
//               className="block text-gray-700 text-sm font-bold mb-2"
//               htmlFor={key}>
//               {key.charAt(0).toUpperCase() + key.slice(1)}
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               type="number"
//               id={key}
//               min="0"
//               step="0.01"
//               value={expenses[key]}
//               onChange={(e) => handleChange(key, e.target.value)}
//               required
//             />
//           </div>
//         ))}
//         <div className="flex items-center justify-between mt-6">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             type="submit">
//             Submit Expenses
//           </button>
//           <button
//             onClick={() => navigate("/dashboard")}
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             type="button">
//             View Dashboard
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default ExpenseForm;
