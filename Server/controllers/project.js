const Commit = require("../models/Commit");
const Project = require("../models/Project");
const User = require("../models/User");
const axios = require("axios");
const Chat = require("../models/Chat");
const Save = require("../models/Save");
const defaultCommitContent = `{
  "ROOT": {
    "type": { "resolvedName": "Container" },
    "isCanvas": true,
    "props": { "id": "root" },
    "displayName": "Container",
    "custom": { "myFlag": "no" },
    "hidden": false,
    "nodes": [],
    "linkedNodes": {}
  }
}`;

const commit = async (req, res) => {
  const { page, commit, projectId, commitMessage, commitId } = req.body;

  try {
    console.log("the commit is ", commit);

    const parseCommit = JSON.parse(commit);

    Object.entries(parseCommit).forEach(([key, value]) => {
      parseCommit[key].custom = { myFlag: "no" };
    });

    const newCommit = new Commit({
      projectId,
      commit: JSON.stringify(parseCommit),
      page,
      parentId: commitId,
      message: commitMessage,
    });

    const savedCommit = await newCommit.save();

    await Project.findByIdAndUpdate(
      projectId,
      {
        $push: {
          [`pages.${page}`]: {
            commitId: savedCommit._id,
            commitMessage,
            date: new Date(),
            parentId: commitId,
          },
        },
      },
      { new: true, useFindAndModify: false }
    );

    res.status(200).json({
      message: "Commit saved and project updated successfully",
      commitId: savedCommit._id,
    });
  } catch (error) {
    console.error("Error in commit process:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const pushToGitHub = async (req, res) => {
  const { projectId, page, commitMessage, htmlContent } = req.body;
  console.log(req.body);
  try {
    const project = await Project.findById(projectId.toString());
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }
    console.log(project);

    const { creatorId, name } = project;

    const filePaths = {
      html: `${creatorId}/${name}/${page}.html`,
    };

    const githubConfig = {
      owner: process.env.REPO_OWNER,
      repo: process.env.CODE_BASE,
      branch: "main",
      token: process.env.GITHUB_TOKEN,
    };

    const updateFileOnGitHub = async (path, content, message) => {
      const url = `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repo}/contents/${path}`;
      const base64Content = Buffer.from(content).toString("base64");
      let payload = {
        message,
        content: base64Content,
        branch: githubConfig.branch,
      };

      try {
        const { data: existingFile } = await axios.get(url, {
          headers: { Authorization: `Bearer ${githubConfig.token}` },
        });

        payload.sha = existingFile.sha;
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(`File ${path} does not exist, creating new file.`);
        } else {
          throw new Error(
            `Error checking file existence for ${path}: ${error.message}`
          );
        }
      }

      await axios.put(url, payload, {
        headers: { Authorization: `Bearer ${githubConfig.token}` },
      });
    };

    await Promise.all([
      updateFileOnGitHub(
        filePaths.html,
        htmlContent,
        `${commitMessage} - HTML update`
      ),
    ]);
    console.log("I come hre");

    res.status(200).json({
      message: "Files pushed to GitHub successfully",
    });
  } catch (error) {
    console.error("Error in push process:", error);

    res.status(500).json({
      error: "Failed to push files to GitHub",
      details: error.message,
    });
  }
};

const findJson = async (req, res) => {
  try {
    const { commitId } = req.params;
    console.log("The commit id for the commit is", commitId);

    const commit = await Commit.findById(commitId);
    if (!commit) {
      return res.status(404).json({ message: "Commit not found" });
    }

    let commitData;
    if (typeof commit.commit === "string") {
      try {
        commitData = JSON.parse(commit.commit);
      } catch (error) {
        return res.status(400).json({ message: "Invalid JSON in commit data" });
      }
    } else {
      commitData = commit.commit;
    }

    const ncommit = { ...commit.toObject(), commit: commitData };

    ncommit._id = ncommit._id.toString();
    ncommit.projectId = ncommit.projectId.toString();

    console.log(ncommit);
    res.json({ commit: ncommit });
  } catch (error) {
    console.error("Error fetching commit data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getLiveUrl = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log(projectId);
    const project = await Project.findById(projectId);
    console.log(project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ liveUrl: project.liveUrl });
  } catch (error) {
    console.error("Error fetching live URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const userProjects = async (req, res) => {
  const { userId } = req;

  try {
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
    const user = await User.findOne({ name: userName });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const collaboratorId = user._id;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    if (project.collaborators.has(collaboratorId.toString())) {
      return res.status(200).json({ id: collaboratorId, name: userName });
    }

    project.collaborators.set(collaboratorId.toString(), userName);

    await project.save();

    let chat = await Chat.findOne({ id: projectId });

    chat.members.set(collaboratorId, userName);

    await chat.save();

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
    return res
      .status(400)
      .json({ message: "User ID and project name are required." });
  }

  try {
    const repoOwner = process.env.REPO_OWNER;
    const repoName = process.env.CODE_BASE;
    const projectFolderPath = `${userId}/${name}/index.html`;

    const response = await axios.put(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${projectFolderPath}`,
      {
        message: `Initialize project folder for ${name}`,
        content: Buffer.from(
          "This is the project folder initialization."
        ).toString("base64"),
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const newProject = new Project({
      name,
      collaborators: { [userId]: userName },
      pages: new Map(),
      creatorId: userId,
    });

    const initialCommit = new Commit({
      projectId: newProject._id,
      commit: defaultCommitContent,
      message: "Inital commit",
      parentId: newProject._id,
      page: "index",
    });

    await initialCommit.save();

    newProject.pages.set("index", [
      {
        commitId: initialCommit._id,
        commitMessage: "Initial commit",
        date: new Date(),
      },
    ]);

    await newProject.save();

    const chat = new Chat({
      id: newProject._id,
      members: { [userId]: userName },
      chatName: name,
    });
    await chat.save();

    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Failed to create project" });
  }
};

const fetchCommit = async (req, res) => {
  try {
    const { commitId } = req.params;

    let saveDoc = await Save.findOne({ commitId });

    if (saveDoc) {
      let updates = require("../socket").getUpdates();

      let thisCommit = {};

      if (updates[commitId]) {
        thisCommit = updates[commitId];
      }

      const fetchCommit = JSON.parse(saveDoc.commit);

      const finalCommit = { ...fetchCommit, ...thisCommit };
      console.log(finalCommit);

      return res.status(200).json({ commit: finalCommit });
    }

    const commit = await Commit.findById(commitId);

    if (!commit) {
      return res.status(404).json({ message: "Commit not found" });
    }

    saveDoc = new Save({
      commitId: commit._id,
      commit: commit.commit,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    await saveDoc.save();

    res.status(200).json({ commit: commit.commit });
  } catch (error) {
    console.error("Error fetching commit:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addPage = async (req, res) => {
  const { projectId, pageName } = req.body;
  const userId = req.userId;

  if (!projectId || !pageName) {
    return res
      .status(400)
      .json({ message: "Project ID and page name are required." });
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    const creatorId = project.creatorId;

    if (
      !project.collaborators.has(userId) &&
      project.creatorId.toString() !== userId
    ) {
      return res.status(403).json({
        message: "You do not have permission to add pages to this project.",
      });
    }

    if (project.pages.has(pageName)) {
      return res.status(400).json({ message: "Page name already exists." });
    }

    const repoOwner = process.env.REPO_OWNER;
    const repoName = process.env.CODE_BASE;
    const userFolderPath = `${creatorId}`;
    const projectFolderPath = `${userFolderPath}/${project.name}`;
    const htmlFilePath = `${projectFolderPath}/${pageName}.html`;
    const cssFilePath = `${projectFolderPath}/${pageName}.css`;

    const htmlContent = Buffer.from(
      `<!DOCTYPE html><html><head><title>${pageName}</title><link rel="stylesheet" href="${pageName}.css"></head><body><h1>${pageName}</h1></body></html>`
    ).toString("base64");
    const cssContent = Buffer.from(
      `body { font-family: Arial, sans-serif; }`
    ).toString("base64");

    const headers = {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    };

    const getFileSha = async (filePath) => {
      try {
        const response = await axios.get(
          `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
          { headers }
        );
        return response.data.sha;
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return null;
        } else {
          throw error;
        }
      }
    };

    const htmlFileSha = await getFileSha(htmlFilePath);
    const cssFileSha = await getFileSha(cssFilePath);
    console.log("icakdfa");

    await axios.put(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${htmlFilePath}`,
      {
        message: `Add ${pageName}.html for ${project.name}`,
        content: htmlContent,
        ...(htmlFileSha && { sha: htmlFileSha }),
      },
      { headers }
    );

    await axios.put(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${cssFilePath}`,
      {
        message: `Add ${pageName}.css for ${project.name}`,
        content: cssContent,
        ...(cssFileSha && { sha: cssFileSha }),
      },
      { headers }
    );

    const newCommit = new Commit({
      projectId: project._id,
      commit: defaultCommitContent,
      page: pageName,
      message: "Initial commit",
    });

    await newCommit.save();

    project.pages.set(pageName, [
      {
        commitId: newCommit._id,
        commitMessage: "initial commit",
        date: new Date(),
        parentId: newCommit._id,
      },
    ]);

    await project.save();

    res.status(201).json({
      name: pageName,
      commitId: newCommit._id,
      message: "Page created successfully with HTML and CSS files.",
    });
  } catch (error) {
    if (error.response) {
      console.error("GitHub API Error:", error.response.data.message);
    } else {
      console.error("Error adding page:", error.message);
    }
    res.status(500).json({ message: "Failed to add page." });
  }
};

const deployProjectToVercel = async (
  repoOwner,
  repoName,
  userFolderPath,
  projectFolderPath,
  projectName
) => {
  try {
    console.log(projectFolderPath);
    const deploymentConfig = {
      name: `${repoName}-${userFolderPath}-${projectName}`,
      target: "production",
      public: true,
      gitSource: {
        type: "github",
        repoId: process.env.REPO_ID,
        repoOwner,
        repoName,
        path: projectFolderPath,
        ref: "main",
      },
      projectSettings: {
        devCommand: null,
        installCommand: null,
        buildCommand: null,
        outputDirectory: null,
        rootDirectory: projectFolderPath,
        framework: null,
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
    return response.data;
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

  const repoOwner = process.env.REPO_OWNER;
  const repoName = process.env.CODE_BASE;
  const userFolderPath = `${userId}`;
  const projectFolderPath = `${userFolderPath}/${projectName}`;

  try {
    const { name } = await deployProjectToVercel(
      repoOwner,
      repoName,
      userFolderPath,
      projectFolderPath,
      projectName
    );
    const url = `${name}.vercel.app`;

    if (typeof url !== "string") {
      throw new Error("Deployment URL is not a valid string.");
    }

    const updatedProject = await Project.findOneAndUpdate(
      { name: projectName, creatorId: userId },
      { liveUrl: url },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project deployed successfully",
      url: updatedProject.liveUrl,
    });
  } catch (error) {
    console.error("Deployment error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ message: "Deployment failed", error: error.message });
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
  findJson,
};
