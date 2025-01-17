const express = require("express");

const { authenticate, upload } = require("../../middlewares");
const ctrl = require("../../controllers/users");

const router = express.Router();

router.get("/verify/:verificationToken", ctrl.verifyEmail);
router.get("/current", authenticate, ctrl.current);
router.post("/verify", authenticate, ctrl.sendVerification);
router.patch("/", authenticate, ctrl.updateSubcription);
router.patch(
	"/avatars",
	authenticate,
	upload.single("avatar"),
	ctrl.updateAvatar
);

module.exports = router;
