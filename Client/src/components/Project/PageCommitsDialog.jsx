import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import { handlePushClick } from "../../Api/projectApi";

const PageCommitsDialog = ({
  commits,
  creatorId,
  onClose,
  page,
  projectId,
  projectName,
}) => {
  const navigate = useNavigate();
  console.log(commits);

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

                <button
                  onClick={() => handleCommitClick(commit.commitId)}
                  className="text-blue-600 hover:underline mt-2"
                >
                  View in Builder
                </button>

                <button
                  onClick={() => handlePushClick(commit.commitId)}
                  className="text-green-600 hover:underline mt-2 ml-2"
                >
                  Push to GitHub
                </button>
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
