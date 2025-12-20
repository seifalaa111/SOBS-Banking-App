/**
 * Smart Online Banking System (SOBS)
 * Controller: AuthenticationController.cpp
 * 
 * Implementation of authentication operations
 */

#include "AuthenticationController.h"
#include <random>
#include <sstream>
#include <iomanip>

namespace SOBS {
namespace Controller {

AuthenticationController::AuthenticationController() {}

AuthenticationController::~AuthenticationController() {}

std::string AuthenticationController::generateOTP() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(100000, 999999);
    
    std::stringstream ss;
    ss << dis(gen);
    return ss.str();
}

std::string AuthenticationController::generateSessionToken() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(0, 15);
    
    const char* hex = "0123456789ABCDEF";
    std::stringstream ss;
    ss << "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.";
    for (int i = 0; i < 32; i++) {
        ss << hex[dis(gen)];
    }
    return ss.str();
}

bool AuthenticationController::sendOTPviaSMS(const std::string& phoneNumber, 
                                              const std::string& otp) {
    // In real implementation, would call SMS gateway API
    // For now, simulate success
    return true;
}

std::string AuthenticationController::registerUser(const RegistrationRequest& request) {
    // Validate National ID
    if (!Model::User::validateNationalId(request.nationalId)) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid National ID format. Please enter 14-digit Egyptian National ID",
            "ERR_INVALID_NID"
        );
    }
    
    // Validate Email
    if (!Model::User::validateEmail(request.email)) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid email format",
            "ERR_INVALID_EMAIL"
        );
    }
    
    // Validate Phone Number
    if (!Model::User::validatePhoneNumber(request.phoneNumber)) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid phone number. Use format +20XXXXXXXXXX",
            "ERR_INVALID_PHONE"
        );
    }
    
    // Validate Password Strength
    if (!Model::User::validatePasswordStrength(request.password)) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
            "ERR_WEAK_PASSWORD"
        );
    }
    
    // Create user
    Model::User user(request.nationalId, request.fullName, 
                     request.email, request.phoneNumber);
    
    // In real implementation, would:
    // 1. Check if user already exists
    // 2. Verify National ID with government API
    // 3. Hash password
    // 4. Save to database
    // 5. Send verification OTP
    
    // Generate and send OTP
    std::string otp = generateOTP();
    sendOTPviaSMS(request.phoneNumber, otp);
    
    // Build success response
    std::stringstream dataJson;
    dataJson << "{\n"
             << "    \"customerId\": \"" << user.getCustomerId() << "\",\n"
             << "    \"message\": \"OTP sent to " << request.phoneNumber << "\",\n"
             << "    \"requiresOTP\": true\n"
             << "  }";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(), 
        "Registration initiated. Please verify OTP"
    );
}

std::string AuthenticationController::login(const LoginRequest& request) {
    // Validate input
    if (request.email.empty() || request.password.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Email and password are required",
            "ERR_MISSING_CREDENTIALS"
        );
    }
    
    // In real implementation, would:
    // 1. Find user by email
    // 2. Verify password hash
    // 3. Check if account is locked
    // 4. Generate OTP
    // 5. Send OTP via SMS
    
    // Simulate user lookup
    // For demo, assume credentials are valid
    
    std::string otp = generateOTP();
    std::string sessionId = generateSessionToken();
    
    // Build response
    std::stringstream dataJson;
    dataJson << "{\n"
             << "    \"sessionId\": \"" << sessionId << "\",\n"
             << "    \"requiresOTP\": true,\n"
             << "    \"message\": \"OTP sent to registered mobile number\"\n"
             << "  }";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Credentials verified. Please enter OTP"
    );
}

std::string AuthenticationController::verifyOTP(const OTPRequest& request) {
    // Validate input
    if (request.sessionId.empty() || request.otp.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Session ID and OTP are required",
            "ERR_MISSING_OTP"
        );
    }
    
    if (request.otp.length() != 6) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid OTP format",
            "ERR_INVALID_OTP"
        );
    }
    
    // In real implementation, would:
    // 1. Verify OTP against stored value
    // 2. Check OTP expiration (5 minutes)
    // 3. Create session
    // 4. Return user data with session token
    
    // Simulate successful verification
    std::string sessionToken = generateSessionToken();
    
    View::LoginResponseData loginData;
    loginData.sessionToken = sessionToken;
    loginData.customerId = "CUS123456789";
    loginData.fullName = "Ahmed Mohamed";
    loginData.email = "ahmed@example.com";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        loginData.toJson(),
        "Login successful"
    );
}

std::string AuthenticationController::logout(const std::string& sessionToken) {
    if (sessionToken.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid session",
            "ERR_INVALID_SESSION"
        );
    }
    
    // In real implementation, would:
    // 1. Invalidate session token
    // 2. Clear session data
    // 3. Log logout event
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        "null",
        "Logout successful"
    );
}

std::string AuthenticationController::forgotPassword(const std::string& email) {
    if (!Model::User::validateEmail(email)) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid email format",
            "ERR_INVALID_EMAIL"
        );
    }
    
    // In real implementation, would:
    // 1. Find user by email
    // 2. Generate reset token
    // 3. Send reset link via email
    
    std::stringstream dataJson;
    dataJson << "{\n"
             << "    \"message\": \"Password reset link sent to " << email << "\"\n"
             << "  }";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Password reset initiated"
    );
}

std::string AuthenticationController::resetPassword(const std::string& token, 
                                                     const std::string& newPassword) {
    if (token.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid reset token",
            "ERR_INVALID_TOKEN"
        );
    }
    
    if (!Model::User::validatePasswordStrength(newPassword)) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Password does not meet requirements",
            "ERR_WEAK_PASSWORD"
        );
    }
    
    // In real implementation, would:
    // 1. Verify reset token
    // 2. Check token expiration
    // 3. Hash new password
    // 4. Update user password
    // 5. Invalidate all existing sessions
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        "null",
        "Password reset successful. Please login with new password"
    );
}

} // namespace Controller
} // namespace SOBS
