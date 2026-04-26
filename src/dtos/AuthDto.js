import { UserDto } from './UserDto.js';

// --- Request DTOs ---

export class SignupRequestDto {
  constructor(body) {
    this.name = body.name?.trim();
    this.email = body.email?.trim().toLowerCase();
    this.password = body.password;
    this.phone = body.phone?.trim();
    this.companyName = body.companyName?.trim();
  }

  validate() {
    const errors = [];
    if (!this.name) errors.push('Name is required');
    if (!this.email) errors.push('Email is required');
    if (!this.password || this.password.length < 6) errors.push('Password must be at least 6 characters');
    if (!this.phone) errors.push('Phone number is required');
    
    // Simple email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.email && !emailRegex.test(this.email)) {
      errors.push('Invalid email format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export class LoginRequestDto {
  constructor(body) {
    this.email = body.email?.trim().toLowerCase();
    this.password = body.password;
  }

  validate() {
    const errors = [];
    if (!this.email) errors.push('Email is required');
    if (!this.password) errors.push('Password is required');
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// --- Response DTOs ---

export class LoginResponseDto {
  constructor(user, isAdmin) {
    this.message = 'Login successful';
    this.user = new UserDto(user);
    this.isAdmin = isAdmin;
  }
}

export class SignupResponseDto {
  constructor(user) {
    this.message = 'User created';
    this.user = new UserDto(user);
  }
}

export class SessionResponseDto {
  constructor(user, isAdmin) {
    this.user = new UserDto(user);
    this.isAdmin = isAdmin;
  }
}
