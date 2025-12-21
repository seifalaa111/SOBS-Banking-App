/**
 * Smart Online Banking System (SOBS)
 * Model: BillPayment.h
 * 
 * Represents a bill payment transaction
 * Part of the MVC Architecture - Model Layer
 */

#ifndef BILLPAYMENT_H
#define BILLPAYMENT_H

#include <string>
#include <ctime>

using namespace std;

namespace SOBS {
namespace Model {

enum class BillType {
    ELECTRICITY,
    WATER,
    GAS,
    INTERNET,
    MOBILE,
    LANDLINE,
    CREDIT_CARD
};

enum class PaymentStatus {
    PENDING,
    COMPLETED,
    FAILED,
    SCHEDULED
};

class BillPayment {
private:
    long billId;
    string billRef;
    long accountId;
    BillType billType;
    string serviceProvider;
    string billAccountNumber;
    double amount;
    PaymentStatus status;
    time_t paymentDate;
    bool isScheduled;
    time_t scheduledDate;
    bool isRecurring;

public:
    // Constructors
    BillPayment();
    BillPayment(long accountId, BillType type, const string& provider,
                const string& billAccount, double amount);
    
    // Destructor
    ~BillPayment();

    // Getters
    long getBillId() const;
    string getBillRef() const;
    long getAccountId() const;
    BillType getBillType() const;
    string getServiceProvider() const;
    string getBillAccountNumber() const;
    double getAmount() const;
    PaymentStatus getStatus() const;
    time_t getPaymentDate() const;
    bool getIsScheduled() const;
    time_t getScheduledDate() const;
    bool getIsRecurring() const;

    // Setters
    void setBillId(long id);
    void setAccountId(long id);
    void setBillType(BillType type);
    void setServiceProvider(const string& provider);
    void setBillAccountNumber(const string& account);
    void setAmount(double amt);
    void setStatus(PaymentStatus s);
    void setScheduledDate(time_t date);
    void setIsRecurring(bool recurring);

    // Business Logic
    bool payBill();
    bool validateBill();
    bool scheduleBillPayment(time_t date);
    string generateReceipt() const;

    // Static methods
    static string generateBillRef();
    static string getBillTypeString(BillType type);

    // Utility
    string toString() const;
    string getStatusString() const;
};

} // namespace Model
} // namespace SOBS

#endif // BILLPAYMENT_H
