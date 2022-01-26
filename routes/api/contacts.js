const express = require("express");
const createError = require("http-errors");
const Joi = require("joi");
const router = express.Router();

const contacts = require("../../model");

const ContactSchema = Joi.object({
	name: Joi.string().required(),

	email: Joi.string().email().required(),

	phone: Joi.string().required(),
});

router.get("/", async (req, res, next) => {
	try {
		const result = await contacts.listContacts();
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
		const contact = await contacts.getContactById(req.params.contactId);
		if (!contact) {
			throw new createError(404, "Not found");
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

router.post("/", async (req, res, next) => {
	try {
		const { error } = ContactSchema.validate(req.body);
		const newContact = await contacts.addContact(req.body);
		if (error) {
			throw new createError(400, "missing required name field");
		}
		res.status(201).json(newContact);
	} catch (error) {
		next(error);
	}
});

router.delete("/:contactId", async (req, res, next) => {
	try {
		const removedContact = await contacts.removeContact(req.params.contactId);
		if (!removedContact) {
			throw new createError(404, "Not found");
		}
		res.json({ message: "contact deleted" });
	} catch (error) {
		next(error);
	}
});

router.put("/:contactId", async (req, res, next) => {
	try {
		const { error } = ContactSchema.validate(req.body);
		if (error) {
			throw new createError(400, "missing fields");
		}

		const updatedContact = await contacts.updateContact(
			req.params.contactId,
			req.body
		);

		if (!updatedContact) {
			throw new createError(404, "Not found");
		}

		res.json(updatedContact);
	} catch (error) {
		next(error);
	}
});

module.exports = router;
