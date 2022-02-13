const { NotFound, BadRequest } = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;

const { Contact } = require("../../models");

const deleteContact = async (req, res, next) => {
	try {
		const isValidId = ObjectId.isValid(req.params.contactId);
		if (!isValidId) {
			throw new BadRequest("Invalid id");
		}
		const removedContact = await Contact.findByIdAndDelete(
			req.params.contactId
		);
		if (!removedContact) {
			throw new NotFound("Not found");
		}
		res.json({
			status: "success",
			code: 204,
			data: {
				message: "contact deleted",
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = deleteContact;
