/**
 * Smart Online Banking System (SOBS)
 * Model: User.cpp
 * 
 * Implementation of the User model
 */

#include "User.h"
#include <sstream>
#include <iomanip>
#include <regex>
#include <random>

namespace SOBS {
namespace Model {

// Default Constructor
User::User() 
    : userId(0), status(UserStatus::PENDING_VERIFICATION), 
      role(UserRole::CUSTOMER), failedLoginAttempts(0) {
    createdAt = time(nullptr);
    lastLoginAt = 0;
}

// Parameterized Constructor
User::User(const std::string& nationalId, const std::string& fullName,
           const std::string& email, const std::string& phoneNumber)
    : userId(0), nationalId(nationalId), fullName(fullName),
      email(email), phoneNumber(phoneNumber),
      status(UserStatus::PENDING_VERIFICATION), role(UserRole::CUSTOMER),
      failedLoginAttempts(0) {
    createdAt = time(nullptr);
    lastLoginAt = 0;
    customerId = generateCustomerId();
}

// Destructor
User::~User() {}

// Getters
long User::getUserId() const { return userId; }
std::string User::getCustomerId() const { return customerId; }
std::string User::getNationalId() const { return nationalId; }
std::string User::getFullName() const { return fullName; }
std::string User::getEmail() const { return email; }
std::string User::getPhoneNumber() const { return phoneNumber; }
std::string User::getAddress() const { return address; }
UserStatus User::getStatus() const { return status; }
UserRole User::getRole() const { return role; }
time_t User::getCreatedAt() const { return createdAt; }
time_t User::getLastLoginAt() const { return lastLoginAt; }
int User::getFailedLoginAttempts() const { return failedLoginAttempts; }

// Setters
void User::setUserId(long id) { userId = id; }
void User::setCustomerId(const std::string& id) { customerId = id; }
void User::setNationalId(const std::string& nid) { nationalId = nid; }
void User::setFullName(const std::string& name) { fullName = name; }
void User::setEmail(const std::string& e) { email = e; }
void User::setPhoneNumber(const std::string& phone) { phoneNumber = phone; }
void User::setAddress(const std::string& addr) { address = addr; }
void User::setPasswordHash(const std::string& hash) { passwordHash = hash; }
void User::setStatus(UserStatus s) { status = s; }
void User::setRole(UserRole r) { role = r; }
void User::setLastLoginAt(time_t t) { lastLoginAt = t; }

// Business Logic Methods
bool User::validatePassword(const std::string& password) const {
    // In real implementation, would use bcrypt to compare
    // This is a simplified version for demonstration
    return !passwordHash.empty() && password.length() >= 8;
}

bool User::isActive() const {
    return status == UserStatus::ACTIVE;
}

void User::incrementFailedAttempts() {
    failedLoginAttempts++;
    if (failedLoginAttempts >= 5) {
        lockAccount();
    }
}

void User::resetFailedAttempts() {
    failedLoginAttempts = 0;
}

void User::lockAccount() {
    status = UserStatus::LOCKED;
}

void User::unlockAccount() {
    status = UserStatus::ACTIVE;
    failedLoginAttempts = 0;
}

bool User::register_user() {
    // Validate all fields
    if (!validateNationalId(nationalId)) return false;
    if (!validateEmail(email)) return false;
    if (!validatePhoneNumber(phoneNumber)) return false;
    
    // Generate customer ID
    customerId = generateCustomerId();
    status = UserStatus::PENDING_VERIFICATION;
    
    return true;
}

bool User::login() {
    if (!isActive()) return false;
    
    lastLoginAt = time(nullptr);
    resetFailedAttempts();
    return true;
}

void User::logout() {
    // Clear session data
}

bool User::updateProfile() {
    // Validate and update profile
    return validateEmail(email) && validatePhoneNumber(phoneNumber);
}

bool User::verifyOTP(const std::string& code) {
    // In real implementation, would verify against stored OTP
    return code.length() == 6;
}

bool User::resetPassword() {
    // Password reset logic
    return true;
}

// Static Validation Methods
bool User::validateNationalId(const std::string& nid) {
    // Egyptian National ID is 14 digits
    if (nid.length() != 14) return false;
    
    for (char c : nid) {
        if (!isdigit(c)) return false;
    }
    
    // First digit should be 2 or 3 (century code)
    if (nid[0] != '2' && nid[0] != '3') return false;
    
    return true;
}

bool User::validateEmail(const std::string& email) {
    std::regex pattern(R"([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})");
    return std::regex_match(email, pattern);
}

bool User::validatePhoneNumber(const std::string& phone) {
    // Egyptian phone number: +20 followed by 10 digits
    std::regex pattern(R"(\+20[0-9]{10})");
    return std::regex_match(phone, pattern);
}

bool User::validatePasswordStrength(const std::string& password) {
    if (password.length() < 8) return false;
    
    bool hasUpper = false, hasLower = false, hasDigit = false, hasSpecial = false;
    
    for (char c : password) {
        if (isupper(c)) hasUpper = true;
        else if (islower(c)) hasLower = true;
        else if (isdigit(c)) hasDigit = true;
        else hasSpecial = true;
    }
    
    return hasUpper && hasLower && hasDigit && hasSpecial;
}

std::string User::generateCustomerId() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(100000000, 999999999);
    
    std::stringstream ss;
    ss << "CUS" << dis(gen);
    return ss.str();
}

std::string User::toString() const {
    std::stringstream ss;
    ss << "User{" 
       << "userId=" << userId
       << ", customerId='" << customerId << "'"
       << ", fullName='" << fullName << "'"
       << ", email='" << email << "'"
       << ", phone='" << phoneNumber << "'"
       << ", status=" << static_cast<int>(status)
       << "}";
    return ss.str();
}

} // namespace Model
} // namespace SOBS
