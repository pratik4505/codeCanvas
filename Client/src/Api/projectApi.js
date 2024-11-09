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
    return null; // Return null if there's no user ID
  }

  const userId = profile.userId;

  try {
    const response = await API.post("/project/deploy", {
      userId,
      projectName
    });

    // Check if the response has a URL in the expected structure
    if (response?.data?.url) {
      return response.data.url; // Return the live URL if it exists
    } else {
      alert("Deployment failed: No URL returned.");
      return null;
    }
  } catch (error) {
    console.error("Deployment error:", error);
    alert("Failed to deploy project.");
    return null;
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
