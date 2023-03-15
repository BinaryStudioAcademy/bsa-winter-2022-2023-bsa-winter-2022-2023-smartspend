import { userService } from '~/bundles/users/users.js';
import { logger } from '~/common/logger/logger.js';
import { cryptService } from '~/common/services/services.js'; 

import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';

const authService = new AuthService(userService, cryptService);
const authController = new AuthController(logger, authService);

export { authController, authService };
