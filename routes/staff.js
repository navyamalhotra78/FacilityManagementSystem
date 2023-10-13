const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Ticket = require("../models/ticket.js");

router.get("/staff/dashboard", middleware.ensureStaffLoggedIn, async (req,res) => {

	const staffId = req.user._id;
	const numAssignedTickets = await Ticket.countDocuments({ staff: staffId, status: "assigned" });
	const numCompletedTickets = await Ticket.countDocuments({ staff: staffId, status: "completed" });
	res.render("staff/dashboard", {title: "Dashboard",numAssignedTickets, numCompletedTickets});
});

router.get("/staff/ticket/pending", middleware.ensureStaffLoggedIn, async (req,res) => {
	try
	{
		
		const pendingTickets = await Ticket.find({ agent: req.user._id, status: "assigned" }).populate("faculty");
		res.render("staff/pendingTickets", { title: "Pending Tickets", pendingTickets });
router.get("/staff/tickets/image/:ticketId", async (req, res) => {
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
		const updateObj = req.body.agent;// updateObj: {firstName, lastName, gender, address, phone}
		await User.findByIdAndUpdate(id, updateObj);
		
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