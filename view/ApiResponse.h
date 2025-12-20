/**
 * Smart Online Banking System (SOBS)
 * View: ApiResponse.h
 * 
 * Represents the JSON response structure for REST API
 * Part of the MVC Architecture - View Layer
 */

#ifndef APIRESPONSE_H
#define APIRESPONSE_H

#include <string>
#include <ctime>
#include <sstream>
#include <iomanip>

namespace SOBS {
namespace View {

template<typename T>
class ApiResponse {
private:
    bool success;
    std::string message;
    T data;
    std::string timestamp;
    std::string errorCode;

    std::string getCurrentTimestamp() const {
        time_t now = time(nullptr);
        char buffer[80];
        struct tm* timeinfo = localtime(&now);
        strftime(buffer, 80, "%Y-%m-%dT%H:%M:%S", timeinfo);
        return std::string(buffer);
    }

public:
    // Constructors
    ApiResponse() : success(false), message("") {
        timestamp = getCurrentTimestamp();
    }
    
    ApiResponse(bool success, const std::string& message)
        : success(success), message(message) {
        timestamp = getCurrentTimestamp();
    }
    
    ApiResponse(bool success, const std::string& message, const T& data)
        : success(success), message(message), data(data) {
        timestamp = getCurrentTimestamp();
    }

    // Static factory methods
    static ApiResponse<T> Success(const T& data, const std::string& message = "Operation successful") {
        return ApiResponse<T>(true, message, data);
    }
    
    static ApiResponse<T> Error(const std::string& message, const std::string& errorCode = "") {
        ApiResponse<T> response(false, message);
        response.setErrorCode(errorCode);
        return response;
    }

    // Getters
    bool isSuccess() const { return success; }
    std::string getMessage() const { return message; }
    T getData() const { return data; }
    std::string getTimestamp() const { return timestamp; }
    std::string getErrorCode() const { return errorCode; }

    // Setters
    void setSuccess(bool s) { success = s; }
    void setMessage(const std::string& msg) { message = msg; }
    void setData(const T& d) { data = d; }
    void setErrorCode(const std::string& code) { errorCode = code; }

    // JSON serialization (simplified)
    std::string toJson() const {
        std::stringstream ss;
        ss << "{\n"
           << "  \"success\": " << (success ? "true" : "false") << ",\n"
           << "  \"message\": \"" << message << "\",\n"
           << "  \"timestamp\": \"" << timestamp << "\"";
        
        if (!errorCode.empty()) {
            ss << ",\n  \"errorCode\": \"" << errorCode << "\"";
        }
        
        ss << "\n}";
        return ss.str();
    }
};

// Specialized response types for common use cases

struct LoginResponseData {
    std::string sessionToken;
    std::string customerId;
    std::string fullName;
    std::string email;
    
    std::string toJson() const {
        std::stringstream ss;
        ss << "{\n"
           << "    \"sessionToken\": \"" << sessionToken << "\",\n"
           << "    \"customerId\": \"" << customerId << "\",\n"
           << "    \"fullName\": \"" << fullName << "\",\n"
           << "    \"email\": \"" << email << "\"\n"
           << "  }";
        return ss.str();
    }
};

struct BalanceResponseData {
    std::string accountNumber;
    double balance;
    double availableBalance;
    std::string currency;
    
    std::string toJson() const {
        std::stringstream ss;
        ss << std::fixed << std::setprecision(2);
        ss << "{\n"
           << "    \"accountNumber\": \"" << accountNumber << "\",\n"
           << "    \"balance\": " << balance << ",\n"
           << "    \"availableBalance\": " << availableBalance << ",\n"
           << "    \"currency\": \"" << currency << "\"\n"
           << "  }";
        return ss.str();
    }
};

struct TransferResponseData {
    std::string transferRef;
    double amount;
    std::string recipientName;
    std::string status;
    std::string completedAt;
    
    std::string toJson() const {
        std::stringstream ss;
        ss << std::fixed << std::setprecision(2);
        ss << "{\n"
           << "    \"transferRef\": \"" << transferRef << "\",\n"
           << "    \"amount\": " << amount << ",\n"
           << "    \"recipientName\": \"" << recipientName << "\",\n"
           << "    \"status\": \"" << status << "\",\n"
           << "    \"completedAt\": \"" << completedAt << "\"\n"
           << "  }";
        return ss.str();
    }
};

struct BillPaymentResponseData {
    std::string billRef;
    std::string billType;
    std::string provider;
    double amount;
    std::string status;
    
    std::string toJson() const {
        std::stringstream ss;
        ss << std::fixed << std::setprecision(2);
        ss << "{\n"
           << "    \"billRef\": \"" << billRef << "\",\n"
           << "    \"billType\": \"" << billType << "\",\n"
           << "    \"provider\": \"" << provider << "\",\n"
           << "    \"amount\": " << amount << ",\n"
           << "    \"status\": \"" << status << "\"\n"
           << "  }";
        return ss.str();
    }
};

// Helper class for formatted JSON responses
class JsonResponseBuilder {
public:
    static std::string buildSuccessResponse(const std::string& data, 
                                            const std::string& message = "Operation successful") {
        std::stringstream ss;
        time_t now = time(nullptr);
        char buffer[80];
        struct tm* timeinfo = localtime(&now);
        strftime(buffer, 80, "%Y-%m-%dT%H:%M:%S", timeinfo);
        
        ss << "{\n"
           << "  \"success\": true,\n"
           << "  \"message\": \"" << message << "\",\n"
           << "  \"data\": " << data << ",\n"
           << "  \"timestamp\": \"" << buffer << "\"\n"
           << "}";
        return ss.str();
    }
    
    static std::string buildErrorResponse(const std::string& message,
                                          const std::string& errorCode = "") {
        std::stringstream ss;
        time_t now = time(nullptr);
        char buffer[80];
        struct tm* timeinfo = localtime(&now);
        strftime(buffer, 80, "%Y-%m-%dT%H:%M:%S", timeinfo);
        
        ss << "{\n"
           << "  \"success\": false,\n"
           << "  \"message\": \"" << message << "\"";
        
        if (!errorCode.empty()) {
            ss << ",\n  \"errorCode\": \"" << errorCode << "\"";
        }
        
        ss << ",\n  \"timestamp\": \"" << buffer << "\"\n"
           << "}";
        return ss.str();
    }
};

} // namespace View
} // namespace SOBS

#endif // APIRESPONSE_H
