import nodemailer from "nodemailer";
import { EMAIL_PASSWORD } from "./env.js";

export const accountEmail = "kushagrabisht10@gmail.com";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.error("SMTP configuration error:", err);
    } else {
        console.log("Nodemailer is ready to send emails");
    }
});

export default transporter;