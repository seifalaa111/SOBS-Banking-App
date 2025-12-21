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

using namespace std;

namespace SOBS {
namespace Controller {

// Request structures
struct RegistrationRequest {
    string nationalId;
    string fullName;
    string email;
    string phoneNumber;
    string password;
    string bankAccountNumber;
};

struct LoginRequest {
    string email;
    string password;
};

struct OTPRequest {
    string sessionId;
    string otp;
};

class AuthenticationController {
private:
    // In real implementation, would inject AuthenticationService
    string generateOTP();
    string generateSessionToken();
    bool sendOTPviaSMS(const string& phoneNumber, const string& otp);

public:
    AuthenticationController();
    ~AuthenticationController();

    /**
     * POST /api/v1/auth/register
     * Register a new user
     */
    string registerUser(const RegistrationRequest& request);

    /**
     * POST /api/v1/auth/login
     * Authenticate user credentials
     */
    string login(const LoginRequest& request);

    /**
     * POST /api/v1/auth/verify-otp
     * Verify OTP and complete authentication
     */
    string verifyOTP(const OTPRequest& request);

    /**
     * POST /api/v1/auth/logout
     * Logout current user session
     */
    string logout(const string& sessionToken);

    /**
     * POST /api/v1/auth/forgot-password
     * Initiate password reset
     */
    string forgotPassword(const string& email);

    /**
     * POST /api/v1/auth/reset-password
     * Complete password reset with token
     */
    string resetPassword(const string& token, const string& newPassword);
};

} // namespace Controller
} // namespace SOBS

#endif // AUTHENTICATIONCONTROLLER_H
