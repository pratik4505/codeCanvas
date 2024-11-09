const {
  commit,
  userProjects,
  addCollaborator,
  createProject,
  fetchCommit,
  addPage,
  deployProject,
  getLiveUrl,
  pushToGitHub,
  findJson,
} = require("../controllers/project");
const verifyJWT = require("../middleware/verifyJWT");

const router = require("express").Router();

router.post("/commit", verifyJWT, commit);
router.get("/commit/:commitId",verifyJWT,findJson);
router.post("/push", verifyJWT,pushToGitHub)
router.get("/userProjects", verifyJWT, userProjects);
router.post("/addCollaborator", verifyJWT, addCollaborator);
router.post("/createProject", verifyJWT, createProject);
router.get("/fetchCommit/:commitId", verifyJWT, fetchCommit);
router.post("/addPage", verifyJWT, addPage);
router.post("/deploy", verifyJWT, deployProject);
router.get('/:projectId/liveUrl', getLiveUrl);



module.exports = router;
