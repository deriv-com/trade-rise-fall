export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export class NetworkError extends ApiError {
    constructor(message: string = 'Network error occurred') {
        super(message);
        this.name = 'NetworkError';
    }
}

export class AuthenticationError extends ApiError {
    constructor(message: string = 'Authentication required') {
        super(message, 401);
        this.name = 'AuthenticationError';
    }
}

export class TokenValidationError extends AuthenticationError {
    constructor(message: string = 'Invalid token') {
        super(message);
        this.name = 'TokenValidationError';
    }
}

export class TokenExpirationError extends AuthenticationError {
    constructor(message: string = 'Token has expired') {
        super(message);
        this.name = 'TokenExpirationError';
    }
}

export class TokenPayloadError extends AuthenticationError {
    constructor(message: string = 'Invalid token payload') {
        super(message);
        this.name = 'TokenPayloadError';
    }
}

export class TimeoutError extends ApiError {
    constructor(message: string = 'Request timed out') {
        super(message, 408);
        this.name = 'TimeoutError';
    }
}

export class ValidationError extends ApiError {
    constructor(message: string = 'Invalid request') {
        super(message, 400);
        this.name = 'ValidationError';
    }
}
