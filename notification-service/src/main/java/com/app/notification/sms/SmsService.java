package com.app.notification.sms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * Placeholder SMS gateway integration.
 * Swap the body of sendSms() for a real provider call (Twilio, MSG91, etc.)
 * once credentials are available — the rest of the service does not need to change.
 *
 * Example Twilio wiring:
 *   Message.creator(new PhoneNumber(to), new PhoneNumber(fromNumber), body).create();
 */
@Slf4j
@Service
public class SmsService {

    public void sendSms(String phoneNumber, String message) {
        if (!StringUtils.hasText(phoneNumber)) {
            log.info("No phone number provided, skipping SMS. Message was: {}", message);
            return;
        }
        // TODO: plug in real SMS provider SDK here
        log.info("[SMS SIMULATED] To: {} | Message: {}", phoneNumber, message);
    }
}
