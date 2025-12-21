/**
 * Smart Online Banking System (SOBS)
 * Model: Account.h
 * 
 * Represents a bank account in the system
 * Part of the MVC Architecture - Model Layer
 */

#ifndef ACCOUNT_H
#define ACCOUNT_H

#include <string>
#include <ctime>

using namespace std;

namespace SOBS {
namespace Model {

enum class AccountType {
    SAVINGS,
    CHECKING,
    BUSINESS
};

enum class AccountStatus {
    ACTIVE,
    FROZEN,
    CLOSED,
    DORMANT
};

class Account {
private:
    long accountId;
    string accountNumber;   // 14 digits
    long userId;                 // Link to User
    AccountType accountType;
    double balance;
    double availableBalance;
    string currency;        // EGP
    AccountStatus status;
    time_t openedDate;
    double dailyTransferLimit;
    double dailyTransferred;

public:
    // Constructors
    Account();
    Account(long userId, AccountType type);
    
    // Destructor
    ~Account();

    // Getters
    long getAccountId() const;
    string getAccountNumber() const;
    long getUserId() const;
    AccountType getAccountType() const;
    double getBalance() const;
    double getAvailableBalance() const;
    string getCurrency() const;
    AccountStatus getStatus() const;
    time_t getOpenedDate() const;
    double getDailyTransferLimit() const;
    double getDailyTransferred() const;

    // Setters
    void setAccountId(long id);
    void setAccountNumber(const string& number);
    void setUserId(long id);
    void setAccountType(AccountType type);
    void setBalance(double bal);
    void setAvailableBalance(double bal);
    void setCurrency(const string& curr);
    void setStatus(AccountStatus status);
    void setDailyTransferLimit(double limit);

    // Business Logic Methods
    bool updateBalance(double amount);
    bool isActive() const;
    void freeze();
    void unfreeze();
    bool canTransfer(double amount) const;
    void recordDailyTransfer(double amount);
    void resetDailyTransferred();
    
    // Static methods
    static string generateAccountNumber();
    static bool validateAccountNumber(const string& number);

    // Utility
    string toString() const;
    string getAccountTypeString() const;
    string getStatusString() const;
};

} // namespace Model
} // namespace SOBS

#endif // ACCOUNT_H
