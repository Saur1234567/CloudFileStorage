package com.app.common.constants;

public final class AppConstants {

    private AppConstants() {
    }

    public static final String AUTH_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
    public static final String TOKEN_TYPE = "JWT";

    public static final long ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000L;       // 15 minutes
    public static final long REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000L; // 7 days

    public static final String ROLE_PREFIX = "ROLE_";

    public static final String DEFAULT_SUCCESS_MESSAGE = "Operation completed successfully";
    public static final String DEFAULT_ERROR_MESSAGE = "Something went wrong";
}
