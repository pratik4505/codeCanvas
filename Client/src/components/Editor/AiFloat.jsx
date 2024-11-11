import React, { useState } from "react";
import CodeGenerator from "./CodeGenerator"; // Import the CodeGenerator component

export const FloatingButtonWithPopup = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  return (
    <div>
      {/* Floating Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105"
        onClick={() => setIsPopupVisible(true)}
      >
        AI
      </button>

      {/* Popup Modal */}
      {isPopupVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 opacity-100">
          <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg transform transition-all ease-in-out scale-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">AI Panel</h2>
              <button
                className="text-gray-600 hover:text-gray-900 text-2xl"
                onClick={() => setIsPopupVisible(false)}
              >
                ✕ {/* Close icon */}
              </button>
            </div>
            <CodeGenerator />
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingButtonWithPopup;
