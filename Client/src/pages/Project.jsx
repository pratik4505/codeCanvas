import React, { useState } from "react";
import AddCollaborator from "../components/Project/AddCollaborator";
import PageCommitsDialog from "../components/Project/PageCommitsDialog";

const Project = ({ project, goBack }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showCommitsDialog, setShowCommitsDialog] = useState(null);
  const [selectedCommits, setSelectedCommits] = useState([]);

  // Handle opening the dialog with commits of the clicked page
  const openCommitsDialog = (pageName) => {
    const commits = project.pages[pageName] || []; // Retrieve commits for the selected page
    setSelectedCommits(
      commits.sort((a, b) => new Date(b.date) - new Date(a.date))
    ); // Sort commits by date (newest first)
    setShowCommitsDialog(pageName);
  };

  return (
    <div className="p-4">
      <button
        onClick={goBack}
        className="bg-gray-500 text-white px-4 py-2 rounded mb-4 hover:bg-gray-600 transition"
      >
        Back to Projects
      </button>
      <h2 className="text-2xl font-bold mb-4">{project.name}</h2>

      {/* Collaborators Section */}
      <div className="mt-4">
        <h3 className="font-semibold">Collaborators:</h3>
        <p>{Object.values(project.collaborators).join(", ")}</p>
      </div>

      {/* Pages Section */}
      <div className="mt-4">
        <h3 className="font-semibold">Pages:</h3>
        <ul>
          {Object.keys(project.pages).map((page) => (
            <li key={page}>
              <button
                onClick={() => openCommitsDialog(page)}
                className="text-blue-500 hover:underline"
              >
                {page}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Add Collaborator Button */}
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

      {/* Dialog for viewing commits */}
      {showCommitsDialog && (
        <PageCommitsDialog
          commits={selectedCommits}
          onClose={() => setShowCommitsDialog(false)}
          projectId={project._id}
          page={showCommitsDialog}
        />
      )}
    </div>
  );
};

export default Project;
