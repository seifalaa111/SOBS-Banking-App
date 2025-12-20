/**
 * Smart Online Banking System (SOBS)
 * Model: BillPayment.cpp
 * 
 * Implementation of the BillPayment model
 */

#include "BillPayment.h"
#include <sstream>
#include <iomanip>
#include <random>

namespace SOBS {
namespace Model {

// Default Constructor
BillPayment::BillPayment()
    : billId(0), accountId(0), billType(BillType::ELECTRICITY),
      amount(0.0), status(PaymentStatus::PENDING),
      isScheduled(false), scheduledDate(0), isRecurring(false) {
    paymentDate = time(nullptr);
    billRef = generateBillRef();
}

// Parameterized Constructor
BillPayment::BillPayment(long accountId, BillType type, const std::string& provider,
                         const std::string& billAccount, double amount)
    : billId(0), accountId(accountId), billType(type),
      serviceProvider(provider), billAccountNumber(billAccount),
      amount(amount), status(PaymentStatus::PENDING),
      isScheduled(false), scheduledDate(0), isRecurring(false) {
    paymentDate = time(nullptr);
    billRef = generateBillRef();
}

// Destructor
BillPayment::~BillPayment() {}

// Getters
long BillPayment::getBillId() const { return billId; }
std::string BillPayment::getBillRef() const { return billRef; }
long BillPayment::getAccountId() const { return accountId; }
BillType BillPayment::getBillType() const { return billType; }
std::string BillPayment::getServiceProvider() const { return serviceProvider; }
std::string BillPayment::getBillAccountNumber() const { return billAccountNumber; }
double BillPayment::getAmount() const { return amount; }
PaymentStatus BillPayment::getStatus() const { return status; }
time_t BillPayment::getPaymentDate() const { return paymentDate; }
bool BillPayment::getIsScheduled() const { return isScheduled; }
time_t BillPayment::getScheduledDate() const { return scheduledDate; }
bool BillPayment::getIsRecurring() const { return isRecurring; }

// Setters
void BillPayment::setBillId(long id) { billId = id; }
void BillPayment::setAccountId(long id) { accountId = id; }
void BillPayment::setBillType(BillType type) { billType = type; }
void BillPayment::setServiceProvider(const std::string& provider) { serviceProvider = provider; }
void BillPayment::setBillAccountNumber(const std::string& account) { billAccountNumber = account; }
void BillPayment::setAmount(double amt) { amount = amt; }
void BillPayment::setStatus(PaymentStatus s) { status = s; }
void BillPayment::setScheduledDate(time_t date) { 
    scheduledDate = date; 
    isScheduled = true;
}
void BillPayment::setIsRecurring(bool recurring) { isRecurring = recurring; }

// Business Logic
bool BillPayment::payBill() {
    if (!validateBill()) {
        status = PaymentStatus::FAILED;
        return false;
    }
    
    // In real implementation:
    // 1. Deduct from account
    // 2. Send to bill provider API
    // 3. Get confirmation
    
    status = PaymentStatus::COMPLETED;
    paymentDate = time(nullptr);
    return true;
}

bool BillPayment::validateBill() {
    if (billAccountNumber.empty()) return false;
    if (amount <= 0) return false;
    if (serviceProvider.empty()) return false;
    return true;
}

bool BillPayment::scheduleBillPayment(time_t date) {
    if (date <= time(nullptr)) return false;
    
    scheduledDate = date;
    isScheduled = true;
    status = PaymentStatus::SCHEDULED;
    return true;
}

std::string BillPayment::generateReceipt() const {
    std::stringstream ss;
    ss << std::fixed << std::setprecision(2);
    
    char dateBuffer[80];
    struct tm* timeinfo = localtime(&paymentDate);
    strftime(dateBuffer, 80, "%Y-%m-%d %H:%M:%S", timeinfo);
    
    ss << "=========================================\n"
       << "      SMART ONLINE BANKING SYSTEM\n"
       << "         BILL PAYMENT RECEIPT\n"
       << "=========================================\n"
       << "Reference: " << billRef << "\n"
       << "Date: " << dateBuffer << "\n"
       << "-----------------------------------------\n"
       << "Bill Type: " << getBillTypeString(billType) << "\n"
       << "Provider: " << serviceProvider << "\n"
       << "Account/Meter: " << billAccountNumber << "\n"
       << "Amount: EGP " << amount << "\n"
       << "-----------------------------------------\n"
       << "Status: " << getStatusString() << "\n"
       << "=========================================\n"
       << "Thank you for using SOBS!\n";
    
    return ss.str();
}

// Static Methods
std::string BillPayment::generateBillRef() {
    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(100000, 999999);
    
    time_t now = time(nullptr);
    std::stringstream ss;
    ss << "BILL" << now << dis(gen);
    return ss.str();
}

std::string BillPayment::getBillTypeString(BillType type) {
    switch (type) {
        case BillType::ELECTRICITY: return "ELECTRICITY";
        case BillType::WATER: return "WATER";
        case BillType::GAS: return "GAS";
        case BillType::INTERNET: return "INTERNET";
        case BillType::MOBILE: return "MOBILE";
        case BillType::LANDLINE: return "LANDLINE";
        case BillType::CREDIT_CARD: return "CREDIT CARD";
        default: return "UNKNOWN";
    }
}

std::string BillPayment::getStatusString() const {
    switch (status) {
        case PaymentStatus::PENDING: return "PENDING";
        case PaymentStatus::COMPLETED: return "COMPLETED";
        case PaymentStatus::FAILED: return "FAILED";
        case PaymentStatus::SCHEDULED: return "SCHEDULED";
        default: return "UNKNOWN";
    }
}

std::string BillPayment::toString() const {
    std::stringstream ss;
    ss << std::fixed << std::setprecision(2);
    ss << "BillPayment{"
       << "ref='" << billRef << "'"
       << ", type=" << getBillTypeString(billType)
       << ", provider='" << serviceProvider << "'"
       << ", amount=" << amount << " EGP"
       << ", status=" << getStatusString()
       << "}";
    return ss.str();
}

} // namespace Model
} // namespace SOBS
