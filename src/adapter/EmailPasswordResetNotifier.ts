import { IPasswordResetNotifier } from "../interfaces/IPasswordResetNotifier ";
import { emailService } from "../services/EmailService";

export class EmailPasswordResetNotifier implements IPasswordResetNotifier {
    constructor(private readonly baseUrl: string = process.env.APP_URL || "http://localhost:3000") { }

    async notifyPasswordReset(email: string, token: string): Promise<void> {
        const resetLink = `${this.baseUrl}/reset-password/${token}`;

        const html = await emailService.readResetPasswordEmailTemplate();
        const htmlWithLink = html.replace('{{resetLink}}', resetLink);

        await emailService.sendEmail(
            email,
            'Redefinição de Senha',
            htmlWithLink
        );
    }
}

export const emailPasswordResetNotifier = new EmailPasswordResetNotifier();