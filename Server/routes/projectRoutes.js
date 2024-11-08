const {
  commit,
  userProjects,
  addCollaborator,
  createProject,
  fetchCommit,
  addPage,
  deployProject,
} = require("../controllers/project");
const verifyJWT = require("../middleware/verifyJWT");

const router = require("express").Router();

router.post("/commit", verifyJWT, commit);
router.get("/userProjects", verifyJWT, userProjects);
router.post("/addCollaborator", verifyJWT, addCollaborator);
router.post("/createProject", verifyJWT, createProject);
router.get("/fetchCommit/:commitId", verifyJWT, fetchCommit);
router.post("/addPage", verifyJWT, addPage);
router.post("/deploy", verifyJWT, deployProject);

module.exports = router;
