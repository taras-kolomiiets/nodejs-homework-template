const { NotFound, BadRequest } = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;

const { Contact, favoriteJoiSchema } = require("../../models");

const updateFavorite = async (req, res, next) => {
	try {
		const isValidId = ObjectId.isValid(req.params.contactId);
		if (!isValidId) {
			throw new BadRequest("Invalid id");
		}
		const { error } = favoriteJoiSchema.validate(req.body);
		if (error) {
			throw new BadRequest("missing field favorite");
		}

		const { favorite } = req.body;
		const updatedContact = await Contact.findByIdAndUpdate(
			req.params.contactId,
			{ favorite },
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

module.exports = updateFavorite;
