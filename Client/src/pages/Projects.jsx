import React, { useEffect, useState } from "react";
import { userProjects } from "../Api/projectApi";
import Project from "./Project";
import CreateProject from "../components/Project/CreateProject";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSelectedProject, setShowSelectedProject] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await userProjects();
        setProjects(response.data);
        setFilteredProjects(response.data);
      } catch (err) {
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on search query
  useEffect(() => {
    setFilteredProjects(
      projects.filter((project) =>
        project.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, projects]);

  // Loading or error state
  if (loading) return <div className="text-center p-4">Loading projects...</div>;
  if (error) return <div className="text-center text-red-400 p-4">{error}</div>;
  if (showSelectedProject) {
    return (
      <Project
        project={showSelectedProject}
        goBack={() => setShowSelectedProject(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute top-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 z-10"
      >
        {sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
      </button>

      {/* Sidebar for Project List */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transform transition-transform duration-300 ease-in-out w-1/3 bg-white border-r border-gray-200 overflow-y-auto fixed lg:relative lg:translate-x-0 z-10`}
      >
        <div className="p-2 border-b border-gray-200 flex justify-between items-center bg-indigo-50">
          <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
          <div className="flex gap-2">
            <button
            onClick={() => handleClick()}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:from-green-500 hover:to-green-700 transition duration-300"
          >
            Go To Home
          </button>
          <button
            onClick={() => setShowDialog(true)}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:from-green-500 hover:to-green-700 transition duration-300"
          >
            Create Project
          </button>
          </div>
          
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-white sticky top-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 transition duration-200"
          />
        </div>

        {/* Project List with Scrollable Content */}
        <div className="h-[calc(100vh-160px)] overflow-y-scroll">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              onClick={() => setSelectedProject(project)}
              className={`p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition duration-200 ${
                selectedProject?._id === project._id ? "bg-gray-100" : ""
              }`}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                <div className="text-sm text-gray-600">Pages: {Object.keys(project.pages).length}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Live Preview clicked");
                  }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-lg shadow hover:from-blue-600 hover:to-blue-700 transition duration-300"
                >
                  Live Preview
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSelectedProject(project);
                  }}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white px-3 py-1 rounded-lg shadow hover:from-indigo-600 hover:to-indigo-700 transition duration-300"
                >
                  Open Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Panel for Project Details or Chat */}
      <div className="w-full lg:w-2/3 flex flex-col ml-auto p-6">
        {selectedProject ? (
          <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedProject.name} - Live Chat
            </h3>
            <div className="border border-gray-200 rounded-lg p-4 h-[80%] flex flex-col">
              <div className="flex-1 text-gray-600 mb-4">
                Chat messages for {selectedProject.name} would appear here.
              </div>
              {/* Action buttons (if needed) */}
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-white shadow-lg rounded-lg p-6 flex items-center justify-center text-gray-600">
            <p>Select a project to view its chat</p>
          </div>
        )}
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
