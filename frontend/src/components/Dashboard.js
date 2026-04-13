import React, { useState, useEffect, useContext } from "react";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto"; // Import this to avoid "Chart is not defined" error
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import { API_BASE_URL } from "../config";

function Dashboard() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      axios
        .get(`${API_BASE_URL}/api/expenses/?username=${user.username}`)
        .then((response) => {
          const transformedData = response.data.map((expense) => ({
            ...expense,
            amount_paid: parseFloat(expense.amount_paid),
            remaining_amount: parseFloat(expense.remaining_amount),
            total_expenses: parseFloat(expense.total_expenses),
            groceries: parseFloat(expense.groceries),
            transportation: parseFloat(expense.transportation),
            utilities: parseFloat(expense.utilities),
            dining: parseFloat(expense.dining),
            entertainment: parseFloat(expense.entertainment),
            healthcare: parseFloat(expense.healthcare),
          }));
          setExpenses(transformedData);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching expenses:", error);
          setLoading(false);
        });
    }
  }, [user]);

  const categories = [
    "Groceries",
    "Transportation",
    "Utilities",
    "Dining",
    "Entertainment",
    "Healthcare",
  ];
  const categoryAmounts = categories.map((category) => {
    return expenses.reduce(
      (sum, item) => sum + (item[category.toLowerCase()] || 0),
      0
    );
  });

  const pieData = {
    labels: categories,
    datasets: [
      {
        data: categoryAmounts,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#F7464A",
          "#AC64AD",
        ],
      },
    ],
  };

  // Bar Chart Data
  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses by Category",
        data: categoryAmounts,
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#F7464A",
          "#AC64AD",
        ],
        borderColor: ["#FFFFFF"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ["Paid", "Remaining"],
    datasets: [
      {
        data: [expenses[0]?.amount_paid, expenses[0]?.remaining_amount],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Handle Pay Now button click
  const handlePayNow = () => {
    navigate("/payment", {
      state: {
        username: user.username,
        totalExpenses: expenses[0]?.total_expenses,
      },
    });
  };

  const handleEditExpenses = () => {
    navigate("/expenses");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-14 bg-gray-100 min-h-screen">
      <div className="mb-4 bg-white p-8 rounded-lg shadow-lg flex justify-between items-center border border-gray-200">
        <button
          onClick={handleEditExpenses}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 focus:outline-none focus:shadow-outline">
          Edit Expenses
        </button>
        <div>
          <h2 className="text-2xl font-semibold">Monthly Expenses</h2>
          <p className="text-xl font-medium">
            Total: ${expenses[0]?.total_expenses}
          </p>
        </div>
        <button
          onClick={handlePayNow}
          className="bg-red-500 text-white font-bold py-2 px-6 rounded-full hover:bg-red-600 focus:outline-none focus:shadow-outline">
          Pay Now
        </button>
      </div>

      <div className="flex justify-between items-start space-x-8">
        {/* Pie Chart Card */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Expenses Distribution</h2>
          <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
            <Pie data={pieData} />
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Expenses Overview</h2>
          <div style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
            <Bar data={barData} />
          </div>
        </div>
        <div className="flex-1 bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
          <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
