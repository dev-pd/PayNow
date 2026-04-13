// // src/components/PaymentStatusModal.js
// import React from "react";

// const PaymentStatusModal = ({ isOpen, onClose, status }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
//       <div className="bg-white p-4 rounded-lg shadow-lg text-center">
//         {status === "loading" && <p>Loading...</p>}
//         {status === "succeeded" && (
//           <>
//             <p>Payment Successful!</p>
//             <button onClick={onClose}>Close</button>
//           </>
//         )}
//         {status === "failed" && (
//           <>
//             <p>Payment Failed. Please try again.</p>
//             <button onClick={onClose}>Close</button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PaymentStatusModal;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";

const PaymentStatusModal = ({ isOpen, onClose, status }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "succeeded") {
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Redirect after 2 seconds
    }
  }, [status, navigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
        {status === "loading" && (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"
              role="status">
              <span className="visually-hidden"></span>
            </div>
            <p className="text-lg text-gray-700">Processing your payment...</p>
          </div>
        )}
        {status === "succeeded" && (
          <div className="flex flex-col items-center justify-center space-y-3">
            <CheckCircleIcon className="w-16 h-16 text-green-500 animate-bounce" />
            <p className="text-lg font-medium text-gray-800">
              Payment Successful!
            </p>
          </div>
        )}
        {status === "failed" && (
          <div className="flex flex-col items-center justify-center space-y-3">
            <XCircleIcon className="w-16 h-16 text-red-500 animate-pulse" />
            <p className="text-lg font-medium text-gray-800">
              Payment Failed. Please try again.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline transition-colors duration-150 ease-in-out">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusModal;
