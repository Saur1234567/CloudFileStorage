package com.app.common.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public final class DateUtil {

    private DateUtil() {
    }

    private static final DateTimeFormatter DEFAULT_FORMAT =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static String format(LocalDateTime dateTime) {
        return dateTime == null ? null : dateTime.format(DEFAULT_FORMAT);
    }

    public static boolean isExpired(LocalDateTime expiryDate) {
        return expiryDate != null && expiryDate.isBefore(LocalDateTime.now());
    }
}
