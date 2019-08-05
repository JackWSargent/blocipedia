const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.get("/wikis/:wikiId/collaborators", collaboratorController.edit);
router.post("/wikis/:wikiId/collaborators/delete", collaboratorController.delete);
router.post("/wikis/:wikiId/collaborators/new", collaboratorController.new);

module.exports = router;