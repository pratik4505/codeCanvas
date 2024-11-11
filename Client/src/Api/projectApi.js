import { ConvertToHtml } from "../components/Editor/TopPanel";
import { API, handleApiError } from "./utils";
import { toast } from "react-toastify";

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
      window.open(`https://${response.data.liveUrl}`, "_blank");
    } else {
      toast.success("Live URL not found for this project.");
    }
  } catch (error) {
    console.error("Error fetching live URL:", error);
    toast.error("Failed to fetch live URL.");
  }
};

export const deployProject = async (projectName) => {
  const profile = JSON.parse(localStorage.getItem("profile"));

  if (!profile || !profile.userId) {
    console.error("User ID not found in localStorage");
    toast.error("User is not logged in.");
    return null;
  }

  const userId = profile.userId;

  try {
    const response = await API.post("/project/deploy", {
      userId,
      projectName,
    });

    if (response?.data?.url) {
      toast.success("Website Deployed Successfully");
      return response.data.url;
    } else {
      toast.error("Deployment failed: No URL returned.");
      return null;
    }
  } catch (error) {
    console.error("Deployment error:", error);
    toast.error("Failed to deploy project.");
    return null;
  }
};

export const handlePushClick = async (commitId) => {
  try {
    console.log(commitId);
    const response = await API.get(`/project/commit/${commitId}`);
    const commitData = response.data.commit;
    const { projectId, page } = commitData;
    console.log("commit data", commitData);

    const htmlContent = ConvertToHtml(commitData.commit);

    console.log(htmlContent);

    const pushResponse = await API.post("/project/push", {
      projectId,
      page,
      commitMessage: commitData.message,
      htmlContent,
    });

    const pushResult = pushResponse.data;

    if (pushResult.message === "Files pushed to GitHub successfully") {
      toast.success("Push to GitHub was successful!");
    } else {
      toast.error("Failed to push to GitHub.");
    }
  } catch (error) {
    console.error("Error during push:", error);
    toast.error("There was an error pushing the files to GitHub.");
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
