// --- Request DTOs ---

export class ValidateOtpRequestDto {
  constructor(body) {
    this.otp = body.otp?.trim();
  }

  validate() {
    const errors = [];
    if (!this.otp) {
      errors.push('OTP is required');
    } else if (!/^\d{6}$/.test(this.otp)) {
      errors.push('OTP must be a 6-digit number');
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// --- Response DTOs ---

export class OtpResponseDto {
  constructor(message) {
    this.message = message;
  }
}
