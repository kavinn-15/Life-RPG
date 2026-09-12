package com.liferpg.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String senderEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends an RPG-themed OTP verification email to the user's Gmail.
     *
     * @param toEmail The recipient's email address
     * @param otp     The 6-digit one-time password
     * @param name    The adventurer's name
     */
    public void sendOtpEmail(String toEmail, String otp, String name) {
        String subject = "⚔️ Life RPG - Your Password Reset Verification Code: " + otp;

        logger.info("=================================================================");
        logger.info("🔐 LIFE RPG PASSWORD RESET OTP FOR [{}]: {}", toEmail, otp);
        logger.info("=================================================================");

        if (senderEmail == null || senderEmail.isBlank() || senderEmail.contains("your-email")) {
            logger.warn("⚠️ SMTP username not configured. OTP was printed to console above for dev testing.");
            return;
        }

        try {
            String htmlContent = buildOtpHtmlEmail(name, otp);
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail, "Life RPG Realm Guardian");
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("✅ Password reset OTP successfully delivered to Gmail: {}", toEmail);
        } catch (MessagingException e) {
            logger.error("❌ Failed to construct OTP email for {}: {}", toEmail, e.getMessage());
        } catch (Exception e) {
            logger.error("❌ Error transmitting OTP email via Gmail SMTP: {}", e.getMessage());
            // Log fallback so developer / user can continue during testing
            logger.info("💡 Fallback OTP Code: {}", otp);
        }
    }

    private String buildOtpHtmlEmail(String name, String otp) {
        String displayName = (name != null && !name.isBlank()) ? name : "Adventurer";
        String template = """
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Life RPG Password Reset</title>
              <style>
                body { margin: 0; padding: 0; background-color: #0b0f19; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f1f5f9; }
                .container { max-width: 580px; margin: 30px auto; background: #131b2e; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
                .header { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 28px 24px; text-align: center; }
                .header h1 { margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px; }
                .header p { margin: 6px 0 0 0; color: #e0e7ff; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; }
                .content { padding: 32px 28px; }
                .greeting { font-size: 18px; font-weight: 600; color: #f8fafc; margin-bottom: 12px; }
                .desc { font-size: 14px; line-height: 1.6; color: #94a3b8; margin-bottom: 24px; }
                .otp-box { background: #0b0f19; border: 2px dashed #6366f1; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
                .otp-title { font-size: 12px; font-weight: 700; color: #818cf8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
                .otp-code { font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #38bdf8; text-shadow: 0 0 12px rgba(56, 189, 248, 0.4); }
                .expiry-badge { display: inline-block; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: 9999px; margin-top: 10px; }
                .warning { background: rgba(245, 158, 11, 0.1); border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; font-size: 12px; color: #fbbf24; margin: 20px 0; line-height: 1.5; }
                .footer { background: #0b0f19; padding: 20px; text-align: center; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>⚔️ LIFE RPG</h1>
                  <p>Gatekeeper Authentication Protocol</p>
                </div>
                <div class="content">
                  <div class="greeting">Greetings, {{NAME}}!</div>
                  <div class="desc">
                    A password reset request was initiated for your Life RPG adventurer account. Use the one-time verification code below to authorize your portal access and set a new password.
                  </div>
                  
                  <div class="otp-box">
                    <div class="otp-title">Your 6-Digit Verification Code</div>
                    <div class="otp-code">{{OTP}}</div>
                    <div class="expiry-badge">⏱️ Expires in 15 Minutes</div>
                  </div>

                  <div class="warning">
                    ⚠️ <strong>Security Notice:</strong> If you did not initiate this request, your adventurer stronghold may be under surveillance. You can safely ignore this email, and your existing credentials will remain intact.
                  </div>
                </div>
                <div class="footer">
                  © Life RPG gamified personal-development platform. All rights reserved.
                </div>
              </div>
            </body>
            </html>
            """;
        return template.replace("{{NAME}}", displayName).replace("{{OTP}}", otp);
    }
}
