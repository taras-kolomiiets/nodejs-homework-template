const { NotFound } = require("http-errors");

const { User } = require("../../models");

const verifyEmail = async (req, res, next) => {
	try {
		const { verificationToken } = req.params;

		const user = await User.findOne({ verificationToken }).lean().exec();

		if (!user) {
			throw new NotFound("User not found");
		}

		await User.findByIdAndUpdate(user._id, {
			verify: true,
			verificationToken: "",
		})
			.lean()
			.exec();

		res.json({
			status: "success",
			data: {
				message: "Verification successful",
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = verifyEmail;
