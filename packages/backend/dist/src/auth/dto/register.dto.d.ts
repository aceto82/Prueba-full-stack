declare enum RegisterRole {
    doctor = "doctor",
    patient = "patient"
}
export declare class RegisterDto {
    email: string;
    password: string;
    name: string;
    role: RegisterRole;
}
export {};
