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

export const handleLivePreview = async (e,projectId) => {
  e.stopPropagation();
  console.log("Live Preview clicked");

  try {
    const response = await API.get(`/project/${projectId}/liveUrl`);
    console.log(response)
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
      projectName
    });

    // Check if the response has a URL in the expected structure
    if (response?.data?.url) {
      alert("Website Deployed Successfully")
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

const jsonToHtmlCss = (json) => {
  const parsedJson = JSON.parse(json);
  let html = "<!DOCTYPE html><html><head><link rel='stylesheet' href='styles.css'></head><body>";
  let css = "";

  const parseNode = (nodeId) => {
    const node = parsedJson[nodeId];
    if (!node) {
      console.warn(`Node with ID ${nodeId} not found.`);
      return { html: '', css: '' };
    }

    const { displayName, props = {}, nodes = [], linkedNodes = {} } = node;
    let nodeHtml = "";
    let nodeCss = "";

    switch (displayName) {
      case "div":
        nodeHtml += `<div id="${props.id || ''}" class="${props.className || ''}">`;
        break;
      case "Text":
        const fontSize = props.fontSize ? `font-size: ${props.fontSize}px;` : '';
        nodeHtml += `<p style="${fontSize}">${props.text || ''}</p>`;
        break;
      case "Button":
        nodeHtml += `<button class="${props.className || ''}" style="${props.style || ''}">${props.text || 'Button'}</button>`;
        break;
      case "Column":
        nodeHtml += `<div class="w-full ${props.className || ''}">`;
        break;
      case "Columns":
        nodeHtml += `<div class="flex flex-row ${props.className || ''}" style="gap: ${props.gap || 0}px;">`;
        break;
      case "Container":
        nodeHtml += `<div class="${props.className || ''}" id="${props.id || ''}">`;
        break;
      case "Row":
        nodeHtml += `<div class="flex flex-col ${props.className || ''}">`;
        break;
      case "Rows":
        nodeHtml += `<div class="flex flex-col ${props.className || ''}" style="gap: ${props.gap || 0}px;">`;
        break;
      default:
        console.warn(`Unhandled display name: ${displayName}`);
    }

    nodes.forEach((childId) => {
      const { html: childHtml, css: childCss } = parseNode(childId);
      nodeHtml += childHtml;
      nodeCss += childCss;
    });

    Object.values(linkedNodes).forEach((linkedNodeId) => {
      const { html: linkedHtml, css: linkedCss } = parseNode(linkedNodeId);
      nodeHtml += linkedHtml;
      nodeCss += linkedCss;
    });

    switch (displayName) {
      case "div":
      case "Column":
      case "Columns":
      case "Container":
      case "Row":
      case "Rows":
        nodeHtml += `</div>`;
        break;
      case "Button":
        nodeHtml += `</button>`;
        break;
    }

    return { html: nodeHtml, css: nodeCss };
  };

  const rootNodeId = "ROOT";
  const { html: rootHtml, css: rootCss } = parseNode(rootNodeId);

  html += rootHtml;
  css += rootCss;
  html += "</body></html>";

  return { html };
}



// Function to handle push logic for each commit
export const handlePushClick = async (commitId) => {
  try {
    // Fetch the commit data using axios (replaces fetch)
    const response = await API.get(`/project/commit/${commitId}`);
    const commitData = response.data; // Get the commit data from the response
    console.log(commitData)
    const {projectId,page} = commitData;
    // Convert the JSON to HTML and CSS
    console.log(commitId)
    console.log(commitData.commit)
    const { html } = jsonToHtmlCss(commitData.commit);
    console.log(html)
    // Send the HTML and CSS to GitHub using axios (replaces fetch)
    const pushResponse = await API.post('/project/push', {
      projectId,
      page,
      commitMessage: commitData.message,
      htmlContent: html,
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
    console.log(data)
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
