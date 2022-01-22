const fs = require("fs/promises");
const path = require("path");
const { v4 } = require("uuid");

const filePath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
	const data = await fs.readFile(filePath);
	const contacts = JSON.parse(data);
	return contacts;
};

const getContactById = async (contactId) => {
	const contacts = await listContacts();
	const contact = contacts.find((c) => c.id === contactId);
	if (!contact) {
		return null;
	}
	return contact;
};

const removeContact = async (contactId) => {
	const contactsList = await listContacts();
	const idx = contactsList.findIndex((contact) => contact.id === contactId);
	if (idx === -1) {
		return null;
	}

	const removedContact = contactsList[idx];

	contactsList.splice(idx, 1);

	await fs.writeFile(filePath, JSON.stringify(contactsList));

	return removedContact;
};

const addContact = async (body) => {
	const { name, phone, email } = body;
	const newContact = { name, phone, email, id: v4() };

	const contactsList = await listContacts();
	contactsList.push(newContact);

	await fs.writeFile(filePath, JSON.stringify(contactsList));
	return newContact;
};

const updateContact = async (contactId, body) => {
	const { name, phone, email } = body;
	const contactsList = await listContacts();

	const idx = contactsList.findIndex((contact) => contact.id === contactId);
	if (idx === -1) {
		return null;
	}
	contactsList[idx] = { id: contactId, name, phone, email };

	await fs.writeFile(filePath, JSON.stringify(contactsList));
	return contactsList[idx];
};

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
};
