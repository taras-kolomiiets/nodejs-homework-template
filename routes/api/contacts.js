const express = require("express");
const router = express.Router();

const { authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/contacts");

router.get("/", authenticate, ctrl.getAll);

router.get("/:contactId", authenticate, ctrl.getById);

router.post("/", authenticate, ctrl.add);

router.delete("/:contactId", authenticate, ctrl.deleteContact);

router.put("/:contactId", authenticate, ctrl.update);

router.patch("/:contactId/favorite", authenticate, ctrl.updateFavorite);

module.exports = router;
