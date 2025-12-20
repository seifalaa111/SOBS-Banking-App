/**
 * Smart Online Banking System (SOBS)
 * Model: Transaction.h
 * 
 * Represents a financial transaction in the system
 * Part of the MVC Architecture - Model Layer
 */

#ifndef TRANSACTION_H
#define TRANSACTION_H

#include <string>
#include <ctime>

namespace SOBS {
namespace Model {

enum class TransactionType {
    DEBIT,
    CREDIT
};

enum class TransactionCategory {
    TRANSFER,
    BILL_PAYMENT,
    DEPOSIT,
    WITHDRAWAL,
    FEE,
    REFUND
};

enum class TransactionStatus {
    PENDING,
    COMPLETED,
    FAILED,
    CANCELLED,
    FLAGGED
};

class Transaction {
private:
    long transactionId;
    std::string transactionRef;      // TXN + timestamp + random
    long accountId;
    TransactionType type;
    TransactionCategory category;
    double amount;
    std::string description;
    TransactionStatus status;
    time_t transactionDate;
    std::string referenceNumber;
    double balanceAfter;

public:
    // Constructors
    Transaction();
    Transaction(long accountId, TransactionType type, double amount, 
                const std::string& description);
    
    // Destructor
    ~Transaction();

    // Getters
    long getTransactionId() const;
    std::string getTransactionRef() const;
    long getAccountId() const;
    TransactionType getType() const;
    TransactionCategory getCategory() const;
    double getAmount() const;
    std::string getDescription() const;
    TransactionStatus getStatus() const;
    time_t getTransactionDate() const;
    std::string getReferenceNumber() const;
    double getBalanceAfter() const;

    // Setters
    void setTransactionId(long id);
    void setTransactionRef(const std::string& ref);
    void setAccountId(long id);
    void setType(TransactionType t);
    void setCategory(TransactionCategory cat);
    void setAmount(double amt);
    void setDescription(const std::string& desc);
    void setStatus(TransactionStatus s);
    void setReferenceNumber(const std::string& ref);
    void setBalanceAfter(double bal);

    // Business Logic
    bool processTransaction();
    std::string getDetails() const;
    bool cancelTransaction();
    std::string generateReceipt() const;

    // Static methods
    static std::string generateTransactionRef();
    
    // Utility
    std::string toString() const;
    std::string getTypeString() const;
    std::string getCategoryString() const;
    std::string getStatusString() const;
    std::string getFormattedDate() const;
};

} // namespace Model
} // namespace SOBS

#endif // TRANSACTION_H
