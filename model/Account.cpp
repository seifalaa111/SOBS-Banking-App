/**
 * Smart Online Banking System (SOBS)
 * Model: Account.cpp
 * 
 * Implementation of the Account model
 */

#include "Account.h"
#include <sstream>
#include <random>
#include <iomanip>

using namespace std;

namespace SOBS {
namespace Model {

// Default Constructor
Account::Account()
    : accountId(0), userId(0), accountType(AccountType::SAVINGS),
      balance(0.0), availableBalance(0.0), currency("EGP"),
      status(AccountStatus::ACTIVE), dailyTransferLimit(50000.0),
      dailyTransferred(0.0) {
    openedDate = time(nullptr);
    accountNumber = generateAccountNumber();
}

// Parameterized Constructor
Account::Account(long userId, AccountType type)
    : accountId(0), userId(userId), accountType(type),
      balance(0.0), availableBalance(0.0), currency("EGP"),
      status(AccountStatus::ACTIVE), dailyTransferred(0.0) {
    openedDate = time(nullptr);
    accountNumber = generateAccountNumber();
    
    // Set daily limit based on account type
    switch (type) {
        case AccountType::BUSINESS:
            dailyTransferLimit = 200000.0;
            break;
        case AccountType::CHECKING:
            dailyTransferLimit = 100000.0;
            break;
        default:
            dailyTransferLimit = 50000.0;
    }
}

// Destructor
Account::~Account() {}

// Getters
long Account::getAccountId() const { return accountId; }
string Account::getAccountNumber() const { return accountNumber; }
long Account::getUserId() const { return userId; }
AccountType Account::getAccountType() const { return accountType; }
double Account::getBalance() const { return balance; }
double Account::getAvailableBalance() const { return availableBalance; }
string Account::getCurrency() const { return currency; }
AccountStatus Account::getStatus() const { return status; }
time_t Account::getOpenedDate() const { return openedDate; }
double Account::getDailyTransferLimit() const { return dailyTransferLimit; }
double Account::getDailyTransferred() const { return dailyTransferred; }

// Setters
void Account::setAccountId(long id) { accountId = id; }
void Account::setAccountNumber(const string& number) { accountNumber = number; }
void Account::setUserId(long id) { userId = id; }
void Account::setAccountType(AccountType type) { accountType = type; }
void Account::setBalance(double bal) { balance = bal; availableBalance = bal; }
void Account::setAvailableBalance(double bal) { availableBalance = bal; }
void Account::setCurrency(const string& curr) { currency = curr; }
void Account::setStatus(AccountStatus s) { status = s; }
void Account::setDailyTransferLimit(double limit) { dailyTransferLimit = limit; }

// Business Logic Methods
bool Account::updateBalance(double amount) {
    double newBalance = balance + amount;
    if (newBalance < 0) return false;  // Insufficient funds
    
    balance = newBalance;
    availableBalance = newBalance;
    return true;
}

bool Account::isActive() const {
    return status == AccountStatus::ACTIVE;
}

void Account::freeze() {
    status = AccountStatus::FROZEN;
}

void Account::unfreeze() {
    status = AccountStatus::ACTIVE;
}

bool Account::canTransfer(double amount) const {
    if (!isActive()) return false;
    if (amount > availableBalance) return false;
    if (dailyTransferred + amount > dailyTransferLimit) return false;
    return true;
}

void Account::recordDailyTransfer(double amount) {
    dailyTransferred += amount;
}

void Account::resetDailyTransferred() {
    dailyTransferred = 0.0;
}

// Static Methods
string Account::generateAccountNumber() {
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<long long> dis(10000000000000LL, 99999999999999LL);
    
    stringstream ss;
    ss << dis(gen);
    return ss.str();
}

bool Account::validateAccountNumber(const string& number) {
    if (number.length() != 14) return false;
    
    for (char c : number) {
        if (!isdigit(c)) return false;
    }
    return true;
}

string Account::getAccountTypeString() const {
    switch (accountType) {
        case AccountType::SAVINGS: return "SAVINGS";
        case AccountType::CHECKING: return "CHECKING";
        case AccountType::BUSINESS: return "BUSINESS";
        default: return "UNKNOWN";
    }
}

string Account::getStatusString() const {
    switch (status) {
        case AccountStatus::ACTIVE: return "ACTIVE";
        case AccountStatus::FROZEN: return "FROZEN";
        case AccountStatus::CLOSED: return "CLOSED";
        case AccountStatus::DORMANT: return "DORMANT";
        default: return "UNKNOWN";
    }
}

string Account::toString() const {
    stringstream ss;
    ss << fixed << setprecision(2);
    ss << "Account{"
       << "accountNumber='" << accountNumber << "'"
       << ", type=" << getAccountTypeString()
       << ", balance=" << balance << " " << currency
       << ", status=" << getStatusString()
       << "}";
    return ss.str();
}

} // namespace Model
} // namespace SOBS
