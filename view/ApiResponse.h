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

using namespace std;

namespace SOBS {
namespace View {

template<typename T>
class ApiResponse {
private:
    bool success;
    string message;
    T data;
    string timestamp;
    string errorCode;

    string getCurrentTimestamp() const {
        time_t now = time(nullptr);
        char buffer[80];
        struct tm* timeinfo = localtime(&now);
        strftime(buffer, 80, "%Y-%m-%dT%H:%M:%S", timeinfo);
        return string(buffer);
    }

public:
    // Constructors
    ApiResponse() : success(false), message("") {
        timestamp = getCurrentTimestamp();
    }
    
    ApiResponse(bool success, const string& message)
        : success(success), message(message) {
        timestamp = getCurrentTimestamp();
    }
    
    ApiResponse(bool success, const string& message, const T& data)
        : success(success), message(message), data(data) {
        timestamp = getCurrentTimestamp();
    }

    // Static factory methods
    static ApiResponse<T> Success(const T& data, const string& message = "Operation successful") {
        return ApiResponse<T>(true, message, data);
    }
    
    static ApiResponse<T> Error(const string& message, const string& errorCode = "") {
        ApiResponse<T> response(false, message);
        response.setErrorCode(errorCode);
        return response;
    }

    // Getters
    bool isSuccess() const { return success; }
    string getMessage() const { return message; }
    T getData() const { return data; }
    string getTimestamp() const { return timestamp; }
    string getErrorCode() const { return errorCode; }

    // Setters
    void setSuccess(bool s) { success = s; }
    void setMessage(const string& msg) { message = msg; }
    void setData(const T& d) { data = d; }
    void setErrorCode(const string& code) { errorCode = code; }

    // JSON serialization (simplified)
    string toJson() const {
        stringstream ss;
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
    string sessionToken;
    string customerId;
    string fullName;
    string email;
    
    string toJson() const {
        stringstream ss;
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
    string accountNumber;
    double balance;
    double availableBalance;
    string currency;
    
    string toJson() const {
        stringstream ss;
        ss << fixed << setprecision(2);
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
    string transferRef;
    double amount;
    string recipientName;
    string status;
    string completedAt;
    
    string toJson() const {
        stringstream ss;
        ss << fixed << setprecision(2);
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
    string billRef;
    string billType;
    string provider;
    double amount;
    string status;
    
    string toJson() const {
        stringstream ss;
        ss << fixed << setprecision(2);
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
    static string buildSuccessResponse(const string& data, 
                                            const string& message = "Operation successful") {
        stringstream ss;
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
    
    static string buildErrorResponse(const string& message,
                                          const string& errorCode = "") {
        stringstream ss;
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
