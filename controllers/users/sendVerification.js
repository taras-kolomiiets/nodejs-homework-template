const { BadRequest, NotFound } = require("http-errors");

const { User, emailJoiSchema } = require("../../models");
const { sendMail } = require("../../helpers");

const sendVerification = async (req, res, next) => {
	try {
		const { email } = req.body;

		const { error } = emailJoiSchema.validate(email);

		if (error) {
			throw new BadRequest("missing required field email");
		}

		const user = await User.findOne({ email }).lean().exec();

		if (!user) {
			throw new NotFound("User not found");
		}

		if (user.verify) {
			throw new BadRequest("Verification has already been passed");
		}

		const mail = {
			to: email,
			subject: "Email verification",
			html: `<a target='_blank' href='http://localhost:8888/api/users/verify/${user.verificationToken}'>Please, verify your email.</a>`,
		};

		await sendMail(mail);

		res.json({
			status: "success",
			code: 201,
			data: {
				message: "Verification email sent",
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = sendVerification;
