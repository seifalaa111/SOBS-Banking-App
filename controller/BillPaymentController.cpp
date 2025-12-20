/**
 * Smart Online Banking System (SOBS)
 * Controller: BillPaymentController.cpp
 * 
 * Implementation of bill payment operations
 */

#include "BillPaymentController.h"
#include <sstream>
#include <iomanip>

namespace SOBS {
namespace Controller {

BillPaymentController::BillPaymentController() {}

BillPaymentController::~BillPaymentController() {}

std::string BillPaymentController::getProviders(const std::string& billType) {
    std::stringstream dataJson;
    
    if (billType == "ELECTRICITY") {
        dataJson << "[\n"
                 << "    {\"id\": \"EGELEC\", \"name\": \"Egyptian Electricity Holding Company\"},\n"
                 << "    {\"id\": \"CAIRO_ELEC\", \"name\": \"Cairo Electricity Distribution\"},\n"
                 << "    {\"id\": \"ALEX_ELEC\", \"name\": \"Alexandria Electricity Distribution\"}\n"
                 << "  ]";
    } else if (billType == "WATER") {
        dataJson << "[\n"
                 << "    {\"id\": \"CAIRO_WATER\", \"name\": \"Cairo Water Company\"},\n"
                 << "    {\"id\": \"ALEX_WATER\", \"name\": \"Alexandria Water Company\"}\n"
                 << "  ]";
    } else if (billType == "INTERNET") {
        dataJson << "[\n"
                 << "    {\"id\": \"WE\", \"name\": \"WE (Telecom Egypt)\"},\n"
                 << "    {\"id\": \"ORANGE\", \"name\": \"Orange Egypt\"},\n"
                 << "    {\"id\": \"VODAFONE\", \"name\": \"Vodafone Egypt\"},\n"
                 << "    {\"id\": \"ETISALAT\", \"name\": \"Etisalat Egypt\"}\n"
                 << "  ]";
    } else if (billType == "MOBILE") {
        dataJson << "[\n"
                 << "    {\"id\": \"VODAFONE\", \"name\": \"Vodafone Egypt\"},\n"
                 << "    {\"id\": \"ORANGE\", \"name\": \"Orange Egypt\"},\n"
                 << "    {\"id\": \"ETISALAT\", \"name\": \"Etisalat Egypt\"},\n"
                 << "    {\"id\": \"WE\", \"name\": \"WE Mobile\"}\n"
                 << "  ]";
    } else {
        dataJson << "[]";
    }
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Providers retrieved successfully"
    );
}

std::string BillPaymentController::getBillAmount(const std::string& provider,
                                                  const std::string& billAccountNumber) {
    if (billAccountNumber.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Bill account number is required",
            "ERR_MISSING_BILL_ACCOUNT"
        );
    }
    
    // In real implementation, would call provider API
    std::stringstream dataJson;
    dataJson << std::fixed << std::setprecision(2);
    dataJson << "{\n"
             << "    \"provider\": \"" << provider << "\",\n"
             << "    \"billAccountNumber\": \"" << billAccountNumber << "\",\n"
             << "    \"customerName\": \"Ahmed Mohamed\",\n"
             << "    \"amount\": 523.50,\n"
             << "    \"dueDate\": \"2025-12-25\",\n"
             << "    \"billPeriod\": \"November 2025\"\n"
             << "  }";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Bill amount retrieved successfully"
    );
}

std::string BillPaymentController::payBill(const std::string& userId,
                                           const BillPaymentRequest& request) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    if (request.billAccountNumber.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Bill account number is required",
            "ERR_MISSING_BILL_ACCOUNT"
        );
    }
    
    if (request.amount <= 0) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Invalid bill amount",
            "ERR_INVALID_AMOUNT"
        );
    }
    
    // In real implementation:
    // 1. Verify account has sufficient balance
    // 2. Deduct from account
    // 3. Send payment to provider API
    // 4. Create transaction record
    // 5. Save biller if requested
    
    View::BillPaymentResponseData responseData;
    responseData.billRef = Model::BillPayment::generateBillRef();
    responseData.billType = request.billType;
    responseData.provider = request.serviceProvider;
    responseData.amount = request.amount;
    responseData.status = "COMPLETED";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        responseData.toJson(),
        "Bill paid successfully"
    );
}

std::string BillPaymentController::getPaymentHistory(const std::string& userId) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    std::stringstream dataJson;
    dataJson << std::fixed << std::setprecision(2);
    dataJson << "[\n"
             << "    {\n"
             << "      \"billRef\": \"BILL1702800000123\",\n"
             << "      \"billType\": \"ELECTRICITY\",\n"
             << "      \"provider\": \"Egyptian Electricity\",\n"
             << "      \"amount\": 523.50,\n"
             << "      \"paymentDate\": \"2025-12-17T10:30:00\",\n"
             << "      \"status\": \"COMPLETED\"\n"
             << "    },\n"
             << "    {\n"
             << "      \"billRef\": \"BILL1702700000456\",\n"
             << "      \"billType\": \"INTERNET\",\n"
             << "      \"provider\": \"WE\",\n"
             << "      \"amount\": 299.00,\n"
             << "      \"paymentDate\": \"2025-12-16T14:20:00\",\n"
             << "      \"status\": \"COMPLETED\"\n"
             << "    }\n"
             << "  ]";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Payment history retrieved successfully"
    );
}

std::string BillPaymentController::getSavedBillers(const std::string& userId) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    std::stringstream dataJson;
    dataJson << "[\n"
             << "    {\n"
             << "      \"billerId\": \"BILLER001\",\n"
             << "      \"billType\": \"ELECTRICITY\",\n"
             << "      \"provider\": \"Egyptian Electricity\",\n"
             << "      \"accountNumber\": \"12345678\",\n"
             << "      \"nickname\": \"Home Electricity\"\n"
             << "    },\n"
             << "    {\n"
             << "      \"billerId\": \"BILLER002\",\n"
             << "      \"billType\": \"INTERNET\",\n"
             << "      \"provider\": \"WE\",\n"
             << "      \"accountNumber\": \"01001234567\",\n"
             << "      \"nickname\": \"Home Internet\"\n"
             << "    }\n"
             << "  ]";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Saved billers retrieved successfully"
    );
}

std::string BillPaymentController::scheduleBillPayment(const std::string& userId,
                                                        const BillPaymentRequest& request) {
    if (userId.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "User not authenticated",
            "ERR_UNAUTHORIZED"
        );
    }
    
    if (request.scheduledDate.empty()) {
        return View::JsonResponseBuilder::buildErrorResponse(
            "Scheduled date is required",
            "ERR_MISSING_DATE"
        );
    }
    
    std::stringstream dataJson;
    dataJson << std::fixed << std::setprecision(2);
    dataJson << "{\n"
             << "    \"scheduleId\": \"SCHED001\",\n"
             << "    \"billType\": \"" << request.billType << "\",\n"
             << "    \"provider\": \"" << request.serviceProvider << "\",\n"
             << "    \"amount\": " << request.amount << ",\n"
             << "    \"scheduledDate\": \"" << request.scheduledDate << "\",\n"
             << "    \"recurring\": " << (request.makeRecurring ? "true" : "false") << ",\n"
             << "    \"status\": \"SCHEDULED\"\n"
             << "  }";
    
    return View::JsonResponseBuilder::buildSuccessResponse(
        dataJson.str(),
        "Bill payment scheduled successfully"
    );
}

} // namespace Controller
} // namespace SOBS
