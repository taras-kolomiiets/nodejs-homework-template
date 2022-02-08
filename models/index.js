const { Contact, joiSchema, favoriteJoiSchema } = require("./contact");
const { User, joiSignupSchema, subscriptionJoiSchema } = require("./user");

module.exports = {
	Contact,
	joiSchema,
	favoriteJoiSchema,
	User,
	joiSignupSchema,
	subscriptionJoiSchema,
};
