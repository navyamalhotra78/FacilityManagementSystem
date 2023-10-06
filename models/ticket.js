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