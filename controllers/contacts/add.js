const { BadRequest } = require("http-errors");
const { Contact, joiSchema } = require("../../models");

const add = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { error } = joiSchema.validate(req.body);
		const newContact = await Contact.create({ ...req.body, owner: _id });
		if (error) {
			throw new BadRequest("missing required name field");
		}
		res.json({
			status: "success",
			code: 201,
			data: {
				newContact,
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = add;
