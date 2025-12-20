/**
 * Smart Online Banking System (SOBS)
 * Model: Transaction.cpp
 * 
 * Implementation of the Transaction model
 */

#include "Transaction.h"
#include <sstream>
#include <iomanip>
#include <random>
#include <ctime>

namespace SOBS {
namespace Model {

// Default Constructor
Transaction::Transaction()
    : transactionId(0), accountId(0), type(TransactionType::DEBIT),
      category(TransactionCategory::TRANSFER), amount(0.0),
      status(TransactionStatus::PENDING), balanceAfter(0.0) {
    transactionDate = time(nullptr);
    transactionRef = generateTransactionRef();
}

// Parameterized Constructor
Transaction::Transaction(long accountId, TransactionType type, 
                         double amount, const std::string& description)
    : transactionId(0), accountId(accountId), type(type),
      category(TransactionCategory::TRANSFER), amount(amount),
      description(description), status(TransactionStatus::PENDING),
      balanceAfter(0.0) {
    transactionDate = time(nullptr);
    transactionRef = generateTransactionRef();
}

// Destructor
Transaction::~Transaction() {}

// Getters
long Transaction::getTransactionId() const { return transactionId; }
std::string Transaction::getTransactionRef() const { return transactionRef; }
long Transaction::getAccountId() const { return accountId; }
TransactionType Transaction::getType() const { return type; }
TransactionCategory Transaction::getCategory() const { return category; }
double Transaction::getAmount() const { return amount; }
std::string Transaction::getDescription() const { return description; }
TransactionStatus Transaction::getStatus() const { return status; }
time_t Transaction::getTransactionDate() const { return transactionDate; }
std::string Transaction::getReferenceNumber() const { return referenceNumber; }
double Transaction::getBalanceAfter() const { return balanceAfter; }

// Setters
void Transaction::setTransactionId(long id) { transactionId = id; }
void Transaction::setTransactionRef(const std::string& ref) { transactionRef = ref; }
void Transaction::setAccountId(long id) { accountId = id; }
void Transaction::setType(TransactionType t) { type = t; }
void Transaction::setCategory(TransactionCategory cat) { category = cat; }
void Transaction::setAmount(double amt) { amount = amt; }
void Transaction::setDescription(const std::string& desc) { description = desc; }
void Transaction::setStatus(TransactionStatus s) { status = s; }
void Transaction::setReferenceNumber(const std::string& ref) { referenceNumber = ref; }
void Transaction::setBalanceAfter(double bal) { balanceAfter = bal; }

// Business Logic
bool Transaction::processTransaction() {
    if (amount <= 0) {
        status = TransactionStatus::FAILED;
        return false;
    }
    
    // In real implementation, would interact with bank core API
    status = TransactionStatus::COMPLETED;
    return true;
}

std::string Transaction::getDetails() const {
    std::stringstream ss;
    ss << std::fixed << std::setprecision(2);
    ss << "Transaction Details:\n"
       << "Reference: " << transactionRef << "\n"
       << "Date: " << getFormattedDate() << "\n"
       << "Type: " << getTypeString() << "\n"
       << "Amount: " << amount << " EGP\n"
       << "Description: " << description << "\n"
       << "Status: " << getStatusString();
    return ss.str();
}

bool Transaction::cancelTransaction() {
    if (status != TransactionStatus::PENDING) {
        return false;
    }
    status = TransactionStatus::CANCELLED;
    return true;
}

std::string Transaction::generateReceipt() const {
    std::stringstream ss;
    ss << std::fixed << std::setprecision(2);
    ss << "=========================================\n"
       << "      SMART ONLINE BANKING SYSTEM\n"
       << "           TRANSACTION RECEIPT\n"
       << "=========================================\n"
       << "Reference: " << transactionRef << "\n"
       << "Date: " << getFormattedDate() << "\n"
       << "-----------------------------------------\n"
       << "Type: " << getTypeString() << "\n"
       << "Category: " << getCategoryString() << "\n"
       << "Amount: EGP " << amount << "\n"
       << "Description: " << description << "\n"
       << "-----------------------------------------\n"
       << "Balance After: EGP " << balanceAfter << "\n"
       << "Status: " << getStatusString() << "\n"
       << "=========================================\n"
       << "Thank you for using SOBS!\n";
    return ss.str();
}

// Static Methods
std::string Transaction::generateTransactionRef() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(100000, 999999);
    
    time_t now = time(nullptr);
    std::stringstream ss;
    ss << "TXN" << now << dis(gen);
    return ss.str();
}

std::string Transaction::getTypeString() const {
    return type == TransactionType::DEBIT ? "DEBIT" : "CREDIT";
}

std::string Transaction::getCategoryString() const {
    switch (category) {
        case TransactionCategory::TRANSFER: return "TRANSFER";
        case TransactionCategory::BILL_PAYMENT: return "BILL_PAYMENT";
        case TransactionCategory::DEPOSIT: return "DEPOSIT";
        case TransactionCategory::WITHDRAWAL: return "WITHDRAWAL";
        case TransactionCategory::FEE: return "FEE";
        case TransactionCategory::REFUND: return "REFUND";
        default: return "UNKNOWN";
    }
}

std::string Transaction::getStatusString() const {
    switch (status) {
        case TransactionStatus::PENDING: return "PENDING";
        case TransactionStatus::COMPLETED: return "COMPLETED";
        case TransactionStatus::FAILED: return "FAILED";
        case TransactionStatus::CANCELLED: return "CANCELLED";
        case TransactionStatus::FLAGGED: return "FLAGGED";
        default: return "UNKNOWN";
    }
}

std::string Transaction::getFormattedDate() const {
    char buffer[80];
    struct tm* timeinfo = localtime(&transactionDate);
    strftime(buffer, 80, "%Y-%m-%d %H:%M:%S", timeinfo);
    return std::string(buffer);
}

std::string Transaction::toString() const {
    std::stringstream ss;
    ss << std::fixed << std::setprecision(2);
    ss << "Transaction{"
       << "ref='" << transactionRef << "'"
       << ", type=" << getTypeString()
       << ", amount=" << amount << " EGP"
       << ", status=" << getStatusString()
       << "}";
    return ss.str();
}

} // namespace Model
} // namespace SOBS
