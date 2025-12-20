/**
 * Smart Online Banking System (SOBS)
 * Controller: AccountController.h
 * 
 * Handles account management operations
 * Part of the MVC Architecture - Controller Layer
 */

#ifndef ACCOUNTCONTROLLER_H
#define ACCOUNTCONTROLLER_H

#include <string>
#include <vector>
#include "../model/Account.h"
#include "../model/Transaction.h"
#include "../view/ApiResponse.h"

namespace SOBS {
namespace Controller {

// Filter structure for transactions
struct TransactionFilter {
    std::string startDate;
    std::string endDate;
    std::string transactionType;  // DEBIT, CREDIT, ALL
    double minAmount;
    double maxAmount;
    std::string category;
    std::string searchTerm;
};

class AccountController {
private:
    // Helper methods
    std::string getCurrentUserId();  // Extract from session/JWT

public:
    AccountController();
    ~AccountController();

    /**
     * GET /api/v1/accounts
     * Get all accounts for current user
     */
    std::string getAccounts(const std::string& userId);

    /**
     * GET /api/v1/accounts/{accountNumber}/balance
     * Get balance for specific account
     */
    std::string getBalance(const std::string& userId, const std::string& accountNumber);

    /**
     * GET /api/v1/accounts/{accountNumber}/transactions
     * Get transaction history with optional filters
     */
    std::string getTransactions(const std::string& userId, 
                                const std::string& accountNumber,
                                const TransactionFilter& filter);

    /**
     * GET /api/v1/accounts/{accountNumber}/statement
     * Download account statement
     */
    std::string getStatement(const std::string& userId,
                             const std::string& accountNumber,
                             const std::string& month,
                             const std::string& format);  // PDF or CSV

    /**
     * GET /api/v1/accounts/summary
     * Get account summary dashboard
     */
    std::string getAccountSummary(const std::string& userId);
};

} // namespace Controller
} // namespace SOBS

#endif // ACCOUNTCONTROLLER_H
