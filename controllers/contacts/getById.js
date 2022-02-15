const { NotFound, BadRequest } = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;
const { Contact } = require("../../models");

const getById = async (req, res, next) => {
	try {
		const isValidId = ObjectId.isValid(req.params.contactId);
		if (!isValidId) {
			throw new BadRequest("Invalid id");
		}
		const { _id } = req.user;

		const result = await Contact.findOne({
			_id: req.params.contactId,
			owner: _id,
		})
			.lean()
			.exec();

		if (!result) {
			throw new NotFound("Not found");
		}
		res.json({
			status: "success",
			code: 200,
			data: {
				result,
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = getById;
