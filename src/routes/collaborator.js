const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.post("/wikis/:wikiId/collaborators/add", collaboratorController.new);
router.get("/wikis/:wikiId/collaborators", collaboratorController.edit);
router.post("/wikis/:wikiId/collaborators/delete", collaboratorController.delete);

module.exports = router;