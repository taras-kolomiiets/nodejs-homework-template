const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { User } = require("../../models");

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

const updateAvatar = async (req, res, next) => {
	const { _id } = req.user;
	const { path: tempUpload, filename } = req.file;
	try {
		const [extention] = filename.split(".").reverse();
		const newFilename = `${_id}.${extention}`;

		const resultUpload = path.join(avatarsDir, newFilename);

		const file = await Jimp.read(tempUpload);
		file.resize(250, 250).write(resultUpload);

		await fs.unlink(tempUpload);

		const avatarURL = path.join("public", "avatars", newFilename);
		await User.findByIdAndUpdate(_id, { avatarURL }).lean().exec();
		res.json({
			status: "success",
			code: 200,
			data: {
				avatarURL,
			},
		});
	} catch (error) {
		next(error);
	}
};

module.exports = updateAvatar;
