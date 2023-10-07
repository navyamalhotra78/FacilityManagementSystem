const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
	building: {
		type: String,
		required: true
	},
	room: {
		type: String,
		required: true
	},
	nature: {
		type: String,
		required: true
	},
	problem: {
		type: String,
		required: true
	},
	instruction:{
		type:String
	},
	faculty: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true
	},
	staff: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
	},
	image: {
        data: Buffer, // Binary image data
		imageName: String,
        contentType: String // MIME type of the image (e.g., "image/jpeg" or "image/png")
    },
	
	facultyToAdminMsg: String,
	adminToStaffMsg: String,
	status: {
		type: String,
		enum: ["pending", "rejected", "accepted", "assigned", "completed"],
		required: true
	},
});

const Ticket = mongoose.model("tickets", ticketSchema);
module.exports = Ticket;