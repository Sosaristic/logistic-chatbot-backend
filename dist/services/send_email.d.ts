interface EmailOptions {
    templateName: string;
    email: string;
    subject: string;
    variables: Record<string, any>;
}
declare function sendEmail(options: EmailOptions): Promise<void>;
export default sendEmail;
