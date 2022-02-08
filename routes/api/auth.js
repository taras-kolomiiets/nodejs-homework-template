const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { BadRequest, Conflict, Unauthorized } = require("http-errors");

const router = express.Router();

const { SECRET_KEY } = process.env;

const { User, joiSignupSchema } = require("../../models");
const { authenticate } = require("../../middlewares");

router.post("/signup", async (req, res, next) => {
	try {
		const { error } = joiSignupSchema.validate(req.body);
		if (error) {
			throw new BadRequest("missing required name field");
		}
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (user) {
			throw new Conflict("Email in use");
		}

		const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
		await User.create({ email, password: hashPassword });

		res.status(201).json({
			status: "success",
			code: 201,
			data: {
				user: {
					email,
					subscription: user.subscription,
				},
			},
		});
	} catch (error) {
		next(error);
	}
});

router.post("/login", async (req, res, next) => {
	try {
		const { error } = joiSignupSchema.validate(req.body);
		if (error) {
			throw new BadRequest("missing required name field");
		}
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		const passCompare = bcrypt.compareSync(password, user.password);
		if (!user || !passCompare) {
			throw new Unauthorized("Email or password is wrong");
		}

		const payload = {
			id: user._id,
		};
		const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
		await User.findByIdAndUpdate(user._id, { token });

		res.status(200).json({
			status: "success",
			code: 200,
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
});

router.get("/logout", authenticate, async (req, res, next) => {
	const { _id } = req.user;
	await User.findByIdAndUpdate(_id, { token: null });
	res.status(204).json();
});

module.exports = router;
