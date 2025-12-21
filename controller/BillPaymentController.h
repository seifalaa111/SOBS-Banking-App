/**
 * Smart Online Banking System (SOBS)
 * Controller: BillPaymentController.h
 * 
 * Handles bill payment operations
 * Part of the MVC Architecture - Controller Layer
 */

#ifndef BILLPAYMENTCONTROLLER_H
#define BILLPAYMENTCONTROLLER_H

#include <string>
#include "../model/BillPayment.h"
#include "../view/ApiResponse.h"

using namespace std;

namespace SOBS {
namespace Controller {

struct BillPaymentRequest {
    string accountNumber;
    string billType;
    string serviceProvider;
    string billAccountNumber;
    double amount;
    bool saveAsBiller;
    bool makeRecurring;
    string scheduledDate;
};

class BillPaymentController {
public:
    BillPaymentController();
    ~BillPaymentController();

    /**
     * GET /api/v1/bills/providers
     * Get bill providers by type
     */
    string getProviders(const string& billType);

    /**
     * GET /api/v1/bills/amount
     * Get bill amount from provider
     */
    string getBillAmount(const string& provider, 
                              const string& billAccountNumber);

    /**
     * POST /api/v1/bills/pay
     * Process bill payment
     */
    string payBill(const string& userId, 
                        const BillPaymentRequest& request);

    /**
     * GET /api/v1/bills/history
     * Get bill payment history
     */
    string getPaymentHistory(const string& userId);

    /**
     * GET /api/v1/bills/saved
     * Get saved billers
     */
    string getSavedBillers(const string& userId);

    /**
     * POST /api/v1/bills/schedule
     * Schedule a bill payment
     */
    string scheduleBillPayment(const string& userId,
                                     const BillPaymentRequest& request);
};

} // namespace Controller
} // namespace SOBS

#endif // BILLPAYMENTCONTROLLER_H
