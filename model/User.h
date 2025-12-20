/**
 * Smart Online Banking System (SOBS)
 * Model: User.h
 * 
 * Represents a user/customer in the banking system
 * Part of the MVC Architecture - Model Layer
 */

#ifndef USER_H
#define USER_H

#include <string>
#include <ctime>

namespace SOBS {
namespace Model {

enum class UserStatus {
    ACTIVE,
    LOCKED,
    SUSPENDED,
    PENDING_VERIFICATION
};

enum class UserRole {
    CUSTOMER,
    BUSINESS,
    ADMIN,
    SUPPORT
};

class User {
private:
    long userId;
    std::string customerId;      // CUS123456789
    std::string nationalId;      // Egyptian National ID (14 digits)
    std::string fullName;
    std::string email;
    std::string phoneNumber;     // +20XXXXXXXXXX
    std::string address;
    std::string passwordHash;
    UserStatus status;
    UserRole role;
    time_t createdAt;
    time_t lastLoginAt;
    int failedLoginAttempts;

public:
    // Constructor
    User();
    User(const std::string& nationalId, const std::string& fullName, 
         const std::string& email, const std::string& phoneNumber);
    
    // Destructor
    ~User();

    // Getters
    long getUserId() const;
    std::string getCustomerId() const;
    std::string getNationalId() const;
    std::string getFullName() const;
    std::string getEmail() const;
    std::string getPhoneNumber() const;
    std::string getAddress() const;
    UserStatus getStatus() const;
    UserRole getRole() const;
    time_t getCreatedAt() const;
    time_t getLastLoginAt() const;
    int getFailedLoginAttempts() const;

    // Setters
    void setUserId(long id);
    void setCustomerId(const std::string& id);
    void setNationalId(const std::string& nid);
    void setFullName(const std::string& name);
    void setEmail(const std::string& email);
    void setPhoneNumber(const std::string& phone);
    void setAddress(const std::string& addr);
    void setPasswordHash(const std::string& hash);
    void setStatus(UserStatus status);
    void setRole(UserRole role);
    void setLastLoginAt(time_t time);

    // Business Logic Methods
    bool validatePassword(const std::string& password) const;
    bool isActive() const;
    void incrementFailedAttempts();
    void resetFailedAttempts();
    void lockAccount();
    void unlockAccount();
    bool register_user();
    bool login();
    void logout();
    bool updateProfile();
    bool verifyOTP(const std::string& code);
    bool resetPassword();

    // Static validation methods
    static bool validateNationalId(const std::string& nid);
    static bool validateEmail(const std::string& email);
    static bool validatePhoneNumber(const std::string& phone);
    static bool validatePasswordStrength(const std::string& password);

    // Utility
    std::string toString() const;
    std::string generateCustomerId();
};

} // namespace Model
} // namespace SOBS

#endif // USER_H
