import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodeMailer from 'nodemailer';

import { config } from '../config/config.js';
import { CryptService } from './crypt/crypt.service.js';
import { EmailService } from './email/email.service.js';
import { TokenService } from './token/token.service.js';

const cryptService = new CryptService(bcrypt);
const tokenService = new TokenService(jwt, config);
const emailService = new EmailService(nodeMailer, config);

export { cryptService, emailService, tokenService };
