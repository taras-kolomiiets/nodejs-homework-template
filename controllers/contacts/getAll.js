const { BadRequest } = require("http-errors");

const { Contact } = require("../../models");

const getAll = async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { page = 1, limit = 10, favorite } = req.query;
		if (isNaN(page || limit)) {
			throw new BadRequest("Page and limit must be a number.");
		}
		const skip = (page - 1) * limit;

		const query = favorite ? { owner: _id, favorite } : { owner: _id };

		const result = await Contact.find(query, "", {
			skip,
			limit: Number(limit),
		})
			.populate("owner", "_id name email")
			.lean()
			.exec();

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

module.exports = getAll;
