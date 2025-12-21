/**
 * Smart Online Banking System (SOBS)
 * Controller: TransferController.cpp
 * 
 * Implementation of fund transfer operations
 */

#include "TransferController.h"
#include "../model/Account.h"
#include <sstream>
#include <iomanip>

using namespace std;

namespace SOBS {
namespace Controller {

TransferController::TransferController() {}

TransferController::~TransferController() {}

string TransferController::getCurrentUserId() {
    return "USR001";
}

string TransferController::initiateTransfer(const string& userId,
                                                  const TransferRequest& request) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    // Validate sender account
    if (!Model::Account::validateAccountNumber(request.senderAccountNumber)) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid sender account number",
            "ERR_INVALID_SENDER_ACCOUNT"
        );
    }
    
    // Validate recipient account
    if (!Model::Account::validateAccountNumber(request.recipientAccountNumber)) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid recipient account number",
            "ERR_INVALID_RECIPIENT_ACCOUNT"
        );
    }
    
    // Validate amount
    if (!Model::Transfer::validateAmount(request.amount)) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid transfer amount. Must be between 1 and 200,000 EGP",
            "ERR_INVALID_AMOUNT"
        );
    }
    
    // Create transfer
    Model::Transfer transfer(1, request.recipientAccountNumber, 
                            request.amount, request.description);
    transfer.setSenderAccountNumber(request.senderAccountNumber);
    
    if (!request.recipientBank.empty()) {
        transfer.setRecipientBank(request.recipientBank);
    }
    
    // In real implementation, would:
    // 1. Verify sender account belongs to user
    // 2. Check sufficient balance
    // 3. Check daily transfer limit
    // 4. Validate recipient with bank API
    // 5. Save transfer to database
    // 6. Generate OTP if required
    
    transfer.initiateTransfer();
    
    bool requiresOTP = (request.amount > 5000.0);
    
    stringstream dataJson;
    dataJson << fixed << setprecision(2);
    dataJson << "{\n"
             << "    \"transferId\": \"" << transfer.getTransferRef() << "\",\n"
             << "    \"status\": \"" << (requiresOTP ? "PENDING_OTP" : "PENDING") << "\",\n"
             << "    \"requiresOTP\": " << (requiresOTP ? "true" : "false") << ",\n"
             << "    \"amount\": " << request.amount << ",\n"
             << "    \"recipientAccount\": \"" << request.recipientAccountNumber << "\",\n"
             << "    \"recipientName\": \"Mohamed Ali\"\n"  // From validation
             << "  }";
    
    string message = requiresOTP ? 
        "Transfer initiated. OTP sent to your registered mobile" :
        "Transfer initiated successfully";
    
    return View::JsonResponseBuilder::buildSuccessResponse(dataJson.str(), message);
}

string TransferController::verifyTransfer(const string& userId,
                                               const string& transferId,
                                               const string& otp) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    if (otp.length() != 6) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid OTP format",
            "ERR_INVALID_OTP"
        );
    }
    
    // In real implementation, would:
    // 1. Find transfer by ID
    // 2. Verify OTP
    // 3. Process transfer (debit sender, credit recipient)
    // 4. Create transaction records
    // 5. Send notifications
    
    View::TransferResponseData responseData;
    responseData.transferRef = transferId;
    responseData.amount = 10000.00;
    responseData.recipientName = "Mohamed Ali";
    responseData.status = "COMPLETED";
    
    time_t now = time(nullptr);
    char buffer[80];
    struct tm* timeinfo = localtime(&now);
    strftime(buffer, 80, "%Y-%m-%dT%H:%M:%S", timeinfo);
    responseData.completedAt = buffer;
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        responseData.toJson(),
        "Transfer completed successfully"
    );
}

string TransferController::getTransfer(const string& userId,
                                            const string& transferId) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    stringstream dataJson;
    dataJson << fixed << setprecision(2);
    dataJson << "{\n"
             << "    \"transferId\": \"" << transferId << "\",\n"
             << "    \"senderAccount\": \"12345678901234\",\n"
             << "    \"recipientAccount\": \"98765432109876\",\n"
             << "    \"recipientName\": \"Mohamed Ali\",\n"
             << "    \"amount\": 10000.00,\n"
             << "    \"description\": \"Payment for services\",\n"
             << "    \"transferType\": \"INTRA-BANK\",\n"
             << "    \"status\": \"COMPLETED\",\n"
             << "    \"initiatedAt\": \"2025-12-17T10:30:00\",\n"
             << "    \"completedAt\": \"2025-12-17T10:30:45\"\n"
             << "  }";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Transfer details retrieved"
    );
}

string TransferController::cancelTransfer(const string& userId,
                                                const string& transferId) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    // In real implementation, would:
    // 1. Find transfer
    // 2. Check if cancellable (only PENDING status)
    // 3. Update status to CANCELLED
    
    stringstream dataJson;
    dataJson << "{\n"
             << "    \"transferId\": \"" << transferId << "\",\n"
             << "    \"status\": \"CANCELLED\"\n"
             << "  }";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Transfer cancelled successfully"
    );
}

string TransferController::getBeneficiaries(const string& userId) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    stringstream dataJson;
    dataJson << "[\n"
             << "    {\n"
             << "      \"beneficiaryId\": \"BEN001\",\n"
             << "      \"accountNumber\": \"98765432109876\",\n"
             << "      \"name\": \"Mohamed Ali\",\n"
             << "      \"bank\": \"\",\n"
             << "      \"type\": \"INTRA-BANK\"\n"
             << "    },\n"
             << "    {\n"
             << "      \"beneficiaryId\": \"BEN002\",\n"
             << "      \"accountNumber\": \"11122233344455\",\n"
             << "      \"name\": \"Ahmed Hassan\",\n"
             << "      \"bank\": \"National Bank of Egypt\",\n"
             << "      \"type\": \"INTER-BANK\"\n"
             << "    }\n"
             << "  ]";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Beneficiaries retrieved successfully"
    );
}

string TransferController::saveBeneficiary(const string& userId,
                                                 const string& accountNumber,
                                                 const string& name,
                                                 const string& bank) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    if (!Model::Account::validateAccountNumber(accountNumber)) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid account number",
            "ERR_INVALID_ACCOUNT"
        );
    }
    
    stringstream dataJson;
    dataJson << "{\n"
             << "    \"beneficiaryId\": \"BEN003\",\n"
             << "    \"accountNumber\": \"" << accountNumber << "\",\n"
             << "    \"name\": \"" << name << "\",\n"
             << "    \"bank\": \"" << bank << "\"\n"
             << "  }";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Beneficiary saved successfully"
    );
}

string TransferController::deleteBeneficiary(const string& userId,
                                                   const string& beneficiaryId) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        "null",
        "Beneficiary deleted successfully"
    );
}

} // namespace Controller
} // namespace SOBS
