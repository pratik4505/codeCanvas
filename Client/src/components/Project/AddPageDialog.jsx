import React, { useState } from "react";
import axios from "axios";
import { addPage } from "../../Api/projectApi";
import { toast } from "react-toastify";
const AddPageDialog = ({ setShowDialog, projectId, onPageAdded, project }) => {
  const [pageName, setPageName] = useState("");
  const [error, setError] = useState("");
  const projectName = project.name;
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!pageName) {
      setError("Page name is required.");
      setLoading(false);
      return;
    }

    if (project.pages.hasOwnProperty(pageName)) {
      setError("Page name already exists. Please choose a different name.");
      return;
    }

    try {
      const response = await addPage({
        projectId,
        pageName,
        projectName,
      });
      if (response.error) {
        setError("Failed to add page. Please try again.");
        return;
      }

      onPageAdded(response.data);
      toast.success("Page added Successfully");

      setShowDialog(false);
      setLoading(false);
    } catch (err) {
      setLoading(false);
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
            setError("");
          }}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Adding..." : "Add Page "}
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
