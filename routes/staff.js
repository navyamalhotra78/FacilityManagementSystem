const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Ticket = require("../models/ticket.js");
console.log("1");

router.get("/staff/dashboard", middleware.ensureStaffLoggedIn, async (req,res) => {

	const staffId = req.user._id;
	const numAssignedTickets = await Ticket.countDocuments({ staff: staffId, status: "assigned" });
	const numCompletedTickets = await Ticket.countDocuments({ staff: staffId, status: "completed" });
	res.render("staff/dashboard", {title: "Dashboard",numAssignedTickets, numCompletedTickets});
	console.log("tickets are being checked");
});

router.get("/staff/ticket/pending", middleware.ensureStaffLoggedIn, async (req,res) => {
	try
	{
		
		const pendingTickets = await Ticket.find({ agent: req.user._id, status: "assigned" }).populate("faculty");
		res.render("staff/pendingTickets", { title: "Pending Tickets", pendingTickets });
		console.log("pending tickets are being checked");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/staff/ticket/view/:ticketId", middleware.ensureStaffLoggedIn, async (req,res) => {
	try
	{
		const ticketId = req.params.ticketId;
		const ticket = await Ticket.findById(ticketId).populate("faculty");
		res.render("staff/collections", { title: "Ticket details", ticket });
		console.log("details of the pending tickets");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/staff/ticket/complete/:ticketId", middleware.ensureStaffLoggedIn, async (req,res) => {
	try
	{
		const ticketId = req.params.ticketId;
		await Ticket.findByIdAndUpdate(ticketId, { status: "completed", completionTime: Date.now() });
		req.flash("success", "Ticket resolved successfully");
		res.redirect(`/staff/ticket/view/${ticketId}`);
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/staff/profile", middleware.ensureStaffLoggedIn, (req,res) => {
	res.render("staff/profile", { title: "My Profile" });
	
});

router.put("/staff/profile", middleware.ensureStaffLoggedIn, async (req,res) => {
	try
	{
		const id = req.user._id;
		console.log("hi");
		const updateObj = req.body.agent;// updateObj: {firstName, lastName, gender, address, phone}
		console.log("hi2");
		await User.findByIdAndUpdate(id, updateObj);
		console.log("hi3");
		
		req.flash("success", "Profile updated successfully");
		res.redirect("/staff/profile");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
	
});


module.exports = router;