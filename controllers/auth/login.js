const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequest, Unauthorized, NotFound } = require("http-errors");

const { SECRET_KEY } = process.env;

const { User, joiSignupSchema } = require("../../models");

const login = async (req, res, next) => {
	try {
		const { error } = joiSignupSchema.validate(req.body);
		if (error) {
			throw new BadRequest("missing required name field");
		}
		const { email, password } = req.body;

		const user = await User.findOne({ email }).lean().exec();

		if (!user) {
			throw new NotFound("User not found");
		}

		const passCompare = bcrypt.compareSync(password, user.password);
		if (!passCompare) {
			throw new Unauthorized("Email or password is wrong");
		}

		const payload = {
			id: user._id,
		};
		const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
		await User.findByIdAndUpdate(user._id, { token });

		res.json({
			status: "success",
			data: {
				token,
				user: {
					email,
					subscription: user.subscription,
				},
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = login;
