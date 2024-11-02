const router = require("express").Router();
const { generateContent } = require("../controllers/ai"); // import the generateContent function

// Route to handle AI-generated content based on the prompt
router.post("/generate", generateContent);

module.exports = router;
