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

using namespace std;

namespace SOBS {
namespace Utils {

// Initialize static members
DatabaseConnection* DatabaseConnection::instance = nullptr;
mutex DatabaseConnection::mutex_;

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
        lock_guard<mutex> lock(mutex_);
        
        // Second check (with lock) - ensures only one instance
        if (instance == nullptr) {
            instance = new DatabaseConnection();
        }
    }
    return instance;
}

bool DatabaseConnection::connect(const string& host, int port,
                                  const string& database,
                                  const string& username,
                                  const string& password) {
    lock_guard<mutex> lock(mutex_);
    
    if (connected) {
        return true;  // Already connected
    }
    
    this->host = host;
    this->port = port;
    this->database = database;
    this->username = username;
    
    // Build connection string
    stringstream ss;
    ss << "postgresql://" << username << ":****@" 
       << host << ":" << port << "/" << database;
    connectionString = ss.str();
    
    // In real implementation, would establish actual database connection
    // using libpq or similar PostgreSQL client library
    
    // Simulate connection
    connected = true;
    activeConnections = 1;
    
    cout << "[DB] Connected to database: " << database 
              << " on " << host << ":" << port << endl;
    
    return true;
}

void DatabaseConnection::disconnect() {
    lock_guard<mutex> lock(mutex_);
    
    if (!connected) {
        return;
    }
    
    // In real implementation, would close database connection
    
    connected = false;
    activeConnections = 0;
    
    cout << "[DB] Disconnected from database" << endl;
}

bool DatabaseConnection::isConnected() const {
    return connected;
}

string DatabaseConnection::executeQuery(const string& query) {
    if (!connected) {
        return "{\"error\": \"Not connected to database\"}";
    }
    
    lock_guard<mutex> lock(mutex_);
    
    // In real implementation, would execute SQL query
    // For demo, return simulated result
    
    cout << "[DB] Executing query: " << query.substr(0, 50) << "..." << endl;
    
    return "{\"status\": \"success\", \"rows\": []}";
}

int DatabaseConnection::executeUpdate(const string& sql) {
    if (!connected) {
        return -1;
    }
    
    lock_guard<mutex> lock(mutex_);
    
    // In real implementation, would execute SQL update
    
    cout << "[DB] Executing update: " << sql.substr(0, 50) << "..." << endl;
    
    return 1;  // Number of affected rows
}

bool DatabaseConnection::beginTransaction() {
    if (!connected) {
        return false;
    }
    
    lock_guard<mutex> lock(mutex_);
    
    cout << "[DB] Transaction started" << endl;
    return true;
}

bool DatabaseConnection::commitTransaction() {
    if (!connected) {
        return false;
    }
    
    lock_guard<mutex> lock(mutex_);
    
    cout << "[DB] Transaction committed" << endl;
    return true;
}

bool DatabaseConnection::rollbackTransaction() {
    if (!connected) {
        return false;
    }
    
    lock_guard<mutex> lock(mutex_);
    
    cout << "[DB] Transaction rolled back" << endl;
    return true;
}

string DatabaseConnection::getConnectionInfo() const {
    stringstream ss;
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
