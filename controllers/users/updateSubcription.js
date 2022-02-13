const { NotFound, BadRequest } = require("http-errors");

const { User, subscriptionJoiSchema } = require("../../models");

const updateSubcription = async (req, res, next) => {
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
};

module.exports = updateSubcription;
