/**
 * Smart Online Banking System (SOBS)
 * Controller: TransferController.h
 * 
 * Handles fund transfer operations
 * Part of the MVC Architecture - Controller Layer
 */

#ifndef TRANSFERCONTROLLER_H
#define TRANSFERCONTROLLER_H

#include <string>
#include "../model/Transfer.h"
#include "../view/ApiResponse.h"

using namespace std;

namespace SOBS {
namespace Controller {

struct TransferRequest {
    string senderAccountNumber;
    string recipientAccountNumber;
    string recipientBank;  // Empty for intra-bank
    double amount;
    string description;
    string scheduledDate;  // Empty for immediate
};

class TransferController {
private:
    string getCurrentUserId();

public:
    TransferController();
    ~TransferController();

    /**
     * POST /api/v1/transfers
     * Initiate a new transfer
     */
    string initiateTransfer(const string& userId, 
                                 const TransferRequest& request);

    /**
     * POST /api/v1/transfers/{transferId}/verify
     * Verify transfer with OTP
     */
    string verifyTransfer(const string& userId,
                               const string& transferId,
                               const string& otp);

    /**
     * GET /api/v1/transfers/{transferId}
     * Get transfer details
     */
    string getTransfer(const string& userId,
                           const string& transferId);

    /**
     * DELETE /api/v1/transfers/{transferId}
     * Cancel a pending transfer
     */
    string cancelTransfer(const string& userId,
                               const string& transferId);

    /**
     * GET /api/v1/beneficiaries
     * Get saved beneficiaries
     */
    string getBeneficiaries(const string& userId);

    /**
     * POST /api/v1/beneficiaries
     * Save a new beneficiary
     */
    string saveBeneficiary(const string& userId,
                                const string& accountNumber,
                                const string& name,
                                const string& bank);

    /**
     * DELETE /api/v1/beneficiaries/{beneficiaryId}
     * Delete a saved beneficiary
     */
    string deleteBeneficiary(const string& userId,
                                   const string& beneficiaryId);
};

} // namespace Controller
} // namespace SOBS

#endif // TRANSFERCONTROLLER_H
