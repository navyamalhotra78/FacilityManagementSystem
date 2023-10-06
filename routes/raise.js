const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Ticket = require("../models/ticket.js");


router.get("/faculty/dashboard", middleware.ensureFacultyLoggedIn, async (req,res) => {
	const facultyId = req.user._id;
	const numPendingTickets = await Ticket.countDocuments({ faculty: facultyId, status: "pending" });
	const numAcceptedTickets = await Ticket.countDocuments({ faculty: facultyId, status: "accepted" });
	const numAssignedTickets = await Ticket.countDocuments({ faculty: facultyId, status: "assigned" });
	const numCompletedTickets = await Ticket.countDocuments({ faculty: facultyId, status: "completed" });
	res.render("faculty/dashboard", {
		title: "Dashboard",
		numPendingTickets, numAcceptedTickets, numAssignedTickets, numCompletedTickets
	});
});

router.get("/faculty/raise", middleware.ensureFacultyLoggedIn, (req,res) => {
	res.render("faculty/raise", { title: "Ticket" });
});

router.post("/faculty/raise", middleware.ensureFacultyLoggedIn, async (req,res) => {
	try
	{
		const ticket = req.body.ticket;
		ticket.status = "pending";
		ticket.faculty = req.user._id;
		const newTicket = new Ticket(ticket);
		await newTicket.save();
		req.flash("success", "Ticket request sent successfully");
		res.redirect("/faculty/tickets/pending");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/faculty/tickets/pending", middleware.ensureFacultyLoggedIn, async (req,res) => {
	try
	{
		const pendingTickets = await Ticket.find({ faculty: req.user._id, status: ["pending", "rejected", "accepted", "assigned"] }).populate("staff");
		res.render("faculty/pendingTickets", { title: "Pending Tickets", pendingTickets });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/faculty/tickets/previous", middleware.ensureFacultyLoggedIn, async (req,res) => {
	try
	{
		const previousTickets = await Ticket.find({ faculty: req.user._id, status: "completed" }).populate("staff");
		res.render("faculty/previousTickets", { title: "Previous Tickets", previousTickets });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/faculty/Ticket/deleteRejected/:ticketId", async (req,res) => {
	try
	{
		const ticketId = req.params.ticketId;
		await Ticket.findByIdAndDelete(ticketId);
		res.redirect("/faculty/tickets/pending");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/faculty/profile", middleware.ensureFacultyLoggedIn, (req,res) => {
	res.render("faculty/profile", { title: "My Profile" });
});

router.put("/faculty/profile", middleware.ensureFacultyLoggedIn, async (req,res) => {
	try
	{
		const id = req.user._id;
		const updateObj = req.body.faculty;	// updateObj: {firstName, lastName, gender, address, phone}
		await User.findByIdAndUpdate(id, updateObj);
		
		req.flash("success", "Profile updated successfully");
		res.redirect("/faculty/profile");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
	
});


module.exports = router;