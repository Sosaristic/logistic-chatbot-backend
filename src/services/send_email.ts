import fs from 'fs';
import mjml2html from 'mjml';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import path from 'path';

interface EmailOptions {
  templateName: string;
  email: string;
  subject: string;
  variables: Record<string, any>;
}

function readTemplate(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf-8' }, (error, fileContent) => {
      if (error) {
        reject(error);
      } else {
        resolve(fileContent);
      }
    });
  });
}

async function sendEmail(options: EmailOptions): Promise<void> {
  const year = new Date().getFullYear();
  try {
    const { templateName, email, subject, variables } = options;
    const templatePath = path.join(
      __dirname,
      '../templates',
      `${templateName}.mjml`
    );
    const mjmlTemplate = await readTemplate(templatePath);
    const htmlOutput = mjml2html(mjmlTemplate);
    const template = Handlebars.compile(htmlOutput.html);
    const htmlToSend = template({ ...variables, year });

    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: 'sundayomena9@gmail.com',
      to: email,
      subject: subject,
      html: htmlToSend,
    });

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error in sending email:', error);
  }
}

export default sendEmail;
