/**
 * Smart Online Banking System (SOBS)
 * Utils: DatabaseConnection.h
 * 
 * BONUS: Singleton Design Pattern Implementation
 * 
 * The Singleton pattern ensures that only ONE instance of the database
 * connection exists throughout the application lifecycle. This is crucial
 * for banking systems to:
 * 1. Manage connection pooling efficiently
 * 2. Prevent resource leaks
 * 3. Ensure thread-safe database operations
 * 4. Maintain consistent transaction state
 * 
 * Design Pattern: Singleton (Creational Pattern)
 */

#ifndef DATABASECONNECTION_H
#define DATABASECONNECTION_H

#include <string>
#include <mutex>
#include <memory>

using namespace std;

namespace SOBS {
namespace Utils {

/**
 * DatabaseConnection implements the Singleton design pattern
 * to ensure only one database connection instance exists.
 * 
 * Thread-safe implementation using double-checked locking.
 */
class DatabaseConnection {
private:
    // Private constructor - prevents direct instantiation
    DatabaseConnection();
    
    // Private destructor
    ~DatabaseConnection();
    
    // Delete copy constructor and assignment operator
    DatabaseConnection(const DatabaseConnection&) = delete;
    DatabaseConnection& operator=(const DatabaseConnection&) = delete;
    
    // The single instance
    static DatabaseConnection* instance;
    
    // Mutex for thread safety
    static mutex mutex_;
    
    // Connection state
    bool connected;
    string connectionString;
    string host;
    int port;
    string database;
    string username;
    
    // Connection pool settings
    int maxConnections;
    int activeConnections;

public:
    /**
     * Get the singleton instance
     * Thread-safe implementation using double-checked locking
     */
    static DatabaseConnection* getInstance();
    
    /**
     * Initialize database connection
     */
    bool connect(const string& host, int port, 
                 const string& database,
                 const string& username,
                 const string& password);
    
    /**
     * Close database connection
     */
    void disconnect();
    
    /**
     * Check if connected
     */
    bool isConnected() const;
    
    /**
     * Execute a query
     */
    string executeQuery(const string& query);
    
    /**
     * Execute an update/insert/delete
     */
    int executeUpdate(const string& sql);
    
    /**
     * Begin a transaction
     */
    bool beginTransaction();
    
    /**
     * Commit a transaction
     */
    bool commitTransaction();
    
    /**
     * Rollback a transaction
     */
    bool rollbackTransaction();
    
    /**
     * Get connection info
     */
    string getConnectionInfo() const;
    
    /**
     * Get active connection count
     */
    int getActiveConnections() const;
    
    /**
     * Health check
     */
    bool healthCheck();
};

} // namespace Utils
} // namespace SOBS

#endif // DATABASECONNECTION_H
