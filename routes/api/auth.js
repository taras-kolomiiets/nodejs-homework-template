const express = require("express");

const router = express.Router();

const { authenticate } = require("../../middlewares");
const ctrl = require("../../controllers/auth");

router.post("/signup", ctrl.signup);

router.post("/login", ctrl.login);

router.get("/logout", authenticate, ctrl.logout);

module.exports = router;
