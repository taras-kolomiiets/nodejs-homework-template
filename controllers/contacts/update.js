const { NotFound, BadRequest } = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;

const { Contact, joiSchema } = require("../../models");

const update = async (req, res, next) => {
	const { _id } = req.user;
	try {
		const isValidId = ObjectId.isValid(req.params.contactId);
		if (!isValidId) {
			throw new BadRequest("Invalid id");
		}
		const { error } = joiSchema.validate(req.body);
		if (error) {
			throw new BadRequest("missing fields");
		}

		const updatedContact = await Contact.findOneAndUpdate(
			{ _id: req.params.contactId, owner: _id },
			req.body,
			{ new: true }
		)
			.lean()
			.exec();

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
