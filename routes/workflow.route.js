import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";
import { sendEmail } from "../config/nodemailer.js"; // Updated import path

const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminders);

// Test email route
workflowRouter.post("/test-email", async (req, res) => {
    try {
        await sendEmail({
            to: "kushagrabisht10@gmail.com", // Using your email
            subject: "Test Email from Subscription Tracker",
            html: "<h1>Test Email</h1><p>This is a test email from your subscription tracker API.</p>"
        });
        res.status(200).json({ success: true, message: "Test email sent successfully" });
    } catch (error) {
        console.error("Email test failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default workflowRouter;