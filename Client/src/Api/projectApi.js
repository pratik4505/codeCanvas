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