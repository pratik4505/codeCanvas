import React, { useState } from "react";
import axios from "axios"; // Assuming you're using axios for API calls
import { addPage } from "../../Api/projectApi";

const AddPageDialog = ({ setShowDialog, projectId, onPageAdded, project }) => {
  const [pageName, setPageName] = useState("");
  const [error, setError] = useState("");
  const projectName = project.name;
  const handleSubmit = async () => {
    console.log()
    // Check if pageName is empty
    if (!pageName) {
      setError("Page name is required.");
      return;
    }

    // Check if the page name already exists
    if (project.pages.hasOwnProperty(pageName)) {
      setError("Page name already exists. Please choose a different name.");
      return;
    }

    try {
      // Send request to backend to add the page
      const response = await addPage({
        projectId,
        pageName,
        projectName
      });
      if (response.error) {
        setError("Failed to add page. Please try again.");
        return;
      }

      // Call the onPageAdded function to update the parent component
      onPageAdded(response.data);

      // Close the dialog
      setShowDialog(false);
    } catch (err) {
      setError("Failed to add page. Please try again.");
      console.error("Error adding page:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">Add New Page</h2>
        <input
          type="text"
          placeholder="Enter page name"
          value={pageName}
          onChange={(e) => {
            setPageName(e.target.value);
            setError(""); // Clear error when user starts typing
          }}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Add Page
        </button>
        <button
          onClick={() => setShowDialog(false)}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition ml-2"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddPageDialog;
