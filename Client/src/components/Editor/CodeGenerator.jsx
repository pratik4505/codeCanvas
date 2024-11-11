import React, { useState } from "react";
import { useEditor } from "@craftjs/core";
import { handleAiGenerate } from "../../Api/aiApi";
import { toast } from "react-toastify";
const CodeGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const { actions } = useEditor();

  const handleGenerate = async () => {
    try {
      const response = await handleAiGenerate({ prompt });

      const generatedComponentCode = response.data.text;
      setGeneratedCode(generatedComponentCode);

      actions.addNode(generatedComponentCode);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard
        .writeText(generatedCode)
        .then(() => toast.success("Code copied to clipboard!"))
        .catch((err) => console.error("Failed to copy code: ", err));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ color: "#333", fontWeight: "600" }}>Generate a Component</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt to generate a component"
        rows={4}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "16px",
          borderRadius: "6px",
          border: "1px solid #ddd",
          resize: "vertical",
        }}
      />
      <button
        onClick={handleGenerate}
        style={{
          padding: "12px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
      >
        Generate Component
      </button>

      {generatedCode && (
        <div>
          <h3
            style={{
              fontSize: "18px",
              color: "#333",
              fontWeight: "500",
              marginBottom: "10px",
            }}
          >
            Generated Code:
          </h3>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <pre
              style={{
                backgroundColor: "#f4f4f4",
                padding: "15px",
                borderRadius: "6px",
                overflowX: "auto",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                fontSize: "14px",
                color: "#333",
                border: "1px solid #ddd",
                width: "80%",
              }}
            >
              {generatedCode}
            </pre>
            <button
              onClick={handleCopy}
              style={{
                padding: "10px 15px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px",
                marginLeft: "10px",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#218838")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#28a745")}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeGenerator;
