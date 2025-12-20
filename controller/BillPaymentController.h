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

namespace SOBS {
namespace Controller {

struct BillPaymentRequest {
    std::string accountNumber;
    std::string billType;
    std::string serviceProvider;
    std::string billAccountNumber;
    double amount;
    bool saveAsBiller;
    bool makeRecurring;
    std::string scheduledDate;
};

class BillPaymentController {
public:
    BillPaymentController();
    ~BillPaymentController();

    /**
     * GET /api/v1/bills/providers
     * Get bill providers by type
     */
    std::string getProviders(const std::string& billType);

    /**
     * GET /api/v1/bills/amount
     * Get bill amount from provider
     */
    std::string getBillAmount(const std::string& provider, 
                              const std::string& billAccountNumber);

    /**
     * POST /api/v1/bills/pay
     * Process bill payment
     */
    std::string payBill(const std::string& userId, 
                        const BillPaymentRequest& request);

    /**
     * GET /api/v1/bills/history
     * Get bill payment history
     */
    std::string getPaymentHistory(const std::string& userId);

    /**
     * GET /api/v1/bills/saved
     * Get saved billers
     */
    std::string getSavedBillers(const std::string& userId);

    /**
     * POST /api/v1/bills/schedule
     * Schedule a bill payment
     */
    std::string scheduleBillPayment(const std::string& userId,
                                     const BillPaymentRequest& request);
};

} // namespace Controller
} // namespace SOBS

#endif // BILLPAYMENTCONTROLLER_H
