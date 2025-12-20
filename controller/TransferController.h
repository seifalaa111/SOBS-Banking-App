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

namespace SOBS {
namespace Controller {

struct TransferRequest {
    std::string senderAccountNumber;
    std::string recipientAccountNumber;
    std::string recipientBank;  // Empty for intra-bank
    double amount;
    std::string description;
    std::string scheduledDate;  // Empty for immediate
};

class TransferController {
private:
    std::string getCurrentUserId();

public:
    TransferController();
    ~TransferController();

    /**
     * POST /api/v1/transfers
     * Initiate a new transfer
     */
    std::string initiateTransfer(const std::string& userId, 
                                 const TransferRequest& request);

    /**
     * POST /api/v1/transfers/{transferId}/verify
     * Verify transfer with OTP
     */
    std::string verifyTransfer(const std::string& userId,
                               const std::string& transferId,
                               const std::string& otp);

    /**
     * GET /api/v1/transfers/{transferId}
     * Get transfer details
     */
    std::string getTransfer(const std::string& userId,
                           const std::string& transferId);

    /**
     * DELETE /api/v1/transfers/{transferId}
     * Cancel a pending transfer
     */
    std::string cancelTransfer(const std::string& userId,
                               const std::string& transferId);

    /**
     * GET /api/v1/beneficiaries
     * Get saved beneficiaries
     */
    std::string getBeneficiaries(const std::string& userId);

    /**
     * POST /api/v1/beneficiaries
     * Save a new beneficiary
     */
    std::string saveBeneficiary(const std::string& userId,
                                const std::string& accountNumber,
                                const std::string& name,
                                const std::string& bank);

    /**
     * DELETE /api/v1/beneficiaries/{beneficiaryId}
     * Delete a saved beneficiary
     */
    std::string deleteBeneficiary(const std::string& userId,
                                   const std::string& beneficiaryId);
};

} // namespace Controller
} // namespace SOBS

#endif // TRANSFERCONTROLLER_H
