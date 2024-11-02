import React, { useState } from "react";

import AddCollaborator from "../components/Project/AddCollaborator";

const Project = ({ project, goBack }) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="p-4">
      <button
        onClick={goBack}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4 hover:bg-gray-600 transition"
      >
        Back to Projects
      </button>
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>
      <div className="mt-4">
        <h3 className="font-semibold">Collaborators:</h3>
        <p>{Object.values(project.collaborators).join(", ")}</p>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold">Pages:</h3>
        <p>{Object.keys(project.pages).join(", ")}</p>
      </div>
      <button
        onClick={() => setShowDialog(true)}
        className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 transition"
      >
        Add Collaborator
      </button>

      {/* Dialog for adding collaborator */}
      {showDialog && (
        <AddCollaborator setShowDialog={setShowDialog} project={project} />
      )}
    </div>
  );
};

export default Project;
