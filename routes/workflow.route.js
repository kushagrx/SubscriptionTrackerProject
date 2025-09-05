import { Router } from "express";
import { sendReminders } from "../controllers/workflow.controller.js";
import { sendReminderEmail } from "../utils/send-email.js";

const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminders);

// Test email route with template
workflowRouter.post("/test-email", async (req, res) => {
    try {
        const testSubscription = {
            user: {
                name: "Test User",
                email: "kushagrabisht10@gmail.com"
            },
            name: "Netflix Premium",
            renewalDate: dayjs().add(7, 'days'),
            price: 19.99,
            currency: "USD",
            frequency: "monthly",
            paymentMethod: "Credit Card"
        };

        await sendReminderEmail({
            to: "kushagrabisht10@gmail.com",
            type: "7 days before reminder",
            subscription: testSubscription
        });

        res.status(200).json({ success: true, message: "Test email sent successfully" });
    } catch (error) {
        console.error("Email test failed:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default workflowRouter;