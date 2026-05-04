export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    role: 'doctor' | 'patient';
    specialty?: string;
    birthDate?: string;
}
