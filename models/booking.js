const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	branch: {
		type: String,
		required: true
	},
	charge: {
		type: String,
		required: true
	},
	year: {
		type: String,
		required: true
	},
	duration: {
		type: String,
		required: true
	},
	purpose:{
		type:String,
		required:true
	},
	audi:{
		type:String,
		required:true
	},
	faculty: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true
	},
	
	facultyToAdminMsg: String,
	status: {
		type: String,
		enum: ["pending", "rejected", "accepted", "assigned"],
		required: true
	},
});

const Booking = mongoose.model("booking", bookingSchema);
module.exports = Booking;