/**
 * Smart Online Banking System (SOBS)
 * main.cpp - MVC Architecture Demonstration
 * 
 * Egyptian Chinese University
 * Software Engineering - Phase 2
 * December 2025
 * 
 * This file demonstrates the MVC architecture with:
 * - Model Layer: User, Account, Transaction, Transfer, BillPayment
 * - View Layer: ApiResponse (JSON responses)
 * - Controller Layer: Authentication, Account, Transfer, BillPayment controllers
 * - BONUS: Singleton Pattern for Database Connection
 */

#include <iostream>
#include <string>

// Models
#include "model/User.h"
#include "model/Account.h"
#include "model/Transaction.h"
#include "model/Transfer.h"
#include "model/BillPayment.h"

// Views
#include "view/ApiResponse.h"

// Controllers
#include "controller/AuthenticationController.h"
#include "controller/AccountController.h"
#include "controller/TransferController.h"
#include "controller/BillPaymentController.h"

// Utils (Singleton Pattern - BONUS)
#include "utils/DatabaseConnection.h"

using namespace SOBS;

void printSeparator(const std::string& title) {
    std::cout << "\n" << std::string(60, '=') << std::endl;
    std::cout << "  " << title << std::endl;
    std::cout << std::string(60, '=') << std::endl;
}

void demonstrateModelLayer() {
    printSeparator("MODEL LAYER DEMONSTRATION");
    
    // User Model
    std::cout << "\n[User Model]" << std::endl;
    Model::User user("29901011234567", "Ahmed Mohamed", 
                     "ahmed@example.com", "+201001234567");
    std::cout << user.toString() << std::endl;
    std::cout << "National ID Valid: " << (Model::User::validateNationalId("29901011234567") ? "Yes" : "No") << std::endl;
    std::cout << "Email Valid: " << (Model::User::validateEmail("ahmed@example.com") ? "Yes" : "No") << std::endl;
    
    // Account Model
    std::cout << "\n[Account Model]" << std::endl;
    Model::Account account(1, Model::AccountType::SAVINGS);
    account.setBalance(50000.00);
    std::cout << account.toString() << std::endl;
    std::cout << "Can Transfer 10000 EGP: " << (account.canTransfer(10000) ? "Yes" : "No") << std::endl;
    
    // Transaction Model
    std::cout << "\n[Transaction Model]" << std::endl;
    Model::Transaction txn(1, Model::TransactionType::DEBIT, 1000.00, "ATM Withdrawal");
    txn.setBalanceAfter(49000.00);
    txn.setStatus(Model::TransactionStatus::COMPLETED);
    std::cout << txn.toString() << std::endl;
    
    // Transfer Model
    std::cout << "\n[Transfer Model]" << std::endl;
    Model::Transfer transfer(1, "98765432109876", 5000.00, "Payment for services");
    transfer.setRecipientName("Mohamed Ali");
    std::cout << transfer.toString() << std::endl;
    std::cout << "Requires OTP: " << (transfer.getRequiresOTP() ? "Yes" : "No") << std::endl;
    
    // Bill Payment Model
    std::cout << "\n[BillPayment Model]" << std::endl;
    Model::BillPayment bill(1, Model::BillType::ELECTRICITY, 
                           "Egyptian Electricity", "12345678", 523.50);
    std::cout << bill.toString() << std::endl;
}

void demonstrateViewLayer() {
    printSeparator("VIEW LAYER DEMONSTRATION");
    
    // Success Response
    std::cout << "\n[Success Response]" << std::endl;
    std::string successJson = View::JsonResponseBuilder::buildSuccessResponse(
        "{\"balance\": 50000.00, \"currency\": \"EGP\"}",
        "Balance retrieved successfully"
    );
    std::cout << successJson << std::endl;
    
    // Error Response
    std::cout << "\n[Error Response]" << std::endl;
    std::string errorJson = View::JsonResponseBuilder::buildErrorResponse(
        "Invalid account number",
        "ERR_INVALID_ACCOUNT"
    );
    std::cout << errorJson << std::endl;
    
    // Typed Response
    std::cout << "\n[Login Response Data]" << std::endl;
    View::LoginResponseData loginData;
    loginData.sessionToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
    loginData.customerId = "CUS123456789";
    loginData.fullName = "Ahmed Mohamed";
    loginData.email = "ahmed@example.com";
    std::cout << loginData.toJson() << std::endl;
}

void demonstrateControllerLayer() {
    printSeparator("CONTROLLER LAYER DEMONSTRATION");
    
    // Authentication Controller
    std::cout << "\n[Authentication Controller - Login]" << std::endl;
    Controller::AuthenticationController authController;
    Controller::LoginRequest loginReq;
    loginReq.email = "ahmed@example.com";
    loginReq.password = "SecurePass123!";
    std::string loginResponse = authController.login(loginReq);
    std::cout << loginResponse << std::endl;
    
    // Account Controller
    std::cout << "\n[Account Controller - Get Balance]" << std::endl;
    Controller::AccountController accountController;
    std::string balanceResponse = accountController.getBalance("USR001", "12345678901234");
    std::cout << balanceResponse << std::endl;
    
    // Transfer Controller
    std::cout << "\n[Transfer Controller - Initiate Transfer]" << std::endl;
    Controller::TransferController transferController;
    Controller::TransferRequest transferReq;
    transferReq.senderAccountNumber = "12345678901234";
    transferReq.recipientAccountNumber = "98765432109876";
    transferReq.amount = 10000.00;
    transferReq.description = "Payment for consulting services";
    std::string transferResponse = transferController.initiateTransfer("USR001", transferReq);
    std::cout << transferResponse << std::endl;
    
    // Bill Payment Controller
    std::cout << "\n[Bill Payment Controller - Get Providers]" << std::endl;
    Controller::BillPaymentController billController;
    std::string providersResponse = billController.getProviders("ELECTRICITY");
    std::cout << providersResponse << std::endl;
}

void demonstrateSingletonPattern() {
    printSeparator("BONUS: SINGLETON PATTERN DEMONSTRATION");
    
    std::cout << "\n[Database Connection Singleton]" << std::endl;
    
    // Get singleton instance
    Utils::DatabaseConnection* db1 = Utils::DatabaseConnection::getInstance();
    Utils::DatabaseConnection* db2 = Utils::DatabaseConnection::getInstance();
    
    // Verify both pointers point to same instance
    std::cout << "Instance 1 address: " << db1 << std::endl;
    std::cout << "Instance 2 address: " << db2 << std::endl;
    std::cout << "Same instance: " << (db1 == db2 ? "YES (Singleton works!)" : "NO") << std::endl;
    
    // Connect to database
    std::cout << "\n[Connecting to Database]" << std::endl;
    db1->connect("localhost", 5432, "sobs_db", "sobs_user", "secret");
    
    // Show connection info
    std::cout << "\n" << db1->getConnectionInfo() << std::endl;
    
    // Execute sample query
    std::cout << "\n[Executing Query]" << std::endl;
    db1->executeQuery("SELECT * FROM users WHERE user_id = 1");
    
    // Transaction demonstration
    std::cout << "\n[Transaction Management]" << std::endl;
    db1->beginTransaction();
    db1->executeUpdate("UPDATE accounts SET balance = balance - 1000 WHERE account_id = 1");
    db1->executeUpdate("UPDATE accounts SET balance = balance + 1000 WHERE account_id = 2");
    db1->commitTransaction();
    
    // Disconnect
    db1->disconnect();
}

void demonstrateMVCFlow() {
    printSeparator("COMPLETE MVC FLOW DEMONSTRATION");
    
    std::cout << "\nScenario: User wants to transfer money\n" << std::endl;
    
    std::cout << "Step 1: USER makes HTTP request to POST /api/v1/transfers" << std::endl;
    std::cout << "        Request body: {senderAccount, recipientAccount, amount}" << std::endl;
    
    std::cout << "\nStep 2: CONTROLLER receives and validates request" << std::endl;
    Controller::TransferController controller;
    Controller::TransferRequest request;
    request.senderAccountNumber = "12345678901234";
    request.recipientAccountNumber = "98765432109876";
    request.amount = 1000.00;
    request.description = "Payment";
    
    std::cout << "\nStep 3: CONTROLLER calls SERVICE layer (business logic)" << std::endl;
    std::cout << "        - Validates sender account exists" << std::endl;
    std::cout << "        - Checks sufficient balance" << std::endl;
    std::cout << "        - Verifies recipient account" << std::endl;
    std::cout << "        - Checks fraud detection" << std::endl;
    
    std::cout << "\nStep 4: SERVICE interacts with MODEL (database)" << std::endl;
    std::cout << "        - Query sender account" << std::endl;
    std::cout << "        - Create transfer record" << std::endl;
    
    std::cout << "\nStep 5: MODEL returns data to SERVICE" << std::endl;
    
    std::cout << "\nStep 6: CONTROLLER formats VIEW (JSON response)" << std::endl;
    std::string response = controller.initiateTransfer("USR001", request);
    
    std::cout << "\nStep 7: USER receives response:" << std::endl;
    std::cout << response << std::endl;
}

int main(int argc, char* argv[]) {
    // CLI Mode
    if (argc >= 2) {
        std::string command = argv[1];

        if (command == "login") {
            if (argc < 4) {
                std::cout << View::JsonResponseBuilder::buildErrorResponse("Usage: login <email> <password>", "ERR_ARGS") << std::endl;
                return 1;
            }
            Controller::AuthenticationController authController;
            Controller::LoginRequest loginReq;
            loginReq.email = argv[2];
            loginReq.password = argv[3];
            std::cout << authController.login(loginReq) << std::endl;
        } 
        else if (command == "balance") {
            if (argc < 4) {
                 std::cout << View::JsonResponseBuilder::buildErrorResponse("Usage: balance <user_id> <account_number>", "ERR_ARGS") << std::endl;
                 return 1;
            }
            Controller::AccountController accountController;
            std::cout << accountController.getBalance(argv[2], argv[3]) << std::endl;
        }
        else if (command == "transfer") {
            if (argc < 6) {
                 std::cout << View::JsonResponseBuilder::buildErrorResponse("Usage: transfer <sender> <recipient> <amount> <description>", "ERR_ARGS") << std::endl;
                 return 1;
            }
            Controller::TransferController transferController;
            Controller::TransferRequest transferReq;
            transferReq.senderAccountNumber = argv[2];
            transferReq.recipientAccountNumber = argv[3];
            try {
                transferReq.amount = std::stod(argv[4]);
            } catch (...) {
                 std::cout << View::JsonResponseBuilder::buildErrorResponse("Invalid amount format", "ERR_ARGS") << std::endl;
                 return 1;
            }
            transferReq.description = argv[5];
            // Using a placeholder CLI user ID
            std::cout << transferController.initiateTransfer("USR_CLI", transferReq) << std::endl;
        }
        else if (command == "providers") {
             if (argc < 3) {
                 std::cout << View::JsonResponseBuilder::buildErrorResponse("Usage: providers <type>", "ERR_ARGS") << std::endl;
                 return 1;
            }
            Controller::BillPaymentController billController;
            std::cout << billController.getProviders(argv[2]) << std::endl;
        }
        else {
            std::cout << View::JsonResponseBuilder::buildErrorResponse("Unknown command", "ERR_CMD") << std::endl;
        }

        return 0;
    }

    // Original Demo Mode (if no args)
    std::cout << "\n";
    std::cout << "╔══════════════════════════════════════════════════════════════╗" << std::endl;
    std::cout << "║     SMART ONLINE BANKING SYSTEM (SOBS) - MVC Architecture    ║" << std::endl;
    std::cout << "║                                                              ║" << std::endl;
    std::cout << "║     Egyptian Chinese University                              ║" << std::endl;
    std::cout << "║     Software Engineering - Phase 2                           ║" << std::endl;
    std::cout << "║     December 2025                                            ║" << std::endl;
    std::cout << "╚══════════════════════════════════════════════════════════════╝" << std::endl;
    
    // Demonstrate each layer
    demonstrateModelLayer();
    demonstrateViewLayer();
    demonstrateControllerLayer();
    demonstrateSingletonPattern();
    demonstrateMVCFlow();
    
    printSeparator("DEMONSTRATION COMPLETE");
    
    std::cout << "\nMVC Architecture Summary:" << std::endl;
    std::cout << "  - Model: Data entities and business logic (User, Account, etc.)" << std::endl;
    std::cout << "  - View: JSON response formatting (ApiResponse)" << std::endl;
    std::cout << "  - Controller: Request handling (Auth, Account, Transfer, Bill)" << std::endl;
    std::cout << "  - BONUS: Singleton Pattern (DatabaseConnection)" << std::endl;
    std::cout << std::endl;
    
    return 0;
}
