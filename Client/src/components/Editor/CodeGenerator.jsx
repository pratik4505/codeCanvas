import React, { useState } from 'react';
import axios from 'axios';
import { useEditor } from '@craftjs/core';

const CodeGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const { actions } = useEditor();

  // Function to handle the prompt submission
  const handleGenerate = async () => {
    try {
      // Send the prompt to the backend API
      console.log("I come here",prompt);
      
      const response = await axios.post('http://localhost:4000/ai/generate', { prompt });
      
      // Assuming the backend returns the generated code as 'response.data.text'
      const generatedComponentCode = response.data.text;
      setGeneratedCode(generatedComponentCode);

      // Add the generated component to Craft.js canvas
      actions.addNode(generatedComponentCode);
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Generate a Component</h2>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt to generate a component"
        rows={4}
        cols={50}
        style={{ width: '100%', marginBottom: '10px' }}
      />
      <button onClick={handleGenerate} style={{ padding: '10px 15px', cursor: 'pointer' }}>
        Generate Component
      </button>
      <div>
        <h3>Generated Code:</h3>
        <pre style={{ backgroundColor: '#f4f4f4', padding: '10px' }}>{generatedCode}</pre>
      </div>
    </div>
  );
};

export default CodeGenerator;
