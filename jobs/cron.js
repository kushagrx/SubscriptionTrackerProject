import cron from 'node-cron';
import Subscription from '../models/subscription.model.js';
import transporter, { accountEmail } from '../config/nodemailer.js'; // Importing your existing config!

// This job runs every single day at midnight (00:00)
cron.schedule('0 0 * * *', async () => {
    console.log('Running daily subscription renewal check...');

    try {
        const today = new Date();
        
        // Calculate the target date: exactly 3 days from now
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + 3);
        
        // Set up the boundary for that target day to query accurately
        const startOfTargetDay = new Date(targetDate.setHours(0, 0, 0, 0));
        const endOfTargetDay = new Date(targetDate.setHours(23, 59, 59, 999));

        // Find active subscriptions renewing on that target day
        const expiringSubscriptions = await Subscription.find({
            status: 'active',
            renewalDate: {
                $gte: startOfTargetDay,
                $lte: endOfTargetDay
            }
        }).populate('user'); // Fetches the corresponding User document automatically

        for (const sub of expiringSubscriptions) {
            if (sub.user && sub.user.email) {
                
                const mailOptions = {
                    from: `"Subscription Tracker" <${accountEmail}>`,
                    to: sub.user.email,
                    subject: `Upcoming Renewal: ${sub.name}`,
                    text: `Hey ${sub.user.name},\n\nYour subscription for ${sub.name} is renewing on ${sub.renewalDate.toLocaleDateString()}.\nPlease ensure your payment method is ready!\n\nBest,\nSubTracker Team`
                };

                await transporter.sendMail(mailOptions);
                console.log(`Email successfully sent to ${sub.user.email} for ${sub.name}`);
            }
        }
    } catch (error) {
        console.error('Error in daily subscription cron job:', error);
    }
});