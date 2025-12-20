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
    std::string transferRef;         // TRF + timestamp + random
    long senderAccountId;
    std::string senderAccountNumber;
    std::string recipientAccountNumber;
    std::string recipientName;
    std::string recipientBank;
    double amount;
    std::string description;
    TransferType transferType;
    TransferStatus status;
    time_t initiatedAt;
    time_t completedAt;
    time_t scheduledDate;
    bool requiresOTP;

public:
    // Constructors
    Transfer();
    Transfer(long senderAccountId, const std::string& recipientAccount, 
             double amount, const std::string& description);
    
    // Destructor
    ~Transfer();

    // Getters
    long getTransferId() const;
    std::string getTransferRef() const;
    long getSenderAccountId() const;
    std::string getSenderAccountNumber() const;
    std::string getRecipientAccountNumber() const;
    std::string getRecipientName() const;
    std::string getRecipientBank() const;
    double getAmount() const;
    std::string getDescription() const;
    TransferType getTransferType() const;
    TransferStatus getStatus() const;
    time_t getInitiatedAt() const;
    time_t getCompletedAt() const;
    time_t getScheduledDate() const;
    bool getRequiresOTP() const;

    // Setters
    void setTransferId(long id);
    void setTransferRef(const std::string& ref);
    void setSenderAccountId(long id);
    void setSenderAccountNumber(const std::string& num);
    void setRecipientAccountNumber(const std::string& num);
    void setRecipientName(const std::string& name);
    void setRecipientBank(const std::string& bank);
    void setAmount(double amt);
    void setDescription(const std::string& desc);
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
    std::string generateReceipt() const;

    // Static methods
    static std::string generateTransferRef();
    static bool validateAmount(double amount);

    // Utility
    std::string toString() const;
    std::string getTypeString() const;
    std::string getStatusString() const;
    std::string getFormattedDate(time_t t) const;
};

} // namespace Model
} // namespace SOBS

#endif // TRANSFER_H
