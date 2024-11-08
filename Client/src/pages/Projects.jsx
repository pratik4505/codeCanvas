import React, { useEffect, useState } from "react";
import { userProjects,deployProject } from "../Api/projectApi";
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
  if (error) return <div className="text-center text-red-400 p-4">{error}</div>;

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

    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 flex items-center justify-center">
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-4xl">
      <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
        Projects
      </h2>
  
      <button
        onClick={() => setShowDialog(true)}
        className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-green-500 hover:to-green-700 transition-colors ease-in-out duration-300"
      >
        Create Project
      </button>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
        {projects &&
          projects.map((project) => (
            <div
              key={project._id}
              className="bg-white shadow-lg rounded-lg p-6 transform transition-all hover:scale-105 hover:shadow-2xl duration-300"
            >
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                {project.name}
              </h3>
  
              <div className="text-sm text-gray-600 mb-4">
                Pages: {Object.keys(project.pages).length}
              </div>
  
              <button
                onClick={() => setSelectedProject(project)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-colors ease-in-out duration-300"
              >
                Open Project
              </button>
              <button onClick={() => deployProject(project.name)}>Host My Website</button>

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
  </div>
  
  
  );
};

export default Projects;
