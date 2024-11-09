import React, { useState } from "react";
import AddCollaborator from "../components/Project/AddCollaborator";
import PageCommitsDialog from "../components/Project/PageCommitsDialog";
import AddPageDialog from "../components/Project/AddPageDialog";
import { useNavigate } from "react-router-dom";
import { deployProject } from "../Api/projectApi";

const Project = ({ project, goBack }) => {
  const navigate = useNavigate();
  console.log(project)

  const goHome = () => {
    navigate("/");
  };

  const [showDialog, setShowDialog] = useState(false);
  const [showCommitsDialog, setShowCommitsDialog] = useState(null);
  const [selectedCommits, setSelectedCommits] = useState([]);
  const [showAddPageDialog, setShowAddPageDialog] = useState(false);

  const openCommitsDialog = (pageName) => {
    const commits = project.pages[pageName] || [];
    console.log(commits)
    setSelectedCommits(commits.sort((a, b) => new Date(b.date) - new Date(a.date)));
    setShowCommitsDialog(pageName);
  };

  const handlePageAdded = (newPage) => {
    project.pages[newPage.name] = [newPage.value];
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar - Project Data */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto p-4">
        <div className="flex justify-between gap-5">
          <button
            onClick={goHome}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 rounded-lg mb-6 w-full hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105"
          >
            Go to Home
          </button>
          <button
            onClick={goBack}
            className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-6 py-3 rounded-lg mb-6 w-full hover:from-gray-700 hover:to-gray-900 transition-all duration-300 transform hover:scale-105"
          >
            Back to Projects
          </button>
        </div>

        {/* Project Name */}
        <h2 className="text-2xl font-extrabold text-gray-800 mb-6">{project.name}</h2>

        {/* Collaborators Section */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-gray-800">Collaborators:</h3>
          <div className="text-gray-700 max-h-32 overflow-y-auto">
            {Object.values(project.collaborators).join(", ")}
          </div>
        </div>

        {/* Pages Section */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow-md">
          <h3 className="font-semibold text-lg text-gray-800">Pages:</h3>
          <ul className="list-disc pl-5 space-y-2 max-h-32 overflow-y-auto">
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

        {/* Add Buttons */}
        <button onClick={() => deployProject(project.name)} className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-6 py-3 rounded-lg mt-6 w-full hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 transform hover:scale-105">Host My Website</button>

        <button
          onClick={() => setShowAddPageDialog(true)}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg mt-4 w-full hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
        >
          Add Page
        </button>
        <button
          onClick={() => setShowDialog(true)}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg mt-4 w-full hover:from-green-600 hover:to-green-800 transition-all duration-300 transform hover:scale-105"
        >
          Add Collaborator
        </button>
      </div>

      {/* Main Panel - Notice Board */}
      <div className="flex-1 p-6 bg-white flex flex-col">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Notice Board</h3>
        <div className="border border-gray-200 rounded-lg p-4 flex-1 text-gray-600">
          <p>No announcements yet.</p>
        </div>
      </div>

      {/* Dialogs */}
      {showDialog && (
        <AddCollaborator setShowDialog={setShowDialog} project={project} />
      )}
      {showCommitsDialog && (
        <PageCommitsDialog
          commits={selectedCommits}
          onClose={() => setShowCommitsDialog(false)}
          projectId={project._id}
          creatorId={project.creatorId}
          projectName={project.name}
          page={showCommitsDialog}
        />
      )}
      {showAddPageDialog && (
        <AddPageDialog
          setShowDialog={setShowAddPageDialog}
          projectId={project._id}
          onPageAdded={handlePageAdded}
          project={project}
        />
      )}
    </div>
  );
};



export default Project;


