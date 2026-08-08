package com.app.auth.service;

import com.app.auth.dto.AuthResponse;
import com.app.auth.dto.ForgotPasswordRequest;
import com.app.auth.dto.LoginRequest;
import com.app.auth.dto.RegisterRequest;
import com.app.auth.dto.ResetPasswordRequest;
import com.app.auth.dto.VerifyOtpRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(String refreshToken);

    void logout(String refreshToken);

    void forgotPassword(ForgotPasswordRequest request);

    void verifyOtp(VerifyOtpRequest request);

    void resetPassword(ResetPasswordRequest request);
}
