const { NotFound, BadRequest } = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;
const { Contact } = require("../../models");

const getById = async (req, res, next) => {
	try {
		const isValidId = ObjectId.isValid(req.params.contactId);
		if (!isValidId) {
			throw new BadRequest("Invalid id");
		}
		const contact = await Contact.findById(req.params.contactId);
		if (!contact) {
			throw new NotFound("Not found");
		}
		res.json({
			status: "success",
			code: 200,
			data: {
				contact,
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = getById;
