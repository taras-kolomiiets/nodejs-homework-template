const { NotFound, BadRequest } = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;

const { Contact } = require("../../models");

const deleteContact = async (req, res, next) => {
	const { _id } = req.user;
	try {
		const isValidId = ObjectId.isValid(req.params.contactId);
		if (!isValidId) {
			throw new BadRequest("Invalid id");
		}
		const removedContact = await Contact.findOneAndRemove({
			_id: req.params.contactId,
			owner: _id,
		})
			.lean()
			.exec();
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
