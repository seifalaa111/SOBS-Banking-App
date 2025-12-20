/**
 * Smart Online Banking System (SOBS)
 * Model: Transfer.cpp
 * 
 * Implementation of the Transfer model
 */

#include "Transfer.h"
#include <sstream>
#include <iomanip>
#include <random>

namespace SOBS {
namespace Model {

// Default Constructor
Transfer::Transfer()
    : transferId(0), senderAccountId(0), amount(0.0),
      transferType(TransferType::INTRA_BANK),
      status(TransferStatus::PENDING), scheduledDate(0),
      requiresOTP(false), completedAt(0) {
    initiatedAt = time(nullptr);
    transferRef = generateTransferRef();
}

// Parameterized Constructor
Transfer::Transfer(long senderAccountId, const std::string& recipientAccount,
                   double amount, const std::string& description)
    : transferId(0), senderAccountId(senderAccountId),
      recipientAccountNumber(recipientAccount), amount(amount),
      description(description), transferType(TransferType::INTRA_BANK),
      status(TransferStatus::PENDING), scheduledDate(0), completedAt(0) {
    initiatedAt = time(nullptr);
    transferRef = generateTransferRef();
    
    // Require OTP for transfers above 5000 EGP
    requiresOTP = (amount > 5000.0);
}

// Destructor
Transfer::~Transfer() {}

// Getters
long Transfer::getTransferId() const { return transferId; }
std::string Transfer::getTransferRef() const { return transferRef; }
long Transfer::getSenderAccountId() const { return senderAccountId; }
std::string Transfer::getSenderAccountNumber() const { return senderAccountNumber; }
std::string Transfer::getRecipientAccountNumber() const { return recipientAccountNumber; }
std::string Transfer::getRecipientName() const { return recipientName; }
std::string Transfer::getRecipientBank() const { return recipientBank; }
double Transfer::getAmount() const { return amount; }
std::string Transfer::getDescription() const { return description; }
TransferType Transfer::getTransferType() const { return transferType; }
TransferStatus Transfer::getStatus() const { return status; }
time_t Transfer::getInitiatedAt() const { return initiatedAt; }
time_t Transfer::getCompletedAt() const { return completedAt; }
time_t Transfer::getScheduledDate() const { return scheduledDate; }
bool Transfer::getRequiresOTP() const { return requiresOTP; }

// Setters
void Transfer::setTransferId(long id) { transferId = id; }
void Transfer::setTransferRef(const std::string& ref) { transferRef = ref; }
void Transfer::setSenderAccountId(long id) { senderAccountId = id; }
void Transfer::setSenderAccountNumber(const std::string& num) { senderAccountNumber = num; }
void Transfer::setRecipientAccountNumber(const std::string& num) { recipientAccountNumber = num; }
void Transfer::setRecipientName(const std::string& name) { recipientName = name; }
void Transfer::setRecipientBank(const std::string& bank) { 
    recipientBank = bank;
    if (!bank.empty()) {
        transferType = TransferType::INTER_BANK;
    }
}
void Transfer::setAmount(double amt) { 
    amount = amt;
    requiresOTP = (amt > 5000.0);
}
void Transfer::setDescription(const std::string& desc) { description = desc; }
void Transfer::setTransferType(TransferType type) { transferType = type; }
void Transfer::setStatus(TransferStatus s) { status = s; }
void Transfer::setScheduledDate(time_t date) { scheduledDate = date; }
void Transfer::setRequiresOTP(bool requires) { requiresOTP = requires; }

// Business Logic
bool Transfer::initiateTransfer() {
    if (!validateAmount(amount)) {
        status = TransferStatus::FAILED;
        return false;
    }
    
    if (requiresOTP) {
        status = TransferStatus::PENDING_OTP;
    } else {
        status = TransferStatus::PENDING;
    }
    
    return true;
}

bool Transfer::validateRecipient() {
    // Check if recipient account exists
    if (recipientAccountNumber.length() != 14) return false;
    
    for (char c : recipientAccountNumber) {
        if (!isdigit(c)) return false;
    }
    
    // In real implementation, would query bank core API
    return true;
}

bool Transfer::scheduleTransfer(time_t date) {
    if (date <= time(nullptr)) return false;
    
    scheduledDate = date;
    status = TransferStatus::SCHEDULED;
    return true;
}

bool Transfer::processTransfer() {
    if (status == TransferStatus::PENDING_OTP) {
        return false;  // Need OTP verification first
    }
    
    // In real implementation:
    // 1. Deduct from sender account
    // 2. Credit to recipient account
    // 3. Create transaction records
    
    return complete();
}

bool Transfer::complete() {
    completedAt = time(nullptr);
    status = TransferStatus::COMPLETED;
    return true;
}

std::string Transfer::generateReceipt() const {
    std::stringstream ss;
    ss << std::fixed << std::setprecision(2);
    ss << "=========================================\n"
       << "      SMART ONLINE BANKING SYSTEM\n"
       << "           TRANSFER RECEIPT\n"
       << "=========================================\n"
       << "Transfer Reference: " << transferRef << "\n"
       << "Date: " << getFormattedDate(initiatedAt) << "\n"
       << "-----------------------------------------\n"
       << "Transfer Type: " << getTypeString() << "\n"
       << "From: " << senderAccountNumber << "\n"
       << "To: " << recipientAccountNumber << "\n"
       << "Recipient: " << recipientName << "\n";
    
    if (transferType == TransferType::INTER_BANK) {
        ss << "Bank: " << recipientBank << "\n";
    }
    
    ss << "Amount: EGP " << amount << "\n"
       << "Description: " << description << "\n"
       << "-----------------------------------------\n"
       << "Status: " << getStatusString() << "\n";
    
    if (status == TransferStatus::COMPLETED) {
        ss << "Completed: " << getFormattedDate(completedAt) << "\n";
    }
    
    ss << "=========================================\n"
       << "Thank you for using SOBS!\n";
    
    return ss.str();
}

// Static Methods
std::string Transfer::generateTransferRef() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(100000, 999999);
    
    time_t now = time(nullptr);
    std::stringstream ss;
    ss << "TRF" << now << dis(gen);
    return ss.str();
}

bool Transfer::validateAmount(double amount) {
    return amount > 0 && amount <= 200000;  // Max single transfer
}

std::string Transfer::getTypeString() const {
    return transferType == TransferType::INTRA_BANK ? "INTRA-BANK" : "INTER-BANK";
}

std::string Transfer::getStatusString() const {
    switch (status) {
        case TransferStatus::PENDING: return "PENDING";
        case TransferStatus::PENDING_OTP: return "PENDING OTP";
        case TransferStatus::COMPLETED: return "COMPLETED";
        case TransferStatus::FAILED: return "FAILED";
        case TransferStatus::CANCELLED: return "CANCELLED";
        case TransferStatus::SCHEDULED: return "SCHEDULED";
        default: return "UNKNOWN";
    }
}

std::string Transfer::getFormattedDate(time_t t) const {
    char buffer[80];
    struct tm* timeinfo = localtime(&t);
    strftime(buffer, 80, "%Y-%m-%d %H:%M:%S", timeinfo);
    return std::string(buffer);
}

std::string Transfer::toString() const {
    std::stringstream ss;
    ss << std::fixed << std::setprecision(2);
    ss << "Transfer{"
       << "ref='" << transferRef << "'"
       << ", amount=" << amount << " EGP"
       << ", to='" << recipientAccountNumber << "'"
       << ", status=" << getStatusString()
       << "}";
    return ss.str();
}

} // namespace Model
} // namespace SOBS
