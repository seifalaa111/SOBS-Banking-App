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

using namespace std;

namespace SOBS {
namespace Controller {

// Filter structure for transactions
struct TransactionFilter {
    string startDate;
    string endDate;
    string transactionType;  // DEBIT, CREDIT, ALL
    double minAmount;
    double maxAmount;
    string category;
    string searchTerm;
};

class AccountController {
private:
    // Helper methods
    string getCurrentUserId();  // Extract from session/JWT

public:
    AccountController();
    ~AccountController();

    /**
     * GET /api/v1/accounts
     * Get all accounts for current user
     */
    string getAccounts(const string& userId);

    /**
     * GET /api/v1/accounts/{accountNumber}/balance
     * Get balance for specific account
     */
    string getBalance(const string& userId, const string& accountNumber);

    /**
     * GET /api/v1/accounts/{accountNumber}/transactions
     * Get transaction history with optional filters
     */
    string getTransactions(const string& userId, 
                                const string& accountNumber,
                                const TransactionFilter& filter);

    /**
     * GET /api/v1/accounts/{accountNumber}/statement
     * Download account statement
     */
    string getStatement(const string& userId,
                             const string& accountNumber,
                             const string& month,
                             const string& format);  // PDF or CSV

    /**
     * GET /api/v1/accounts/summary
     * Get account summary dashboard
     */
    string getAccountSummary(const string& userId);
};

} // namespace Controller
} // namespace SOBS

#endif // ACCOUNTCONTROLLER_H
