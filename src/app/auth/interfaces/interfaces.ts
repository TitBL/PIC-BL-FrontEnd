export interface AuthResponse {
    Success: boolean;
    Message?: string;
    Data?: TokenResponse;
    Exception?: [];
    Code?: number;
}

export interface TokenResponse {
    token?: string;
    token_type?: string;
    token_expires?: string;
    session?: string;
}

export interface UserAuth {
    dni?: string;
    name?: string;
    email?: string;
    pwd: string;
}