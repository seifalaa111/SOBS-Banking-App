# Smart Online Banking System (SOBS)
# MVC Architecture Implementation in C++
# Egyptian Chinese University - Software Engineering Phase 2

CXX = g++
CXXFLAGS = -std=c++17 -Wall -Wextra -I.

# Source directories
MODEL_DIR = model
VIEW_DIR = view
CONTROLLER_DIR = controller
UTILS_DIR = utils

# Source files
MODEL_SRC = $(MODEL_DIR)/User.cpp \
            $(MODEL_DIR)/Account.cpp \
            $(MODEL_DIR)/Transaction.cpp \
            $(MODEL_DIR)/Transfer.cpp \
            $(MODEL_DIR)/BillPayment.cpp

CONTROLLER_SRC = $(CONTROLLER_DIR)/AuthenticationController.cpp \
                 $(CONTROLLER_DIR)/AccountController.cpp \
                 $(CONTROLLER_DIR)/TransferController.cpp \
                 $(CONTROLLER_DIR)/BillPaymentController.cpp

UTILS_SRC = $(UTILS_DIR)/DatabaseConnection.cpp

MAIN_SRC = main.cpp

# All sources
SOURCES = $(MODEL_SRC) $(CONTROLLER_SRC) $(UTILS_SRC) $(MAIN_SRC)

# Object files
OBJECTS = $(SOURCES:.cpp=.o)

# Output executable
TARGET = sobs_demo

# Default target
all: $(TARGET)

# Link
$(TARGET): $(OBJECTS)
	$(CXX) $(CXXFLAGS) -o $@ $^

# Compile
%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean
clean:
	rm -f $(OBJECTS) $(TARGET)

# Run
run: $(TARGET)
	./$(TARGET)

# Rebuild
rebuild: clean all

.PHONY: all clean run rebuild
