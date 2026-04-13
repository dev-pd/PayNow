// // src/components/PaymentPage.js
// import React, { useState } from "react";
// import { Elements } from "@stripe/react-stripe-js";
// import { stripePromise } from "../stripe";
// import PaymentForm from "./PaymentForm";
// //import { UserContext } from "../context/UserContext";
// import { useLocation } from "react-router-dom";
// import PaymentStatusModal from "./PaymentStatusModal";

// function PaymentPage() {
//   const location = useLocation();
//   const { username, totalExpenses } = location.state || {};
//   const [paymentStatus, setPaymentStatus] = useState(null); // 'loading', 'succeeded', 'failed'

//   if (!username) {
//     // Handle the case where there is no user logged in
//     return <div>Please log in to proceed with the payment.</div>;
//   }

//   const onPaymentStatusChange = (status) => {
//     setPaymentStatus(status); // Update payment status based on the form's actions
//   };

//   return (
//     <div className="payment-container">
//       <Elements stripe={stripePromise}>
//         <PaymentForm
//           username={username}
//           totalExpenses={totalExpenses}
//           onPaymentStatusChange={onPaymentStatusChange}
//         />
//       </Elements>
//       <PaymentStatusModal
//         isOpen={paymentStatus !== null}
//         onClose={() => setPaymentStatus(null)}
//         status={paymentStatus}
//       />
//     </div>
//   );
// }

// export default PaymentPage;

import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "../stripe";
import PaymentForm from "./PaymentForm";
import { useNavigate, useLocation } from "react-router-dom";
import PaymentStatusModal from "./PaymentStatusModal";

function PaymentPage() {
  const location = useLocation();
  const { username, totalExpenses } = location.state || {};
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  if (!username) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-4 bg-white shadow-md rounded-lg max-w-sm">
          Please log in to proceed with the payment.
        </div>
      </div>
    );
  }

  const onPaymentStatusChange = (status) => {
    setPaymentStatus(status);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-md">
        {/* <h1 className="text-xl font-semibold text-gray-800 mb-4">
          Kleeviyo Pay
        </h1> */}
        <Elements stripe={stripePromise}>
          <PaymentForm
            username={username}
            totalExpenses={totalExpenses}
            onPaymentStatusChange={onPaymentStatusChange}
          />
        </Elements>
        <div className="flex justify-center mt-6">
          {" "}
          {/* Added div for margin-top */}
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-700 hover:to-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300 ease-in-out">
            Back
          </button>
        </div>
      </div>
      <PaymentStatusModal
        isOpen={paymentStatus !== null}
        onClose={() => setPaymentStatus(null)}
        status={paymentStatus}
      />
      <footer className="w-full text-center p-4 text-sm text-gray-600 mt-4">
        Powered by Stripe for Kleeviyo | Owned by Prasad Deshpande
      </footer>
    </div>
  );
}

export default PaymentPage;
