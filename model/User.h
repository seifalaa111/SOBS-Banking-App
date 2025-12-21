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

using namespace std;

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
    string customerId;      // CUS123456789
    string nationalId;      // Egyptian National ID (14 digits)
    string fullName;
    string email;
    string phoneNumber;     // +20XXXXXXXXXX
    string address;
    string passwordHash;
    UserStatus status;
    UserRole role;
    time_t createdAt;
    time_t lastLoginAt;
    int failedLoginAttempts;

public:
    // Constructor
    User();
    User(const string& nationalId, const string& fullName, 
         const string& email, const string& phoneNumber);
    
    // Destructor
    ~User();

    // Getters
    long getUserId() const;
    string getCustomerId() const;
    string getNationalId() const;
    string getFullName() const;
    string getEmail() const;
    string getPhoneNumber() const;
    string getAddress() const;
    UserStatus getStatus() const;
    UserRole getRole() const;
    time_t getCreatedAt() const;
    time_t getLastLoginAt() const;
    int getFailedLoginAttempts() const;

    // Setters
    void setUserId(long id);
    void setCustomerId(const string& id);
    void setNationalId(const string& nid);
    void setFullName(const string& name);
    void setEmail(const string& email);
    void setPhoneNumber(const string& phone);
    void setAddress(const string& addr);
    void setPasswordHash(const string& hash);
    void setStatus(UserStatus status);
    void setRole(UserRole role);
    void setLastLoginAt(time_t time);

    // Business Logic Methods
    bool validatePassword(const string& password) const;
    bool isActive() const;
    void incrementFailedAttempts();
    void resetFailedAttempts();
    void lockAccount();
    void unlockAccount();
    bool register_user();
    bool login();
    void logout();
    bool updateProfile();
    bool verifyOTP(const string& code);
    bool resetPassword();

    // Static validation methods
    static bool validateNationalId(const string& nid);
    static bool validateEmail(const string& email);
    static bool validatePhoneNumber(const string& phone);
    static bool validatePasswordStrength(const string& password);

    // Utility
    string toString() const;
    string generateCustomerId();
};

} // namespace Model
} // namespace SOBS

#endif // USER_H
