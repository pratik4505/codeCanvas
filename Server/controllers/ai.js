const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize GoogleGenerativeAI with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the function to handle prompt generation
const generateContent = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Specify the Gemini model
    const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    // Generate content based on the prompt
    const result = await model.generateContent(prompt);
    const response  = result.response.text();
    // Send the generated content back as a response
    res.json({ text: response });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};

module.exports = { generateContent };

