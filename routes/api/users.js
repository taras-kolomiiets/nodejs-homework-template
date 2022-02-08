const express = require("express");
const { NotFound, BadRequest } = require("http-errors");

const { authenticate } = require("../../middlewares");
const { User, subscriptionJoiSchema } = require("../../models");

const router = express.Router();

router.get("/current", authenticate, async (req, res, next) => {
	res.json({
		email: req.user.email,
		subscription: req.user.subscription,
	});
});

router.patch("/", authenticate, async (req, res, next) => {
	try {
		const { error } = subscriptionJoiSchema.validate(req.body);
		if (error) {
			throw new BadRequest(
				"subscription has only contains starter, pro or business"
			);
		}

		const { subscription } = req.body;
		const updatedUser = await User.findByIdAndUpdate(
			req.user._id,
			{ subscription },
			{ new: true }
		);

		if (!updatedUser) {
			throw new NotFound("Not found");
		}

		res.json({
			status: "success",
			code: 200,
			data: {
				updatedUser,
			},
		});
	} catch (error) {
		next(error);
	}
});

module.exports = router;
