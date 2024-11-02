const {
  commit,
  userProjects,
  addCollaborator,
  createProject,
} = require("../controllers/project");
const verifyJWT = require("../middleware/verifyJWT");

const router = require("express").Router();

router.post("/commit", verifyJWT, commit);
router.get("/userProjects", verifyJWT, userProjects);
router.post("/addCollaborator", verifyJWT, addCollaborator);
router.post("/createProject", verifyJWT, createProject);

module.exports = router;
