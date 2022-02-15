const bcrypt = require("bcryptjs");
const { BadRequest, Conflict } = require("http-errors");
const gravatar = require("gravatar");

const { User, joiSignupSchema } = require("../../models");

const signup = async (req, res, next) => {
	try {
		const { error } = joiSignupSchema.validate(req.body);
		if (error) {
			throw new BadRequest("missing required name field");
		}
		const { email, password } = req.body;
		const user = await User.findOne({ email }).lean().exec();
		if (user) {
			throw new Conflict("Email in use");
		}

		const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		const avatarURL = gravatar.url(email, { protocol: "http" });

		const result = await User.create({
			email,
			avatarURL,
			password: hashPassword,
		});

		res.status(201).json({
			status: "success",
			code: 201,
			data: {
				user: {
					email,
					subscription: result.subscription,
				},
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = signup;
