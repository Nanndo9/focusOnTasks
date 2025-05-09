import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/smtp-transport";
import fs from 'fs';
import path from 'path';

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        } as Options);
    }

    async sendEmail(to: string, subject: string, html: string): Promise<void> {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Email sent to ${to}`);
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }

    async readEmailTemplate(): Promise<string> {
        const templatePath = path.join(__dirname, '../template/welcomeEmail.html');
        return new Promise((resolve, reject) => {
            fs.readFile(templatePath, 'utf-8', (err, html) => {
                if (err) {
                    console.error('Error reading email template:', err);
                    reject(err);
                    return;
                }
                resolve(html);
            });
        });
    }

    async readResetPasswordEmailTemplate(): Promise<string> {
        const templatePath = path.join(__dirname, '../template/resetPassword.html');
        return new Promise((resolve, reject) => {
            fs.readFile(templatePath, 'utf-8', (err, html) => {
                if (err) {
                    console.error('Error reading email template:', err);
                    reject(err);
                    return;
                }
                resolve(html);
            });
        });
    }
}

export const emailService = new EmailService();