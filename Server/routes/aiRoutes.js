const router = require("express").Router();
const { generateContent } = require("../controllers/ai");

router.post("/generate", generateContent);

module.exports = router;
