const Commit = require("../models/Commit");
const Project = require("../models/Project");
const User = require("../models/User");
const axios = require("axios");

const defaultCommitContent = `{"ROOT":{"type":"div","isCanvas":true,"props":{"id":"root","className":"w-full h-full"},"displayName":"div","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}}}`;

const commit = async (req, res) => {
  const { page, projectId, commit, message } = req.body;
  console.log(req.body);
  try {
    // Create and save the new commit
    const newCommit = new Commit({
      projectId,
      commit,
      page,
    });
    const savedCommit = await newCommit.save();

    // Find the project and update the specific page with the new commit details
    await Project.findByIdAndUpdate(projectId, {
      $push: {
        [`pages.${page}`]: {
          commitId: savedCommit._id,
          commitMessage: message,
          date: new Date(), // Add the current date here
        },
      },
    });

    res
      .status(200)
      .json({ message: "Commit saved and project updated successfully" });
  } catch (error) {
    console.error("Error saving commit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const userProjects = async (req, res) => {
  const { userId } = req;

  try {
    // Find projects where the userId is a key in the collaborators map
    const projects = await Project.find({
      [`collaborators.${userId}`]: { $exists: true },
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addCollaborator = async (req, res) => {
  const { projectId, userName } = req.body;

  if (!projectId || !userName) {
    return res
      .status(400)
      .json({ message: "Project ID and username are required." });
  }

  try {
    // Find the user by username
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const collaboratorId = user._id; // Get the ID from the user document

    // Find the project by ID
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Check if the collaborator already exists
    if (project.collaborators.has(collaboratorId.toString())) {
      return res.status(200).json({ id: collaboratorId, name: userName });
    }

    // Add the new collaborator to the project using Map.set()
    project.collaborators.set(collaboratorId.toString(), userName);

    // Save the updated project
    await project.save();

    // Return the collaborator's ID and name
    res.status(200).json({ id: collaboratorId, name: userName });
  } catch (error) {
    console.error("Error adding collaborator:", error);
    res.status(500).json({ message: "Failed to add collaborator" });
  }
};

const createProject = async (req, res) => {
  const userId = req.userId;
  const userName = req.name;
  const { name } = req.body;

  if (!userId || !name) {
    return res.status(400).json({ message: "User ID and project name are required." });
  }

  try {
    // Step 1: Define the folder path for the user's project
    const repoOwner = "vaibhavMNNIT";
    const repoName = "codecanvas";
    const projectFolderPath = `${userId}/${name}/index.html`; // Creates a user and project folder with a placeholder file

    // Step 2: Initialize the project folder by creating a placeholder file in GitHub
    const response = await axios.put(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${projectFolderPath}`,
      {
        message: `Initialize project folder for ${name}`,
        content: Buffer.from("This is the project folder initialization.").toString("base64"), // Base64 encoded content
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    // Step 3: Create the project in the database with the GitHub folder URL
    const newProject = new Project({
      name,
      collaborators: { [userId]: userName },
      pages: new Map(),
      creatorId: userId,
    });

    // Step 4: Create the initial commit entry
    const initialCommit = new Commit({
      projectId: newProject._id,
      commit: defaultCommitContent,
      page: "index",
    });

    await initialCommit.save();

    // Step 5: Link the commit to the project pages
    newProject.pages.set("index", [
      {
        commitId: initialCommit._id,
        commitMessage: "Initial commit",
        date: new Date(),
      },
    ]);

    // Save the new project in the database
    await newProject.save();

    // Step 6: Send back the created project with GitHub folder URL
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

const fetchCommit = async (req, res) => {
  try {
    const commit = await Commit.findById(req.params.commitId);
    if (!commit) {
      return res.status(404).json({ message: "Commit not found" });
    }
    res.status(200).json(commit);
  } catch (error) {
    console.error("Error fetching commit:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addPage = async (req, res) => {
  const { projectId, pageName } = req.body;
  console.log(projectId)

  if (!projectId || !pageName) {
    return res
      .status(400)
      .json({ message: "Project ID and page name are required." });
  }

  try {
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Check if the page name already exists
    if (project.pages[pageName]) {
      return res.status(400).json({ message: "Page name already exists." });
    }

    // Create a new commit
    const newCommit = new Commit({
      projectId: project._id,
      commit: defaultCommitContent, // Store the commit message
      page: pageName,
    });

    await newCommit.save();

    const value = {
      commitId: newCommit._id,
      commitMessage: "initial commit",
      date: new Date(),
    };

    project.pages.set(pageName, [value]);

    await project.save();

    res.status(201).json({ name: pageName, value: value }); // Return the new page and commit
  } catch (error) {
    console.error("Error adding page:", error);
    res.status(500).json({ message: "Failed to add page." });
  }
};

module.exports = {
  commit,
  userProjects,
  addCollaborator,
  createProject,
  fetchCommit,
  addPage,
};
