/**
 * Smart Online Banking System (SOBS)
 * Utils: DatabaseConnection.cpp
 * 
 * BONUS: Singleton Design Pattern Implementation
 * 
 * This implementation demonstrates thread-safe Singleton pattern
 * with double-checked locking for database connection management.
 */

#include "DatabaseConnection.h"
#include <sstream>
#include <iostream>

namespace SOBS {
namespace Utils {

// Initialize static members
DatabaseConnection* DatabaseConnection::instance = nullptr;
std::mutex DatabaseConnection::mutex_;

// Private constructor
DatabaseConnection::DatabaseConnection()
    : connected(false), port(5432), maxConnections(10), activeConnections(0) {
    // Initialize connection parameters
}

// Private destructor
DatabaseConnection::~DatabaseConnection() {
    if (connected) {
        disconnect();
    }
}

/**
 * Thread-safe Singleton instance getter
 * Uses double-checked locking pattern for efficiency
 */
DatabaseConnection* DatabaseConnection::getInstance() {
    // First check (without lock) - fast path
    if (instance == nullptr) {
        // Lock before creating instance
        std::lock_guard<std::mutex> lock(mutex_);
        
        // Second check (with lock) - ensures only one instance
        if (instance == nullptr) {
            instance = new DatabaseConnection();
        }
    }
    return instance;
}

bool DatabaseConnection::connect(const std::string& host, int port,
                                  const std::string& database,
                                  const std::string& username,
                                  const std::string& password) {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (connected) {
        return true;  // Already connected
    }
    
    this->host = host;
    this->port = port;
    this->database = database;
    this->username = username;
    
    // Build connection string
    std::stringstream ss;
    ss << "postgresql://" << username << ":****@" 
       << host << ":" << port << "/" << database;
    connectionString = ss.str();
    
    // In real implementation, would establish actual database connection
    // using libpq or similar PostgreSQL client library
    
    // Simulate connection
    connected = true;
    activeConnections = 1;
    
    std::cout << "[DB] Connected to database: " << database 
              << " on " << host << ":" << port << std::endl;
    
    return true;
}

void DatabaseConnection::disconnect() {
    std::lock_guard<std::mutex> lock(mutex_);
    
    if (!connected) {
        return;
    }
    
    // In real implementation, would close database connection
    
    connected = false;
    activeConnections = 0;
    
    std::cout << "[DB] Disconnected from database" << std::endl;
}

bool DatabaseConnection::isConnected() const {
    return connected;
}

std::string DatabaseConnection::executeQuery(const std::string& query) {
    if (!connected) {
        return "{\"error\": \"Not connected to database\"}";
    }
    
    std::lock_guard<std::mutex> lock(mutex_);
    
    // In real implementation, would execute SQL query
    // For demo, return simulated result
    
    std::cout << "[DB] Executing query: " << query.substr(0, 50) << "..." << std::endl;
    
    return "{\"status\": \"success\", \"rows\": []}";
}

int DatabaseConnection::executeUpdate(const std::string& sql) {
    if (!connected) {
        return -1;
    }
    
    std::lock_guard<std::mutex> lock(mutex_);
    
    // In real implementation, would execute SQL update
    
    std::cout << "[DB] Executing update: " << sql.substr(0, 50) << "..." << std::endl;
    
    return 1;  // Number of affected rows
}

bool DatabaseConnection::beginTransaction() {
    if (!connected) {
        return false;
    }
    
    std::lock_guard<std::mutex> lock(mutex_);
    
    std::cout << "[DB] Transaction started" << std::endl;
    return true;
}

bool DatabaseConnection::commitTransaction() {
    if (!connected) {
        return false;
    }
    
    std::lock_guard<std::mutex> lock(mutex_);
    
    std::cout << "[DB] Transaction committed" << std::endl;
    return true;
}

bool DatabaseConnection::rollbackTransaction() {
    if (!connected) {
        return false;
    }
    
    std::lock_guard<std::mutex> lock(mutex_);
    
    std::cout << "[DB] Transaction rolled back" << std::endl;
    return true;
}

std::string DatabaseConnection::getConnectionInfo() const {
    std::stringstream ss;
    ss << "Database Connection Info:\n"
       << "  Host: " << host << "\n"
       << "  Port: " << port << "\n"
       << "  Database: " << database << "\n"
       << "  User: " << username << "\n"
       << "  Status: " << (connected ? "Connected" : "Disconnected") << "\n"
       << "  Active Connections: " << activeConnections << "/" << maxConnections;
    return ss.str();
}

int DatabaseConnection::getActiveConnections() const {
    return activeConnections;
}

bool DatabaseConnection::healthCheck() {
    if (!connected) {
        return false;
    }
    
    // In real implementation, would execute "SELECT 1"
    return true;
}

} // namespace Utils
} // namespace SOBS
