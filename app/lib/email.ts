import { emailTransporter } from '@/app/config/email';

class EmailService {
    private transporter = emailTransporter;

    async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
        if (!to || !subject || !text) {
            throw new Error('Missing required email fields: to, subject, or text');
        }

        try {
            const info = await this.transporter.sendMail({
                from: process.env.EMAIL_USER, // Sender address
                to, 
                subject,
                text,
                html 
            });
            console.log('Email sent successfully:', info.messageId);
        } catch (error: any) {
            console.error('Error sending email:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    async verifyConnection(): Promise<void> {
        try {
            await this.transporter.verify();
            console.log('SMTP connection verified successfully.');
        } catch (error) {
            console.error('Failed to verify SMTP connection:', error);
            throw new Error('SMTP connection verification failed.');
        }
    }
}

export const emailService = new EmailService();
