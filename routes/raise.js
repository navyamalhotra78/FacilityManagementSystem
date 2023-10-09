const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Ticket = require("../models/ticket.js");
const multer = require("multer"); 
const Booking = require("../models/booking.js");


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

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

router.post("/faculty/raise", middleware.ensureFacultyLoggedIn, upload.single("image"), async (req,res) => {
	try
	{
		const ticket = req.body.ticket;
		ticket.status = "pending";
		ticket.faculty = req.user._id;
		const newTicket = new Ticket(ticket);
		if (req.file) {
            newTicket.image.data = req.file.buffer; 
            newTicket.image.contentType = req.file.mimetype; 
			newTicket.imageName = req.file.originalname;
			console.log("Image Name:", newTicket.imageName);
        }
		// Add this route to serve ticket images
router.get("/faculty/tickets/image/:ticketId", async (req, res) => {
    try {
        const ticketId = req.params.ticketId;
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            return res.status(404).send("Ticket not found");
        }

        // Set appropriate content type for the response
        res.contentType(ticket.image.contentType);

        // Set the Content-Disposition header to suggest a filename for download
        res.setHeader("Content-Disposition", `inline; filename="${ticket.imageName}"`);

        // Send the binary image data
        res.send(ticket.image.data);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

		console.log("New Ticket Object:", newTicket);
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

router.get("/faculty/hall", middleware.ensureFacultyLoggedIn, (req,res) => {
	res.render("faculty/hall", { title: "Booking" });
});

router.post("/faculty/hall", middleware.ensureFacultyLoggedIn, async (req,res) => {
	try
	{
		const booking = req.body;
		booking.status = "pending";
		booking.faculty = req.user._id;
		const newBooking = new Booking(booking);
		await newBooking.save();
		req.flash("success", "Booking request sent successfully");
		res.redirect("/faculty/booking/pending");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/faculty/booking/pending", middleware.ensureFacultyLoggedIn, async (req,res) => {
	try
	{
		const pendingBookings = await Booking.find({ faculty: req.user._id, status: ["pending", "rejected", "accepted", "assigned"] });
		res.render("faculty/pendingBookings", { title: "Pending Bookings", pendingBookings });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/faculty/booking/previous", middleware.ensureFacultyLoggedIn, async (req,res) => {
	try
	{
		const previousBookings = await Booking.find({ status: "completed" }).populate("faculty","admin");
		res.render("faculty/previousBookings", { title: "Previous Bookings", previousBookings });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/faculty/booking/deleteRejected/:bookingId", async (req,res) => {
	try
	{
		const bookingId = req.params.bookingId;
		await Booking.findByIdAndDelete(bookingId);
		res.redirect("/faculty/booking/pending");
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