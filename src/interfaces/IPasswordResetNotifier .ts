export interface IPasswordResetNotifier {
    notifyPasswordReset(email: string, token: string): Promise<void>;
}