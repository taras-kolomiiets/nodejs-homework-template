const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = Schema(
	{
		password: {
			type: String,
			required: [true, "Password is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
		},
		subscription: {
			type: String,
			enum: ["starter", "pro", "business"],
			default: "starter",
		},
		token: {
			type: String,
			default: null,
		},
		avatarURL: {
			type: String,
		},
	},
	{ versionKey: false, timestamps: true }
);

const joiSignupSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	subscription: Joi.string().valid("starter", "pro", "business"),
});

const subscriptionJoiSchema = Joi.object({
	subscription: Joi.string().valid("starter", "pro", "business").required(),
});

const User = model("user", userSchema);

module.exports = {
	User,
	joiSignupSchema,
	subscriptionJoiSchema,
};
