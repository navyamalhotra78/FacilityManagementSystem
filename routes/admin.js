const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Ticket = require("../models/ticket.js");
const Booking = require("../models/booking.js");


router.get("/admin/dashboard", middleware.ensureAdminLoggedIn, async (req,res) => {
	const numAdmins = await User.countDocuments({ role: "admin" }); 
	const numFaculty = await User.countDocuments({ role: "faculty" });
	const numStaff = await User.countDocuments({ role: "staff" });
	const numPendingTickets = await Ticket.countDocuments({ status: "pending" });
	const numAcceptedTickets = await Ticket.countDocuments({ status: "accepted" });
	const numAssignedTickets = await Ticket.countDocuments({ status: "assigned" });
	const numCollectedTickets = await Ticket.countDocuments({ status: "collected" });
	res.render("admin/dashboard", {
		title: "Dashboard",
		numAdmins, numFaculty, numStaff, numPendingTickets, numAcceptedTickets, numAssignedTickets, numCollectedTickets
	});
});

router.get("/admin/tickets/pending", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const pendingTickets = await Ticket.find({status: ["pending", "accepted", "assigned"]}).populate("faculty");
		res.render("admin/pendingTickets", { title: "Pending Tickets", pendingTickets });

	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/tickets/previous", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const previousTickets = await Ticket.find({ status: "completed" }).populate("faculty","admin");
		res.render("admin/previousTickets", { title: "Previous Tickets", previousTickets });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/ticket/view/:ticketId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const ticketId = req.params.ticketId;
		const ticket = await Ticket.findById(ticketId).populate("faculty").populate("staff");	
		res.render("admin/ticket", { title: "Ticket details", ticket });
		
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/ticket/accept/:ticketId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const ticketId = req.params.ticketId;
		await Ticket.findByIdAndUpdate(ticketId, { status: "accepted" });
		req.flash("success", "Ticket accepted successfully");
		res.redirect(`/admin/ticket/view/${ticketId}`);
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/ticket/reject/:ticketId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const ticketId = req.params.ticketId;
		await Ticket.findByIdAndUpdate(ticketId, { status: "rejected"});
		req.flash("success", "Ticket rejected successfully");
		res.redirect(`/admin/ticket/view/${ticketId}`);
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/ticket/assign/:ticketId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const ticketId = req.params.ticketId;
		const staffs = await User.find({ role: "staff" });
		const ticket = await Ticket.findById(ticketId).populate("faculty");
		res.render("admin/assignStaff", { title: "Assign staff", ticket, staffs });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.post("/admin/ticket/assign/:ticketId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const ticketId = req.params.ticketId;
		const {staff, adminToStaffMsg} = req.body;
		await Ticket.findByIdAndUpdate(ticketId, { status: "assigned", staff, adminToStaffMsg });
		req.flash("success", "Staff assigned successfully");
		res.redirect(`/admin/ticket/view/${ticketId}`);
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/staff", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const staff = await User.find({ role: "staff" });
		res.render("admin/staff", { title: "List of staff", staff });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/bookings/pending", middleware.ensureAdminLoggedIn, async (req, res) => {
	try {
	  const pendingBookings = await Booking.find({
		status: { $in: ["requested", "pending", "accepted", "assigned"] }, // Include additional statuses as needed
	  }).populate("faculty");
	  res.render("admin/pendingBookings", { title: "Pending Bookings", pendingBookings });
	} catch (err) {
	  console.log(err);
	  req.flash("error", "Some error occurred on the server.");
	  res.redirect("back");
	}
  });
  

router.get("/admin/bookings/previous", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const previousBookings = await Booking.find({ status: "completed" }).populate("faculty","admin");
		res.render("admin/previousBookings", { title: "Previous Bookings", previousBookings });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/bookings/view/:bookingId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const bookingId = req.params.bookingId;
		const booking = await Booking.findById(bookingId).populate("faculty");	
		res.render("admin/booking", { title: "Booking details", booking });
		
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/bookings/accept/:bookingId", middleware.ensureAdminLoggedIn, async (req, res) => {
	try {
	  const bookingId = req.params.bookingId;
	  await Booking.findByIdAndUpdate(bookingId, { status: "accepted" }); 
	  req.flash("success", "Booking accepted successfully");
	  res.redirect(`/admin/booking/view/${bookingId}`);
	} catch (err) {
	  console.log(err);
	  req.flash("error", "Some error occurred on the server.");
	  res.redirect("back");
	}
  });
  

router.get("/admin/bookings/reject/:bookingId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const bookingId = req.params.bookingId;
		await Booking.findByIdAndUpdate(bookingId, { status: "rejected"});
		req.flash("success", "Booking rejected successfully");
		res.redirect(`/admin/booking/view/${bookingId}`);
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});



router.get("/admin/profile", middleware.ensureAdminLoggedIn, (req,res) => {
	res.render("admin/profile", { title: "My profile" });
});

router.put("/admin/profile", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const id = req.user._id;
		const updateObj = req.body.admin;	
		await User.findByIdAndUpdate(id, updateObj);
		
		req.flash("success", "Profile updated successfully");
		res.redirect("/admin/profile");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
	
});


module.exports = router;