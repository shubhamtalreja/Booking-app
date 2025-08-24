
const cron = require('node-cron');
const { addHours, format } = require('date-fns');
const Appointment = require('./models/appointment.model');
const sendEmail = require('./utils/email');

const startScheduler = () => {
    console.log('Scheduler starting...');

    // The schedule is set to run every 30 minutes.
    cron.schedule('*/30 * * * *', async () => {
        const now = new Date();
        console.log(`[Scheduler] Running reminder check at ${now.toLocaleTimeString()}`);

        const in24Hours = addHours(now, 24);

        try {
            // The query to find appointments remains exactly the same.
            const appointmentsToRemind = await Appointment.find({
                startTime: { $gt: now, $lte: in24Hours },
                status: 'confirmed',
                reminderSent: false,
            }).populate('client service');

            if (appointmentsToRemind.length > 0) {
                console.log(`[Scheduler] Found ${appointmentsToRemind.length} appointments to send reminders for.`);

                // --- HIGHLIGHT START: The core processing logic ---

                // We use Promise.allSettled to process all reminders in parallel.
                // This is highly efficient and robust. A failure in one email won't stop others.
                const processingPromises = appointmentsToRemind.map(async (appt) => {
                    try {
                        // 1. Compose the email for this specific appointment.
                        const emailOptions = {
                            to: appt.client.email,
                            subject: `Reminder: Your appointment for ${appt.service.name} is tomorrow!`,
                            text: `Hello ${appt.client.name},\\n\\nThis is a friendly reminder for your upcoming appointment.\\n\\nDetails:\\nService: ${appt.service.name}\\nDate: ${format(new Date(appt.startTime), 'EEEE, MMMM do, yyyy')}\\nTime: ${format(new Date(appt.startTime), 'p')}\\n\\nWe look forward to seeing you!`,
                            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                  <h2>Appointment Reminder</h2>
                  <p>Hello <strong>${appt.client.name}</strong>,</p>
                  <p>This is a friendly reminder for your upcoming appointment tomorrow.</p>
                  <hr>
                  <h3>Appointment Details:</h3>
                  <ul>
                    <li><strong>Service:</strong> ${appt.service.name}</li>
                    <li><strong>Date:</strong> ${format(new Date(appt.startTime), 'EEEE, MMMM do, yyyy')}</li>
                    <li><strong>Time:</strong> ${format(new Date(appt.startTime), 'p')}</li>
                  </ul>
                  <hr>
                  <p>We look forward to seeing you!</p>
                  <p><em>This is an automated email. Please do not reply.</em></p>
                </div>
              `
                        };

                        // 2. Send the email using our utility.
                        await sendEmail(emailOptions);

                        // 3. CRUCIAL: Update the appointment in the database to mark the reminder as sent.
                        // This prevents duplicate emails in the next cron run.
                        await Appointment.findByIdAndUpdate(appt._id, { reminderSent: true });

                        // Return a success message for logging.
                        return { status: 'fulfilled', appointmentId: appt._id };

                    } catch (error) {
                        console.error(`[Scheduler] Failed to process reminder for appointment ${appt._id}:`, error);
                        // Return an error status for logging.
                        return { status: 'rejected', appointmentId: appt._id, error: error.message };
                    }
                });

                // Wait for all the processing promises to complete (either succeed or fail).
                const results = await Promise.all(processingPromises);

                console.log('[Scheduler] Reminder processing complete.');
                results.forEach(result => {
                    if (result.status === 'fulfilled') {
                        console.log(`  - Successfully sent reminder and updated DB for appointment: ${result.appointmentId}`);
                    }
                });

            } else {
                console.log('[Scheduler] No reminders need to be sent at this time.');
            }

        } catch (error) {
            console.error('[Scheduler] Error while fetching appointments for reminders:', error);
        }
    });

    console.log('Scheduler has been started and jobs are scheduled.');
};

module.exports = startScheduler;