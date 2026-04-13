import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { API_BASE_URL } from "../config";

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

// Mock any GET request to /api/expenses/ for different users
mock
  .onGet(`${API_BASE_URL}/api/expenses/`, {
    params: { username: "prasad" },
  })
  .reply(200, {
    username: "prasad",
    monthlyExpense: 1500,
    expenses: [
      { id: 1, category: "Grocery", amount: 300, date: "2024-08-10" },
      { id: 2, category: "Transportation", amount: 150, date: "2024-08-11" },
      { id: 3, category: "Utilities", amount: 250, date: "2024-08-15" },
      { id: 4, category: "Dining", amount: 200, date: "2024-08-20" },
      { id: 5, category: "Entertainment", amount: 100, date: "2024-08-22" },
      { id: 6, category: "Healthcare", amount: 500, date: "2024-08-25" },
    ],
  });

mock
  .onGet(`${API_BASE_URL}/api/expenses/`, {
    params: { username: "morya" },
  })
  .reply(200, {
    username: "morya",
    monthlyExpense: 1300,
    expenses: [
      { id: 1, category: "Grocery", amount: 280, date: "2024-08-09" },
      { id: 2, category: "Transportation", amount: 120, date: "2024-08-12" },
      { id: 3, category: "Utilities", amount: 300, date: "2024-08-14" },
      { id: 4, category: "Rent", amount: 600, date: "2024-08-01" },
      { id: 5, category: "Entertainment", amount: 100, date: "2024-08-21" },
    ],
  });

mock
  .onGet(`${API_BASE_URL}/api/expenses/`, {
    params: { username: "ojasvi" },
  })
  .reply(200, {
    username: "ojasvi",
    monthlyExpense: 1800,
    expenses: [
      { id: 1, category: "Grocery", amount: 400, date: "2024-08-08" },
      { id: 2, category: "Transportation", amount: 180, date: "2024-08-16" },
      { id: 3, category: "Rent", amount: 800, date: "2024-08-02" },
      { id: 4, category: "Utilities", amount: 220, date: "2024-08-18" },
      { id: 5, category: "Entertainment", amount: 200, date: "2024-08-23" },
    ],
  });
