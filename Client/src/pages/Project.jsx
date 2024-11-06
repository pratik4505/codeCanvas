import React, { useState } from "react";
import AddCollaborator from "../components/Project/AddCollaborator";
import PageCommitsDialog from "../components/Project/PageCommitsDialog";
import AddPageDialog from "../components/Project/AddPageDialog"; // Import the new dialog component

const Project = ({ project, goBack }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showCommitsDialog, setShowCommitsDialog] = useState(null);
  const [selectedCommits, setSelectedCommits] = useState([]);
  const [showAddPageDialog, setShowAddPageDialog] = useState(false); // State for the add page dialog

  // Handle opening the dialog with commits of the clicked page
  const openCommitsDialog = (pageName) => {
    const commits = project.pages[pageName] || []; // Retrieve commits for the selected page
    setSelectedCommits(
      commits.sort((a, b) => new Date(b.date) - new Date(a.date))
    ); // Sort commits by date (newest first)
    setShowCommitsDialog(pageName);
  };

  // Function to handle adding a new page
  const handlePageAdded = (newPage) => {
    // Update the project with the new page here if necessary
    project.pages[newPage.name] = [newPage.value]; // Initialize with an empty array of commits
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center">
      <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-2xl">
        {/* Back to Projects Button */}
        <button
          onClick={goBack}
          className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 rounded-lg mb-6 w-full hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105"
        >
          Back to Projects
        </button>
  
        {/* Project Name */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          {project.name}
        </h2>
  
        {/* Collaborators Section */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-gray-800">Collaborators:</h3>
          <p className="text-gray-700">{Object.values(project.collaborators).join(", ")}</p>
        </div>
  
        {/* Pages Section */}
        <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-gray-800">Pages:</h3>
          <ul className="list-disc pl-5 space-y-2">
            {Object.keys(project.pages).map((page) => (
              <li key={page}>
                <button
                  onClick={() => openCommitsDialog(page)}
                  className="text-blue-600 hover:text-blue-800 hover:underline transition duration-300"
                >
                  {page}
                </button>
              </li>
            ))}
          </ul>
        </div>
  
        {/* Add Page Button */}
        <button
          onClick={() => setShowAddPageDialog(true)}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg mt-6 w-full hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105"
        >
          Add Page
        </button>
  
        {/* Add Collaborator Button */}
        <button
          onClick={() => setShowDialog(true)}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg mt-4 w-full hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
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
  
        {/* Dialog for adding a new page */}
        {showAddPageDialog && (
          <AddPageDialog
            setShowDialog={setShowAddPageDialog}
            projectId={project._id}
            onPageAdded={handlePageAdded}
            project={project}
          />
        )}
      </div>
    </div>
  );
  
  
  
};

export default Project;
