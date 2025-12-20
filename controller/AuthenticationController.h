/**
 * Smart Online Banking System (SOBS)
 * Controller: AuthenticationController.h
 * 
 * Handles user authentication operations
 * Part of the MVC Architecture - Controller Layer
 */

#ifndef AUTHENTICATIONCONTROLLER_H
#define AUTHENTICATIONCONTROLLER_H

#include <string>
#include <memory>
#include "../model/User.h"
#include "../view/ApiResponse.h"

namespace SOBS {
namespace Controller {

// Request structures
struct RegistrationRequest {
    std::string nationalId;
    std::string fullName;
    std::string email;
    std::string phoneNumber;
    std::string password;
    std::string bankAccountNumber;
};

struct LoginRequest {
    std::string email;
    std::string password;
};

struct OTPRequest {
    std::string sessionId;
    std::string otp;
};

class AuthenticationController {
private:
    // In real implementation, would inject AuthenticationService
    std::string generateOTP();
    std::string generateSessionToken();
    bool sendOTPviaSMS(const std::string& phoneNumber, const std::string& otp);

public:
    AuthenticationController();
    ~AuthenticationController();

    /**
     * POST /api/v1/auth/register
     * Register a new user
     */
    std::string registerUser(const RegistrationRequest& request);

    /**
     * POST /api/v1/auth/login
     * Authenticate user credentials
     */
    std::string login(const LoginRequest& request);

    /**
     * POST /api/v1/auth/verify-otp
     * Verify OTP and complete authentication
     */
    std::string verifyOTP(const OTPRequest& request);

    /**
     * POST /api/v1/auth/logout
     * Logout current user session
     */
    std::string logout(const std::string& sessionToken);

    /**
     * POST /api/v1/auth/forgot-password
     * Initiate password reset
     */
    std::string forgotPassword(const std::string& email);

    /**
     * POST /api/v1/auth/reset-password
     * Complete password reset with token
     */
    std::string resetPassword(const std::string& token, const std::string& newPassword);
};

} // namespace Controller
} // namespace SOBS

#endif // AUTHENTICATIONCONTROLLER_H
