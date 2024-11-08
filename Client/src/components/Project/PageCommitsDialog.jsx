import React from "react";
import { useNavigate } from "react-router-dom";

const PageCommitsDialog = ({ commits,creatorId, onClose, page, projectId, projectName }) => {
  const navigate = useNavigate();

  // Function to handle commit click and navigate to Builder component
  const handleCommitClick = (commitId) => {
    navigate(
      `/builder?projectId=${projectId}&commitId=${commitId}&creatorId=${creatorId}&projectName=${projectName}&page=${page}`
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-h-full overflow-y-auto relative">
        <h2 className="text-lg font-bold mb-4">Page Commits</h2>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
        <ul>
          {commits.length ? (
            commits.map((commit) => (
              <li
                key={commit.commitId}
                className="mb-3 cursor-pointer p-2 rounded hover:bg-gray-100"
                onClick={() => handleCommitClick(commit.commitId)}
              >
                <p>
                  <strong>Commit ID:</strong> {commit.commitId}
                </p>
                <p>
                  <strong>Message:</strong> {commit.commitMessage}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(commit.date).toLocaleString()}
                </p>
              </li>
            ))
          ) : (
            <p>No commits found for this page.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PageCommitsDialog;
