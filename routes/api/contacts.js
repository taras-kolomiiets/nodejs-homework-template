const express = require("express");
const { NotFound, BadRequest } = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;
const router = express.Router();

const { Contact, joiSchema, favoriteJoiSchema } = require("../../models");

const { authenticate } = require("../../middlewares");

router.get("/", authenticate, async (req, res, next) => {
	try {
		const { _id } = req.user;
		const { page = 1, limit = 10, favorite } = req.query;
		const skip = (page - 1) * limit;
		const result = favorite
			? await Contact.find({ owner: _id })
					.select({ favorite: true })
					.populate("owner", "_id name email")
			: await Contact.find({ owner: _id }, "", {
					skip,
					limit: Number(limit),
			  }).populate("owner", "_id name email");

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
});

router.get("/:contactId", async (req, res, next) => {
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
});

router.post("/", authenticate, async (req, res, next) => {
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
});

router.delete("/:contactId", async (req, res, next) => {
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
});

router.put("/:contactId", async (req, res, next) => {
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
});

router.patch("/:contactId/favorite", async (req, res, next) => {
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
});

module.exports = router;
