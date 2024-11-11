import { ConvertToHtml } from "../components/Editor/TopPanel";
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

export const handleLivePreview = async (e, projectId) => {
  e.stopPropagation();
  console.log("Live Preview clicked");

  try {
    const response = await API.get(`/project/${projectId}/liveUrl`);
    console.log(response);
    if (response.data && response.data.liveUrl) {
      // Open the live URL in a new tab
      window.open(`https://${response.data.liveUrl}`, "_blank");
    } else {
      alert("Live URL not found for this project.");
    }
  } catch (error) {
    console.error("Error fetching live URL:", error);
    alert("Failed to fetch live URL.");
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
      projectName,
    });

    // Check if the response has a URL in the expected structure
    if (response?.data?.url) {
      alert("Website Deployed Successfully");
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

// Function to handle push logic for each commit
export const handlePushClick = async (commitId) => {
  try {
    console.log(commitId);
    // Fetch the commit data using axios (replaces fetch)
    const response = await API.get(`/project/commit/${commitId}`);
    const commitData = response.data.commit; // Get the commit data from the response
    const { projectId, page } = commitData;
    console.log("commit data", commitData);

    // Convert the JSON to a complete HTML document
    const htmlContent = ConvertToHtml(commitData.commit);
    //console.log(htmlContent); // Convert JSON to HTML

    // Send the HTML content to GitHub using axios (replaces fetch)
    const pushResponse = await API.post("/project/push", {
      projectId,
      page,
      commitMessage: commitData.message,
      htmlContent, // Pass the full HTML content here
    });

    const pushResult = pushResponse.data; // Get the response data from the push request

    if (pushResult.message === "Files pushed to GitHub successfully") {
      alert("Push to GitHub was successful!");
    } else {
      alert("Failed to push to GitHub.");
    }
  } catch (error) {
    console.error("Error during push:", error);
    alert("There was an error pushing the files to GitHub.");
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
    console.log(data.commit);
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
