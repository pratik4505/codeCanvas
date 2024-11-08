import { API, handleApiError } from "./utils";

export const userProjects = async () => {
  try {
    const res = await API.get("/project/userProjects");
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const deployProject = async (projectName) => {
  // Retrieve userId from localStorage
  const profile = JSON.parse(localStorage.getItem("profile"));

  // Check if profile and userId exist
  if (!profile || !profile.userId) {
    console.error("User ID not found in localStorage");
    alert("User is not logged in.");
    return;
  }

  const userId = profile.userId;

  try {
    const response = await API.post("/project/deploy", {
      userId,
      projectName
    });

    // Check the structure of the response to properly log the URL

    if (response.data && response.data.url) {
      const liveUrl = response.data.url.url;  // Extract the URL
      
      console.log("Project deployed at:", liveUrl);
      alert(`Project is live at: ${liveUrl}`);
    
      // Copy the URL to the clipboard
      navigator.clipboard.writeText(liveUrl)
        .then(() => {
          console.log("URL copied to clipboard!");
        })
        .catch((error) => {
          console.error("Failed to copy URL to clipboard:", error);
        });
    }
     else {
      alert("Deployment failed: No URL returned.");
    }
} catch (error) {
    console.error("Deployment error:", error);
    alert("Failed to deploy project.");
  }
};

export const addCollaborator = async (data) => {
  try {
    const res = await API.post("/project/addCollaborator", data);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const createProject = async (data) => {
  try {
    const res = await API.post("/project/createProject", data);
    if (res.status === 201) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const commit = async (data) => {
  try {
    const res = await API.post("/project/commit", data);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const fetchCommit = async (commitId) => {
  try {
    const res = await API.get(`/project/fetchCommit/${commitId}`);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};

export const addPage = async (data) => {
  try {
    const res = await API.post("/project/addPage", data);
    if (res.status === 201) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};
