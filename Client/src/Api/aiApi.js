import { API, handleApiError } from "./utils";

export const handleAiGenerate = async (data) => {
  try {
    const res = await API.post("/ai/generate", data);
    if (res.status === 200) return { error: null, data: res.data };
    else return { error: res.data.error, data: null };
  } catch (error) {
    return handleApiError(error);
  }
};
