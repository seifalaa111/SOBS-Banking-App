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

using namespace std;
using namespace SOBS;

void printSeparator(const string& title) {
    cout << "\n" << string(60, '=') << endl;
    cout << "  " << title << endl;
    cout << string(60, '=') << endl;
}

void demonstrateModelLayer() {
    printSeparator("MODEL LAYER DEMONSTRATION");
    
    // User Model
    cout << "\n[User Model]" << endl;
    Model::User user("29901011234567", "Ahmed Mohamed", 
                     "ahmed@example.com", "+201001234567");
    cout << user.toString() << endl;
    cout << "National ID Valid: " << (Model::User::validateNationalId("29901011234567") ? "Yes" : "No") << endl;
    cout << "Email Valid: " << (Model::User::validateEmail("ahmed@example.com") ? "Yes" : "No") << endl;
    
    // Account Model
    cout << "\n[Account Model]" << endl;
    Model::Account account(1, Model::AccountType::SAVINGS);
    account.setBalance(50000.00);
    cout << account.toString() << endl;
    cout << "Can Transfer 10000 EGP: " << (account.canTransfer(10000) ? "Yes" : "No") << endl;
    
    // Transaction Model
    cout << "\n[Transaction Model]" << endl;
    Model::Transaction txn(1, Model::TransactionType::DEBIT, 1000.00, "ATM Withdrawal");
    txn.setBalanceAfter(49000.00);
    txn.setStatus(Model::TransactionStatus::COMPLETED);
    cout << txn.toString() << endl;
    
    // Transfer Model
    cout << "\n[Transfer Model]" << endl;
    Model::Transfer transfer(1, "98765432109876", 5000.00, "Payment for services");
    transfer.setRecipientName("Mohamed Ali");
    cout << transfer.toString() << endl;
    cout << "Requires OTP: " << (transfer.getRequiresOTP() ? "Yes" : "No") << endl;
    
    // Bill Payment Model
    cout << "\n[BillPayment Model]" << endl;
    Model::BillPayment bill(1, Model::BillType::ELECTRICITY, 
                           "Egyptian Electricity", "12345678", 523.50);
    cout << bill.toString() << endl;
}

void demonstrateViewLayer() {
    printSeparator("VIEW LAYER DEMONSTRATION");
    
    // Success Response
    cout << "\n[Success Response]" << endl;
    string successJson = View::JsonResponseBuilder::buildSuccessResponse(
        "{\"balance\": 50000.00, \"currency\": \"EGP\"}",
        "Balance retrieved successfully"
    );
    cout << successJson << endl;
    
    // Error Response
    cout << "\n[Error Response]" << endl;
    string errorJson = View::JsonResponseBuilder::buildErrorResponse(
        "Invalid account number",
        "ERR_INVALID_ACCOUNT"
    );
    cout << errorJson << endl;
    
    // Typed Response
    cout << "\n[Login Response Data]" << endl;
    View::LoginResponseData loginData;
    loginData.sessionToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
    loginData.customerId = "CUS123456789";
    loginData.fullName = "Ahmed Mohamed";
    loginData.email = "ahmed@example.com";
    cout << loginData.toJson() << endl;
}

void demonstrateControllerLayer() {
    printSeparator("CONTROLLER LAYER DEMONSTRATION");
    
    // Authentication Controller
    cout << "\n[Authentication Controller - Login]" << endl;
    Controller::AuthenticationController authController;
    Controller::LoginRequest loginReq;
    loginReq.email = "ahmed@example.com";
    loginReq.password = "SecurePass123!";
    string loginResponse = authController.login(loginReq);
    cout << loginResponse << endl;
    
    // Account Controller
    cout << "\n[Account Controller - Get Balance]" << endl;
    Controller::AccountController accountController;
    string balanceResponse = accountController.getBalance("USR001", "12345678901234");
    cout << balanceResponse << endl;
    
    // Transfer Controller
    cout << "\n[Transfer Controller - Initiate Transfer]" << endl;
    Controller::TransferController transferController;
    Controller::TransferRequest transferReq;
    transferReq.senderAccountNumber = "12345678901234";
    transferReq.recipientAccountNumber = "98765432109876";
    transferReq.amount = 10000.00;
    transferReq.description = "Payment for consulting services";
    string transferResponse = transferController.initiateTransfer("USR001", transferReq);
    cout << transferResponse << endl;
    
    // Bill Payment Controller
    cout << "\n[Bill Payment Controller - Get Providers]" << endl;
    Controller::BillPaymentController billController;
    string providersResponse = billController.getProviders("ELECTRICITY");
    cout << providersResponse << endl;
}

void demonstrateSingletonPattern() {
    printSeparator("BONUS: SINGLETON PATTERN DEMONSTRATION");
    
    cout << "\n[Database Connection Singleton]" << endl;
    
    // Get singleton instance
    Utils::DatabaseConnection* db1 = Utils::DatabaseConnection::getInstance();
    Utils::DatabaseConnection* db2 = Utils::DatabaseConnection::getInstance();
    
    // Verify both pointers point to same instance
    cout << "Instance 1 address: " << db1 << endl;
    cout << "Instance 2 address: " << db2 << endl;
    cout << "Same instance: " << (db1 == db2 ? "YES (Singleton works!)" : "NO") << endl;
    
    // Connect to database
    cout << "\n[Connecting to Database]" << endl;
    db1->connect("localhost", 5432, "sobs_db", "sobs_user", "secret");
    
    // Show connection info
    cout << "\n" << db1->getConnectionInfo() << endl;
    
    // Execute sample query
    cout << "\n[Executing Query]" << endl;
    db1->executeQuery("SELECT * FROM users WHERE user_id = 1");
    
    // Transaction demonstration
    cout << "\n[Transaction Management]" << endl;
    db1->beginTransaction();
    db1->executeUpdate("UPDATE accounts SET balance = balance - 1000 WHERE account_id = 1");
    db1->executeUpdate("UPDATE accounts SET balance = balance + 1000 WHERE account_id = 2");
    db1->commitTransaction();
    
    // Disconnect
    db1->disconnect();
}

void demonstrateMVCFlow() {
    printSeparator("COMPLETE MVC FLOW DEMONSTRATION");
    
    cout << "\nScenario: User wants to transfer money\n" << endl;
    
    cout << "Step 1: USER makes HTTP request to POST /api/v1/transfers" << endl;
    cout << "        Request body: {senderAccount, recipientAccount, amount}" << endl;
    
    cout << "\nStep 2: CONTROLLER receives and validates request" << endl;
    Controller::TransferController controller;
    Controller::TransferRequest request;
    request.senderAccountNumber = "12345678901234";
    request.recipientAccountNumber = "98765432109876";
    request.amount = 1000.00;
    request.description = "Payment";
    
    cout << "\nStep 3: CONTROLLER calls SERVICE layer (business logic)" << endl;
    cout << "        - Validates sender account exists" << endl;
    cout << "        - Checks sufficient balance" << endl;
    cout << "        - Verifies recipient account" << endl;
    cout << "        - Checks fraud detection" << endl;
    
    cout << "\nStep 4: SERVICE interacts with MODEL (database)" << endl;
    cout << "        - Query sender account" << endl;
    cout << "        - Create transfer record" << endl;
    
    cout << "\nStep 5: MODEL returns data to SERVICE" << endl;
    
    cout << "\nStep 6: CONTROLLER formats VIEW (JSON response)" << endl;
    string response = controller.initiateTransfer("USR001", request);
    
    cout << "\nStep 7: USER receives response:" << endl;
    cout << response << endl;
}

int main(int argc, char* argv[]) {
    // CLI Mode
    if (argc >= 2) {
        string command = argv[1];

        if (command == "login") {
            if (argc < 4) {
                cout << View::JsonResponseBuilder::buildErrorResponse("Usage: login <email> <password>", "ERR_ARGS") << endl;
                return 1;
            }
            Controller::AuthenticationController authController;
            Controller::LoginRequest loginReq;
            loginReq.email = argv[2];
            loginReq.password = argv[3];
            cout << authController.login(loginReq) << endl;
        } 
        else if (command == "balance") {
            if (argc < 4) {
                 cout << View::JsonResponseBuilder::buildErrorResponse("Usage: balance <user_id> <account_number>", "ERR_ARGS") << endl;
                 return 1;
            }
            Controller::AccountController accountController;
            cout << accountController.getBalance(argv[2], argv[3]) << endl;
        }
        else if (command == "transfer") {
            if (argc < 6) {
                 cout << View::JsonResponseBuilder::buildErrorResponse("Usage: transfer <sender> <recipient> <amount> <description>", "ERR_ARGS") << endl;
                 return 1;
            }
            Controller::TransferController transferController;
            Controller::TransferRequest transferReq;
            transferReq.senderAccountNumber = argv[2];
            transferReq.recipientAccountNumber = argv[3];
            try {
                transferReq.amount = stod(argv[4]);
            } catch (...) {
                 cout << View::JsonResponseBuilder::buildErrorResponse("Invalid amount format", "ERR_ARGS") << endl;
                 return 1;
            }
            transferReq.description = argv[5];
            // Using a placeholder CLI user ID
            cout << transferController.initiateTransfer("USR_CLI", transferReq) << endl;
        }
        else if (command == "providers") {
             if (argc < 3) {
                 cout << View::JsonResponseBuilder::buildErrorResponse("Usage: providers <type>", "ERR_ARGS") << endl;
                 return 1;
            }
            Controller::BillPaymentController billController;
            cout << billController.getProviders(argv[2]) << endl;
        }
        else {
            cout << View::JsonResponseBuilder::buildErrorResponse("Unknown command", "ERR_CMD") << endl;
        }

        return 0;
    }

    // Original Demo Mode (if no args)
    cout << "\n";
    cout << "╔══════════════════════════════════════════════════════════════╗" << endl;
    cout << "║     SMART ONLINE BANKING SYSTEM (SOBS) - MVC Architecture    ║" << endl;
    cout << "║                                                              ║" << endl;
    cout << "║     Egyptian Chinese University                              ║" << endl;
    cout << "║     Software Engineering - Phase 2                           ║" << endl;
    cout << "║     December 2025                                            ║" << endl;
    cout << "╚══════════════════════════════════════════════════════════════╝" << endl;
    
    // Demonstrate each layer
    demonstrateModelLayer();
    demonstrateViewLayer();
    demonstrateControllerLayer();
    demonstrateSingletonPattern();
    demonstrateMVCFlow();
    
    printSeparator("DEMONSTRATION COMPLETE");
    
    cout << "\nMVC Architecture Summary:" << endl;
    cout << "  - Model: Data entities and business logic (User, Account, etc.)" << endl;
    cout << "  - View: JSON response formatting (ApiResponse)" << endl;
    cout << "  - Controller: Request handling (Auth, Account, Transfer, Bill)" << endl;
    cout << "  - BONUS: Singleton Pattern (DatabaseConnection)" << endl;
    cout << endl;
    
    return 0;
}
