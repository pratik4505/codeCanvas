const Commit = require("../models/Commit");
const Project = require("../models/Project");
const User = require("../models/User");
const axios = require("axios");

const defaultCommitContent = `{"ROOT":{"type":"div","isCanvas":true,"props":{"id":"root","className":"w-full h-full"},"displayName":"div","custom":{},"hidden":false,"nodes":[],"linkedNodes":{}}}`;

const commit = async (req, res) => {
  const { page, commit, projectId, commitMessage, commitId } = req.body;

  try {
    // Step 1: Create and save the new commit in your database
    const newCommit = new Commit({
      projectId,
      commit,
      page,
      parentId:commitId,
      message:commitMessage
    });
    const savedCommit = await newCommit.save();
    console.log("New commit saved");

    // Step 2: Find the project and update the specific page with the new commit details
    await Project.findByIdAndUpdate(projectId, {
      $push: {
        [`pages.${page}`]: {
          commitId: savedCommit._id,
          commit: commitMessage,
          date: new Date(),
        },
      },
    });

    // Respond with success
    res.status(200).json({
      message: "Commit saved and project updated successfully",
      commitId: savedCommit._id, // Optionally return commit ID if needed
    });
  } catch (error) {
    console.error("Error in commit process:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const pushToGitHub = async (req, res) => {
  console.log("I come here");

  // Destructure incoming request body
  const { projectId, page, commitMessage, htmlContent} = req.body;
  console.log(projectId);

  try {
    // Fetch project details from the database
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const { creatorId, name } = project;

    // GitHub File paths for HTML and CSS
    const filePaths = {
      html: `${creatorId}/${name}/${page}.html`,
    };

    console.log("Pushing updates to GitHub...");

    // GitHub API configuration
    const githubConfig = {
      owner: 'vaibhavMNNIT', // Replace with your GitHub username
      repo: 'codecanvas', // Replace with your GitHub repository name
      branch: 'main', // Target branch for the commit
      token: process.env.GITHUB_TOKEN, // GitHub personal access token
    };

    // Helper function to update files on GitHub
    const updateFileOnGitHub = async (path, content, message) => {
      const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`;
      const base64Content = Buffer.from(content).toString('base64');
      const payload = {
        message,
        content: base64Content,
        branch: githubConfig.branch,
      };

      try {
        // Check if the file already exists on GitHub
        const { data: existingFile } = await axios.get(url, {
          headers: { Authorization: `Bearer ${githubConfig.token}` },
        });
        // If file exists, include its SHA in the payload for updating
        payload.sha = existingFile.sha;
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`File ${path} does not exist, creating new file.`);
        } else {
          throw new Error(`Error checking file existence for ${path}: ${error.message}`);
        }
      }

      // Commit the file to GitHub (either create or update)
      await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${githubConfig.token}` },
      });
    };

    // Update both HTML and CSS files on GitHub
    await Promise.all([
      updateFileOnGitHub(filePaths.html, htmlContent, `${commitMessage} - HTML update`),
    ]);

    // Send success response
    res.status(200).json({
      message: "Files pushed to GitHub successfully",
    });
  } catch (error) {
    console.error("Error in push process:", error);
    // Send failure response with the error message
    res.status(500).json({ error: "Failed to push files to GitHub", details: error.message });
  }
};



const findJson = async(req,res)=>{
  try {
    const { commitId } = req.params;
    console.log(commitId);
    const commit = await Commit.findById(commitId);
    if (!commit) {
      return res.status(404).json({ message: 'Commit not found' });
    }
    console.log(commit)
    res.json(commit);
  } catch (error) {
    console.error("Error fetching commit data:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const getLiveUrl = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    const project = await Project.findById(projectId);
    console.log(project)
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Return the live URL
    res.status(200).json({ liveUrl: project.liveUrl });
  } catch (error) {
    console.error("Error fetching live URL:", error);
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
      message:"Inital commit",
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
  const userId = req.userId;

  if (!projectId || !pageName) {
    return res.status(400).json({ message: "Project ID and page name are required." });
  }

  try {
    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const creatorId = project.creatorId;

    // Ensure that the user is a collaborator or the owner
    if (!project.collaborators.has(userId) && project.creatorId.toString() !== userId) {
      return res.status(403).json({ message: "You do not have permission to add pages to this project." });
    }

    // Check if the page name already exists
    if (project.pages.has(pageName)) {
      return res.status(400).json({ message: "Page name already exists." });
    }

    // Define file paths for HTML and CSS based on user and project folders
    const repoOwner = "vaibhavMNNIT";
    const repoName = "codecanvas";
    const userFolderPath = `${creatorId}`;
    const projectFolderPath = `${userFolderPath}/${project.name}`;
    const htmlFilePath = `${projectFolderPath}/${pageName}.html`;
    const cssFilePath = `${projectFolderPath}/${pageName}.css`;

    // Basic content for HTML and CSS files
    const htmlContent = Buffer.from(
      `<!DOCTYPE html><html><head><title>${pageName}</title><link rel="stylesheet" href="${pageName}.css"></head><body><h1>${pageName}</h1></body></html>`
    ).toString("base64");
    const cssContent = Buffer.from(`body { font-family: Arial, sans-serif; }`).toString("base64");

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    };

    // Helper function to check if a file already exists and retrieve its SHA if it does
    const getFileSha = async (filePath) => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
          { headers }
        );
        return response.data.sha; // If file exists, return its SHA
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return null; // File does not exist
        } else {
          throw error;
        }
      }
    };

    // Check if the files exist and retrieve their SHAs if they do
    const htmlFileSha = await getFileSha(htmlFilePath);
    const cssFileSha = await getFileSha(cssFilePath);

    // Create or update HTML file in GitHub
    await axios.put(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${htmlFilePath}`,
      {
        message: `Add ${pageName}.html for ${project.name}`,
        content: htmlContent,
        ...(htmlFileSha && { sha: htmlFileSha }), // Include SHA if updating
      },
      { headers }
    );

    // Create or update CSS file in GitHub
    await axios.put(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${cssFilePath}`,
      {
        message: `Add ${pageName}.css for ${project.name}`,
        content: cssContent,
        ...(cssFileSha && { sha: cssFileSha }), // Include SHA if updating
      },
      { headers }
    );

    // Create a new commit for the added page
    const newCommit = new Commit({
      projectId: project._id,
      commit: `Added ${pageName}.html and ${pageName}.css`,
      page: pageName,
    });

    await newCommit.save();

    // Add the page to the project's pages map
    project.pages.set(pageName, [
      {
        commitId: newCommit._id,
        commitMessage: "initial commit",
        date: new Date(),
      },
    ]);

    // Save the updated project
    await project.save();

    res.status(201).json({ name: pageName, message: "Page created successfully with HTML and CSS files." });
  } catch (error) {
    if (error.response) {
      console.error("GitHub API Error:", error.response.data.message);
    } else {
      console.error("Error adding page:", error.message);
    }
    res.status(500).json({ message: "Failed to add page." });
  }
};

const deployProjectToVercel = async (repoOwner, repoName, userFolderPath, projectFolderPath, projectName) => {
  try {
    console.log(projectFolderPath);
    const deploymentConfig = {
      name: `${repoName}-${userFolderPath}-${projectName}`, // Unique name for the deployment
      target: "production",
      public: true,
      gitSource: {
        type: "github",
        repoId: "884459368", // Make sure to replace with the actual repo ID
        repoOwner,
        repoName,
        path: projectFolderPath, // Use only projectFolderPath if it's structured correctly
        ref: "main", // Ensure branch is correct
      },
      projectSettings: {
        devCommand: null,           // No dev command if not needed
        installCommand: null,       // No install command for static projects
        buildCommand: null,         // No build command for static projects
        outputDirectory: null,      // Static projects often don't need this
        rootDirectory: projectFolderPath,        // Path to the root directory if needed (e.g. `/src`)
        framework: null,            // No specific framework if it's plain HTML/CSS/JS
      },
    };
    const response = await axios.post(
      "https://api.vercel.com/v13/deployments",
      deploymentConfig,
      {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_API_TOKEN}`,
        },
      }
    );
    return response.data; // Returns the deployed project's URL
  } catch (error) {
    console.error("Deployment error:", error.response?.data || error.message);
    if (error.response?.data?.errors) {
      console.error("Detailed errors:", error.response.data.errors);
    }
    throw new Error("Deployment failed");
  }
};

const deployProject = async (req, res) => {
  const { userId, projectName } = req.body;

  const repoOwner = "vaibhavMNNIT"; // Your GitHub username
  const repoName = "codecanvas"; // GitHub repository name
  const userFolderPath = `${userId}`; // Folder path for the user's ID
  const projectFolderPath = `${userFolderPath}/${projectName}`; // Path for the project folder

  try {
    // Step 1: Deploy the project and get the live URL
    const { url } = await deployProjectToVercel(repoOwner, repoName, userFolderPath, projectFolderPath, projectName);
    console.log("Deployment URL:", url);

    // Ensure URL is a string
    if (typeof url !== 'string') {
      throw new Error("Deployment URL is not a valid string.");
    }

    // Step 2: Find the project in the database and update it with the live URL
    const updatedProject = await Project.findOneAndUpdate(
      { name: projectName, creatorId: userId }, // Find project by name and creator ID
      { liveUrl: url }, // Update the project with the live URL
      { new: true } // Return the updated project document
    );

    // Step 3: Respond with the success message and the live URL
    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    console.log("Updated Project:", updatedProject);

    res.status(200).json({
      message: "Project deployed successfully",
      url: updatedProject.liveUrl, // Send back the updated URL
    });
  } catch (error) {
    console.error("Deployment error:", error.response?.data || error.message);
    res.status(500).json({ message: "Deployment failed", error: error.message });
  }
};



module.exports = {
  commit,
  userProjects,
  addCollaborator,
  createProject,
  fetchCommit,
  addPage,
  deployProject,
  getLiveUrl,
  pushToGitHub,
  findJson
};
