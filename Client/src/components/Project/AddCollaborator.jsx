import React from "react";
import { useState } from "react";
import { addCollaborator } from "../../Api/projectApi";
const AddCollaborator = ({ setShowDialog, project }) => {
  const [newCollaboratorName, setNewCollaboratorName] = useState("");

  const [error, setError] = useState(null);

  const handleAddCollaborator = async () => {
    try {
      const response = await addCollaborator({
        projectId: project._id,
        userName: newCollaboratorName,
      });

      if (response.error) {
        setError("Failed to add collaborator");
        return;
      }

      // Assuming response.data contains the new collaborator's id and name
      const { id, name } = response.data;

      // Update the collaborators in the project
      project.collaborators[id] = name; // Update state directly for simplicity (better to manage state in a parent or use state management)

      setShowDialog(false);
      setNewCollaboratorName("");
    } catch (err) {
      setError("Failed to add collaborator");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">Add Collaborator</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <input
          type="text"
          placeholder="Enter collaborator's name"
          value={newCollaboratorName}
          onChange={(e) => setNewCollaboratorName(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddCollaborator}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Add
          </button>
          <button
            onClick={() => setShowDialog(false)}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2 hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCollaborator;
