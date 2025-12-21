/**
 * Smart Online Banking System (SOBS)
 * Model: Transfer.h
 * 
 * Represents a fund transfer between accounts
 * Part of the MVC Architecture - Model Layer
 */

#ifndef TRANSFER_H
#define TRANSFER_H

#include <string>
#include <ctime>

using namespace std;

namespace SOBS {
namespace Model {

enum class TransferType {
    INTRA_BANK,    // Within same bank
    INTER_BANK     // To different bank
};

enum class TransferStatus {
    PENDING,
    PENDING_OTP,
    COMPLETED,
    FAILED,
    CANCELLED,
    SCHEDULED
};

class Transfer {
private:
    long transferId;
    string transferRef;         // TRF + timestamp + random
    long senderAccountId;
    string senderAccountNumber;
    string recipientAccountNumber;
    string recipientName;
    string recipientBank;
    double amount;
    string description;
    TransferType transferType;
    TransferStatus status;
    time_t initiatedAt;
    time_t completedAt;
    time_t scheduledDate;
    bool requiresOTP;

public:
    // Constructors
    Transfer();
    Transfer(long senderAccountId, const string& recipientAccount, 
             double amount, const string& description);
    
    // Destructor
    ~Transfer();

    // Getters
    long getTransferId() const;
    string getTransferRef() const;
    long getSenderAccountId() const;
    string getSenderAccountNumber() const;
    string getRecipientAccountNumber() const;
    string getRecipientName() const;
    string getRecipientBank() const;
    double getAmount() const;
    string getDescription() const;
    TransferType getTransferType() const;
    TransferStatus getStatus() const;
    time_t getInitiatedAt() const;
    time_t getCompletedAt() const;
    time_t getScheduledDate() const;
    bool getRequiresOTP() const;

    // Setters
    void setTransferId(long id);
    void setTransferRef(const string& ref);
    void setSenderAccountId(long id);
    void setSenderAccountNumber(const string& num);
    void setRecipientAccountNumber(const string& num);
    void setRecipientName(const string& name);
    void setRecipientBank(const string& bank);
    void setAmount(double amt);
    void setDescription(const string& desc);
    void setTransferType(TransferType type);
    void setStatus(TransferStatus s);
    void setScheduledDate(time_t date);
    void setRequiresOTP(bool requires);

    // Business Logic
    bool initiateTransfer();
    bool validateRecipient();
    bool scheduleTransfer(time_t date);
    bool processTransfer();
    bool complete();
    string generateReceipt() const;

    // Static methods
    static string generateTransferRef();
    static bool validateAmount(double amount);

    // Utility
    string toString() const;
    string getTypeString() const;
    string getStatusString() const;
    string getFormattedDate(time_t t) const;
};

} // namespace Model
} // namespace SOBS

#endif // TRANSFER_H
