package com.app.auth.service;

import com.app.auth.client.EmailNotificationRequest;
import com.app.auth.client.NotificationClient;
import com.app.auth.dto.AuthResponse;
import com.app.auth.dto.ForgotPasswordRequest;
import com.app.auth.dto.LoginRequest;
import com.app.auth.dto.RegisterRequest;
import com.app.auth.dto.ResetPasswordRequest;
import com.app.auth.dto.VerifyOtpRequest;
import com.app.auth.entity.PasswordResetOtp;
import com.app.auth.entity.RefreshToken;
import com.app.auth.entity.User;
import com.app.auth.jwt.JwtUtil;
import com.app.auth.repository.PasswordResetOtpRepository;
import com.app.auth.repository.RefreshTokenRepository;
import com.app.auth.repository.UserRepository;
import com.app.auth.security.CustomUserDetails;
import com.app.common.enums.Role;
import com.app.common.exception.DuplicateResourceException;
import com.app.common.exception.InvalidOtpException;
import com.app.common.exception.InvalidTokenException;
import com.app.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final SecureRandom OTP_RANDOM = new SecureRandom();
    private static final int OTP_EXPIRY_MINUTES = 10;

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final NotificationClient notificationClient;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username already taken: " + request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(Set.of(Role.ROLE_USER))
                .enabled(true)
                .accountNonLocked(true)
                .build();

        User saved = userRepository.save(user);
        CustomUserDetails userDetails = new CustomUserDetails(saved);

        return buildAuthResponse(saved, userDetails);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", request.getUsername()));

        return buildAuthResponse(user, userDetails);
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(String refreshTokenValue) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        if (storedToken.isRevoked() || storedToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(storedToken);
            throw new InvalidTokenException("Refresh token expired or revoked. Please log in again");
        }

        User user = storedToken.getUser();
        CustomUserDetails userDetails = new CustomUserDetails(user);

        // Rotate refresh token: delete old one, issue a new pair
        refreshTokenRepository.delete(storedToken);

        return buildAuthResponse(user, userDetails);
    }

    @Override
    @Transactional
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(refreshTokenRepository::delete);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        // Drop any earlier unused code for this email before issuing a new one
        otpRepository.deleteByEmail(user.getEmail());

        String otpCode = String.format("%06d", OTP_RANDOM.nextInt(1_000_000));

        PasswordResetOtp otp = PasswordResetOtp.builder()
                .email(user.getEmail())
                .otpCode(otpCode)
                .expiryDate(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .verified(false)
                .build();
        otpRepository.save(otp);

        EmailNotificationRequest emailRequest = EmailNotificationRequest.builder()
                .recipientEmail(user.getEmail())
                .type("EMAIL_GENERIC")
                .resourceName("Password reset")
                .metadata(Map.of("body",
                        "Your DriveX password reset code is " + otpCode +
                                ". It expires in " + OTP_EXPIRY_MINUTES + " minutes. " +
                                "If you didn't request this, you can ignore this email."))
                .build();
        notificationClient.sendEmail(emailRequest);
    }

    @Override
    @Transactional
    public void verifyOtp(VerifyOtpRequest request) {
        PasswordResetOtp otp = otpRepository.findTopByEmailOrderByCreatedAtDesc(request.getEmail())
                .orElseThrow(() -> new InvalidOtpException("No verification code was requested for this email"));

        if (otp.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidOtpException("This code has expired. Please request a new one");
        }
        if (!otp.getOtpCode().equals(request.getOtp())) {
            throw new InvalidOtpException("Incorrect verification code");
        }

        otp.setVerified(true);
        otpRepository.save(otp);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        PasswordResetOtp otp = otpRepository.findTopByEmailOrderByCreatedAtDesc(request.getEmail())
                .orElseThrow(() -> new InvalidOtpException("No verified code found for this email. Please verify your code again"));

        if (!otp.isVerified()) {
            throw new InvalidOtpException("Please verify your code before setting a new password");
        }
        if (otp.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new InvalidOtpException("This code has expired. Please request a new one");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        // One-time use: this code can't be replayed for another reset
        otpRepository.deleteByEmail(request.getEmail());

        // Any session created before the reset should not remain valid
        refreshTokenRepository.deleteByUser(user);
    }

    private AuthResponse buildAuthResponse(User user, CustomUserDetails userDetails) {
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String refreshTokenValue = jwtUtil.generateRefreshTokenValue(user.getUsername());

        // Persist refresh token so it can be revoked / rotated server-side
        refreshTokenRepository.deleteByUser(user);
        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenValue)
                .user(user)
                .expiryDate(LocalDateTime.now().plusNanos(jwtUtil.getRefreshTokenExpirationMs() * 1_000_000))
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        Set<String> roleNames = user.getRoles().stream()
                .map(Enum::name)
                .collect(Collectors.toSet());

        return AuthResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roleNames)
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .tokenType("Bearer")
                .build();
    }
}
