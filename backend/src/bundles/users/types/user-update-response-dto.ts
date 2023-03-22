import { type Gender } from './types.js';

type UserUpdateResponseDto = {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    sex?: Gender;
    dateOfBirth?: string;
    language?: string;
    currency?: string;
};

export { type UserUpdateResponseDto };
