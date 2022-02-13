const { NotFound, BadRequest } = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;

const { Contact, joiSchema } = require("../../models");

const update = async (req, res, next) => {
	try {
		const isValidId = ObjectId.isValid(req.params.contactId);
		if (!isValidId) {
			throw new BadRequest("Invalid id");
		}
		const { error } = joiSchema.validate(req.body);
		if (error) {
			throw new BadRequest("missing fields");
		}

		const updatedContact = await Contact.findByIdAndUpdate(
			req.params.contactId,
			req.body,
			{ new: true }
		);

		if (!updatedContact) {
			throw new NotFound("Not found");
		}

		res.json({
			status: "success",
			code: 200,
			data: {
				updatedContact,
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = update;
