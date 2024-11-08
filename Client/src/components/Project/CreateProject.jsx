import React, { useState } from "react";
import { createProject, deployProject } from "../../Api/projectApi";

const CreateProject = ({ setShowDialog, setProjects }) => {
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await createProject({ name: projectName });

      if (response.error) {
        setError("Failed to create project. Please try again.");
        setLoading(false);
        return;
      }
      console.log(response.data);
      setProjects((prevProjects) => [...prevProjects, response.data]); // Add new project to the projects list
      setShowDialog(false); // Close the dialog
    } catch (err) {
      setError("Failed to create project. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="projectName">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
              className="border border-gray-300 rounded w-full p-2"
              placeholder="Enter project name"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {loading ? "Creating..." : "Create Project"}
          </button>
          <button
            type="button"
            onClick={() => setShowDialog(false)}
            className="mt-2 text-gray-600 underline"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
