import React, { useEffect, useState } from "react";
import { userProjects } from "../Api/projectApi";
import Project from "./Project";
import CreateProject from "../components/Project/CreateProject";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showDialog, setShowDialog] = useState(false);

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await userProjects();
        setProjects(response.data);
      } catch (err) {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Loading or error state
  if (loading)
    return <div className="text-center p-4">Loading projects...</div>;
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>;

  // Render Project component if a project is selected
  if (selectedProject) {
    return (
      <Project
        project={selectedProject}
        goBack={() => setSelectedProject(null)}
      />
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Projects</h2>
      <button
        onClick={() => setShowDialog(true)}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
      >
        Create Project
      </button>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects &&
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {project.name}
              </h3>

              <div className="text-gray-500 text-sm mb-4">
                Pages: {Object.keys(project.pages).length}
              </div>
              <button
                onClick={() => setSelectedProject(project)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Open Project
              </button>
            </div>
          ))}
      </div>
      {showDialog && (
        <CreateProject
          setShowDialog={setShowDialog}
          setProjects={setProjects}
        />
      )}
    </div>
  );
};

export default Projects;
