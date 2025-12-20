# Smart Online Banking System (SOBS) - MVC Architecture

## Egyptian Chinese University
### Software Engineering - Phase 2
### December 2025

---

## Project Structure

```
cpp_mvc/
├── model/                      # MODEL LAYER - Data & Business Logic
│   ├── User.h/.cpp            # User entity
│   ├── Account.h/.cpp         # Account entity  
│   ├── Transaction.h/.cpp     # Transaction entity
│   ├── Transfer.h/.cpp        # Transfer entity
│   └── BillPayment.h/.cpp     # Bill payment entity
│
├── view/                       # VIEW LAYER - Response Formatting
│   └── ApiResponse.h          # JSON response builders
│
├── controller/                 # CONTROLLER LAYER - Request Handling
│   ├── AuthenticationController.h/.cpp   # /api/v1/auth/*
│   ├── AccountController.h/.cpp          # /api/v1/accounts/*
│   ├── TransferController.h/.cpp         # /api/v1/transfers/*
│   └── BillPaymentController.h/.cpp      # /api/v1/bills/*
│
├── utils/                      # UTILITIES
│   └── DatabaseConnection.h/.cpp  # BONUS: Singleton Pattern
│
├── main.cpp                    # Demo application
├── Makefile                    # Build configuration
└── README.md                   # This file
```

---

## MVC Architecture Overview

### What is MVC?

MVC (Model-View-Controller) is a design pattern that separates application into three components:

| Component | Responsibility | Examples |
|-----------|---------------|----------|
| **Model** | Data & business rules | User, Account, Transaction |
| **View** | Presentation (JSON responses) | ApiResponse, LoginResponseData |
| **Controller** | Request handling | AuthController, TransferController |

### Analogy
- **Model** = Kitchen (where data is prepared)
- **View** = Menu (what customer sees)
- **Controller** = Waiter (takes orders, brings food)

---

## Layer Details

### 1. Model Layer

The Model represents your data and business rules.

**Classes:**
- `User` - Customer information and authentication
- `Account` - Bank account with balance management
- `Transaction` - Financial transaction records
- `Transfer` - Fund transfer between accounts
- `BillPayment` - Utility bill payments

**Example:**
```cpp
Model::User user("29901011234567", "Ahmed Mohamed", 
                 "ahmed@example.com", "+201001234567");
user.validatePassword("SecurePass123!");
```

### 2. View Layer

The View handles response formatting (JSON for REST API).

**Classes:**
- `ApiResponse<T>` - Generic response wrapper
- `LoginResponseData` - Login response structure
- `BalanceResponseData` - Balance response structure
- `TransferResponseData` - Transfer response structure
- `JsonResponseBuilder` - Helper for building JSON

**Example Response:**
```json
{
  "success": true,
  "message": "Balance retrieved successfully",
  "data": {
    "accountNumber": "12345678901234",
    "balance": 50000.00,
    "availableBalance": 48000.00,
    "currency": "EGP"
  },
  "timestamp": "2025-12-17T10:30:00"
}
```

### 3. Controller Layer

Controllers handle HTTP requests and coordinate between Model and View.

**Controllers:**
- `AuthenticationController` - Login, register, OTP verification
- `AccountController` - Balance, transactions, statements
- `TransferController` - Fund transfers, beneficiaries
- `BillPaymentController` - Bill payments, providers

**API Endpoints:**
| Controller | Endpoints |
|------------|-----------|
| Auth | `/api/v1/auth/login`, `/api/v1/auth/register`, `/api/v1/auth/verify-otp` |
| Account | `/api/v1/accounts`, `/api/v1/accounts/{id}/balance`, `/api/v1/accounts/{id}/transactions` |
| Transfer | `/api/v1/transfers`, `/api/v1/transfers/{id}/verify`, `/api/v1/beneficiaries` |
| Bill | `/api/v1/bills/providers`, `/api/v1/bills/pay`, `/api/v1/bills/history` |

---

## BONUS: Singleton Design Pattern

The `DatabaseConnection` class implements the Singleton pattern to ensure only one database connection instance exists.

### Why Singleton for Database?
1. **Resource Management** - Single connection pool
2. **Thread Safety** - Synchronized access
3. **Consistency** - Same state across application
4. **Efficiency** - Avoid connection overhead

### Implementation:
```cpp
// Get singleton instance - same instance every time
Utils::DatabaseConnection* db = Utils::DatabaseConnection::getInstance();

// Connect once
db->connect("localhost", 5432, "sobs_db", "sobs_user", "secret");

// Use throughout application
db->executeQuery("SELECT * FROM users");
db->beginTransaction();
db->executeUpdate("UPDATE accounts SET balance = ...");
db->commitTransaction();
```

---

## Data Flow Example: Money Transfer

```
┌─────────────┐
│   USER      │
│ (Mobile/Web)│
└──────┬──────┘
       │ 1. POST /api/v1/transfers
       ▼
┌─────────────────────────┐
│  CONTROLLER LAYER       │
│  TransferController     │
│  - Validate request     │
│  - Extract user info    │
└───────────┬─────────────┘
            │ 2. Call service
            ▼
┌─────────────────────────┐
│  SERVICE LAYER          │
│  (Business Logic)       │
│  - Check balance        │
│  - Fraud detection      │
│  - Generate OTP         │
└───────────┬─────────────┘
            │ 3. Access database
            ▼
┌─────────────────────────┐
│  MODEL LAYER            │
│  Transfer, Account      │
│  - Create records       │
│  - Update balances      │
└───────────┬─────────────┘
            │ 4. Return data
            ▼
┌─────────────────────────┐
│  VIEW LAYER             │
│  ApiResponse (JSON)     │
│  {                      │
│    "success": true,     │
│    "data": {...}        │
│  }                      │
└───────────┬─────────────┘
            │ 5. HTTP Response
            ▼
┌─────────────┐
│   USER      │
│ Sees result │
└─────────────┘
```

---

## Building & Running

### Prerequisites
- g++ with C++17 support
- Make

### Build
```bash
cd cpp_mvc
make
```

### Run Demo
```bash
make run
```

### Clean
```bash
make clean
```

---

## Key Benefits of MVC

1. **Separation of Concerns** - Each layer has single responsibility
2. **Easy to Test** - Test each layer independently
3. **Multiple Views** - Same backend for web, mobile, API
4. **Team Collaboration** - Frontend/backend work separately
5. **Maintainable** - Easy to find bugs, add features

---

## Files Summary

| File | Lines | Description |
|------|-------|-------------|
| User.h/cpp | ~200 | User model with validation |
| Account.h/cpp | ~150 | Account with balance management |
| Transaction.h/cpp | ~180 | Transaction records |
| Transfer.h/cpp | ~200 | Fund transfer logic |
| BillPayment.h/cpp | ~150 | Bill payment model |
| ApiResponse.h | ~150 | JSON response structures |
| AuthenticationController.h/cpp | ~200 | Auth operations |
| AccountController.h/cpp | ~180 | Account operations |
| TransferController.h/cpp | ~200 | Transfer operations |
| BillPaymentController.h/cpp | ~180 | Bill operations |
| DatabaseConnection.h/cpp | ~150 | Singleton pattern |
| main.cpp | ~200 | Demo application |

**Total: ~2000+ lines of C++ code**

---

## Authors

Software Engineering Team
Egyptian Chinese University
December 2025
