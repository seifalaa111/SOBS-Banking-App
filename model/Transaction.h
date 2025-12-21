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

using namespace std;

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
    string transactionRef;      // TXN + timestamp + random
    long accountId;
    TransactionType type;
    TransactionCategory category;
    double amount;
    string description;
    TransactionStatus status;
    time_t transactionDate;
    string referenceNumber;
    double balanceAfter;

public:
    // Constructors
    Transaction();
    Transaction(long accountId, TransactionType type, double amount, 
                const string& description);
    
    // Destructor
    ~Transaction();

    // Getters
    long getTransactionId() const;
    string getTransactionRef() const;
    long getAccountId() const;
    TransactionType getType() const;
    TransactionCategory getCategory() const;
    double getAmount() const;
    string getDescription() const;
    TransactionStatus getStatus() const;
    time_t getTransactionDate() const;
    string getReferenceNumber() const;
    double getBalanceAfter() const;

    // Setters
    void setTransactionId(long id);
    void setTransactionRef(const string& ref);
    void setAccountId(long id);
    void setType(TransactionType t);
    void setCategory(TransactionCategory cat);
    void setAmount(double amt);
    void setDescription(const string& desc);
    void setStatus(TransactionStatus s);
    void setReferenceNumber(const string& ref);
    void setBalanceAfter(double bal);

    // Business Logic
    bool processTransaction();
    string getDetails() const;
    bool cancelTransaction();
    string generateReceipt() const;

    // Static methods
    static string generateTransactionRef();
    
    // Utility
    string toString() const;
    string getTypeString() const;
    string getCategoryString() const;
    string getStatusString() const;
    string getFormattedDate() const;
};

} // namespace Model
} // namespace SOBS

#endif // TRANSACTION_H
