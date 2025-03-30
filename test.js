import {sendEmail} from './lib/emailHandler.js';

const email = 'roshanleharwani@gmail.com';
const templateName = 'confirmationEmail';
const templateData = {
  userName: 'Roshan',
  confirmationLink: 'https://example.com/confirm-email'
};

sendEmail(email, templateName, templateData);