const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const sendEmail = async ({ to, subject, htmlContent }) => {
    try {
        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.to = [{ email: to }];
        sendSmtpEmail.sender = { name: 'JHOM FOODS', email: process.env.SMTP_FROM || 'noreply@jhomfoods.com' };
        sendSmtpEmail.subject = subject;
        sendSmtpEmail.htmlContent = htmlContent;

        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Email sent successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};

const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.ADMIN_URL || 'http://localhost:5174'}/reset-password?token=${resetToken}`;

    const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>You requested a password reset for your JHOM FOODS admin account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
            <p>If you didn't request this, please ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">JHOM FOODS Admin Panel</p>
        </div>
    `;

    return sendEmail({
        to: email,
        subject: 'Reset Your Password - JHOM FOODS',
        htmlContent
    });
};

module.exports = {
    sendEmail,
    sendPasswordResetEmail
};
