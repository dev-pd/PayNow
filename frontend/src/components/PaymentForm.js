import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const PaymentForm = ({ username, totalExpenses, onPaymentStatusChange }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handlePayment = async (event) => {
    event.preventDefault();
    onPaymentStatusChange("loading"); // Set loading state

    if (!stripe || !elements) {
      console.error("Stripe has not loaded");
      onPaymentStatusChange("failed");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      onPaymentStatusChange("failed");
    } else {
      submitPaymentToServer(paymentMethod.id, username, totalExpenses);
    }
  };

  const submitPaymentToServer = async (
    paymentMethodId,
    username,
    totalExpenses
  ) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/payments/`, {
        payment_method_id: paymentMethodId,
        username: username,
        amount: totalExpenses,
      });
      if (response.status === 200) {
        onPaymentStatusChange("succeeded");
        setTimeout(() => navigate("/dashboard"), 2000); // Redirect after 2 seconds
      } else {
        throw new Error("Payment processing failed.");
      }
    } catch (error) {
      console.error("Payment submission error:", error.response);
      onPaymentStatusChange("failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 md:p-8 border border-gray-300 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Payment Information
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Monthly Expenses
        </label>
        <p className="text-gray-800 text-lg">${totalExpenses.toFixed(2)}</p>
      </div>
      <form
        onSubmit={handlePayment}
        className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Card Details
          </label>
          <CardElement className="p-3 bg-gray-50 border border-gray-300 rounded" />
        </div>
        <button
          type="submit"
          disabled={!stripe}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ease-in-out">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
