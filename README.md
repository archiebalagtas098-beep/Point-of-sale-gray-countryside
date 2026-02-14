# Point-of-Sale System - G'ray Countryside Café

## 📋 Overview

A comprehensive Point-of-Sale (POS) system built for G'ray Countryside Café with:
- ✅ Inventory Management with duplicate prevention
- ✅ Staff Dashboard with real-time stock requests
- ✅ Menu Management with recipe tracking
- ✅ Order Processing & Sales Reports
- ✅ MongoDB Atlas integration
- ✅ Real-time WebSocket & SSE updates
- ✅ Role-based authentication (Admin, Staff, Manager)

---

## 🚀 QUICK START

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB Atlas account (connection URI configured)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cat .env
# Ensure MONGODB_URI is set with valid credentials

# 3. Start server
npm start

# 4. Access application
# Admin Dashboard: http://localhost:5050/login
# Staff Dashboard: http://localhost:5050/login
```

### Expected Output
```
✅ Server is running at http://localhost:5050
✅ WebSocket server running on ws://localhost:5050/ws
✅ MongoDB Atlas Connected Successfully
📊 Database: POSdb
🏠 Host: cluster0.7maj4in.mongodb.net
```

---

## 📚 KEY FEATURES

### 1. Inventory Management
- **Add/Edit/Delete** inventory items
- **3-Layer Duplicate Prevention**:
  - Frontend validation (real-time)
  - Backend server validation (409 Conflict)
  - Error handling with user feedback
- **Stock Tracking**: Current, minimum, maximum stock
- **Category Management**: Organize items by type
- **Status Indicators**: In Stock, Low Stock, Out of Stock

### 2. Staff Dashboard
- **Stock Request System**: Request inventory replenishment
- **3-Tier Product Lookup**: Ensures reliable product identification
- **POS Interface**: Order entry and payment processing
- **Real-Time Updates**: See inventory changes instantly
- **Menu Display**: Browse all available items

### 3. Menu Management
- **Recipe Tracking**: Link ingredients to menu items
- **Price Management**: Set and update prices
- **Availability Checking**: Auto-update based on inventory
- **Category Organization**: Group similar items
- **Image Support**: Display food images

### 4. Real-Time Features
- **WebSocket Integration**: Live inventory updates
- **Server-Sent Events**: Broadcast notifications
- **Notification System**: Stock alerts and transfers
- **Multi-User Support**: Concurrent staff access

### 5. Reporting & Analytics
- **Sales Reports**: Daily/weekly/monthly summaries
- **Inventory Reports**: Stock history and movements
- **Staff Performance**: Transactions per user
- **Customer Data**: Purchase history and loyalty

---

## 🏗️ ARCHITECTURE

```
POS System
├── Backend (Node.js/Express)
│   ├── server.js (3229 lines) - Main API server
│   ├── config/database.js - MongoDB Atlas connection
│   ├── models/ - Mongoose schemas
│   ├── routes/ - API endpoints
│   └── middleware/ - Authentication & authorization
├── Frontend (EJS/JavaScript)
│   ├── views/ - EJS templates
│   └── public/
│       ├── script/ - Client-side JavaScript
│       └── css/ - Styling
└── Database (MongoDB Atlas)
    ├── inventoryItems - Inventory data
    ├── menuItems - Menu items & recipes
    ├── stockRequests - Stock request history
    ├── orders - Order data
    ├── users - User accounts
    └── customers - Customer information
```

---

## 📊 DATABASE SCHEMA

All collections include:
- ✅ `createdAt` & `updatedAt` timestamps
- ✅ Validation rules (required, min, max, enum)
- ✅ Appropriate database indexes
- ✅ Type safety and defaults

**Key Collections**:
- `inventoryItems` - Raw ingredients and supplies
- `menuItems` - Menu items with recipes
- `stockRequests` - Stock request tracking
- `orders` - Transaction records
- `users` - User accounts and roles
- `customers` - Customer information

---

## 🔐 SECURITY

- ✅ JWT token-based authentication
- ✅ Role-based access control (Admin, Staff, Manager)
- ✅ Password hashing with bcrypt
- ✅ Input validation on all endpoints
- ✅ Authorization checks on sensitive routes
- ✅ Session management with httpOnly cookies
- ✅ CORS protection
- ✅ Rate limiting ready

---

## 📁 PROJECT STRUCTURE

```
POs-gray/
├── config/
│   └── database.js              # MongoDB connection (production-ready)
├── models/
│   ├── InventoryItem.js         # Inventory schema
│   ├── MenuItem.js              # Menu item schema
│   ├── StockRequest.js          # Stock request schema
│   ├── Order.js                 # Order schema
│   ├── User.js                  # User schema
│   └── ...                      # Other models
├── routes/
│   ├── stockTransferroute.js   # Stock transfer endpoints
│   ├── staffroute.js            # Staff endpoints
│   ├── productroute.js          # Product endpoints
│   └── ...                      # Other routes
├── middleware/
│   └── authMiddleware.js        # Authentication
├── public/
│   ├── script/
│   │   ├── inventory.js         # Inventory management (1933 lines)
│   │   ├── staff.js             # Staff dashboard (2868 lines)
│   │   ├── menu.js              # Menu management (3925 lines)
│   │   └── ...                  # Other scripts
│   └── css/                     # Stylesheets
├── views/
│   ├── staffdashboard.ejs       # Staff UI
│   ├── dashboard.ejs            # Admin dashboard
│   ├── login.ejs                # Login page
│   └── ...                      # Other views
├── server.js                    # Main server (3229 lines)
├── package.json                 # Dependencies
├── .env                         # Environment variables
├── FIXES_SUMMARY.md            # All fixes (this session)
├── TESTING_GUIDE.md            # Test procedures
├── DEPLOYMENT_CHECKLIST.md     # Deployment steps
└── QUICK_REFERENCE.md          # Quick reference guide
```

---

## 🔧 CONFIGURATION

### Environment Variables
```bash
# Authentication
JWT_SECRET=your_super_secret_key_here
SESSION_SECRET=your-strong-secret-key-change-this-in-production

# Database (MongoDB Atlas)
MONGODB_URI=mongodb+srv://forclientadmin2:Iy3RirAfe6Ag4UqC@cluster0.7maj4in.mongodb.net/POSdb?retryWrites=true&w=majority&appName=Cluster0

# Server
NODE_ENV=development
PORT=5050
FRONTEND_URL=http://localhost:5050

# Database Settings
DB_MAX_POOL_SIZE=10
DB_MIN_POOL_SIZE=2
DB_SOCKET_TIMEOUT_MS=45000
DB_SERVER_SELECTION_TIMEOUT_MS=10000

# Logging
LOG_LEVEL=info
DEBUG_MODE=false
```

---

## 📡 API ENDPOINTS

### Inventory Management
```
GET    /api/inventory               - List all items
POST   /api/inventory               - Add item (409 on duplicate)
GET    /api/inventory/:id          - Get item details
PUT    /api/inventory/:id          - Update item (409 on duplicate)
DELETE /api/inventory/:id          - Delete item
```

### Stock Requests
```
POST   /api/stock-transfers/request-stock      - Create request
POST   /api/stock-transfers/send-to-staff      - Transfer stock
GET    /api/stock-transfers/pending-requests   - List pending
PUT    /api/stock-transfers/update-request/:id - Approve/Reject
GET    /api/stock-transfers/staff-transfers    - Staff history
GET    /api/stock-transfers/history            - Full history
```

### Menu Management
```
GET    /api/menu                    - List menu items
POST   /api/menu                    - Add menu item
GET    /api/menu/:id               - Get menu item
PUT    /api/menu/:id               - Update menu item
DELETE /api/menu/:id               - Delete menu item
```

---

## ✨ RECENT FIXES & IMPROVEMENTS

### Session 1: Comprehensive MongoDB Atlas Integration
1. **Enhanced Database Configuration**
   - Connection pooling (maxPoolSize: 10)
   - Retry logic with exponential backoff
   - Socket timeout configuration
   - Connection event handlers

2. **3-Layer Duplicate Prevention**
   - Frontend validation with case-insensitive check
   - Backend server-side validation (409 Conflict)
   - User-friendly error messages

3. **Stock Request Functionality**
   - 3-tier product lookup strategy
   - Confirmation dialogs
   - Priority level selection
   - Request history tracking

4. **Comprehensive Error Handling**
   - Try-catch blocks on all API endpoints
   - Detailed logging with emoji indicators
   - User-friendly toast notifications
   - Network error recovery

5. **Real-Time Features**
   - WebSocket connections (Admin & Staff)
   - Server-Sent Events (SSE)
   - Broadcast notifications
   - Live inventory updates

---

## 🧪 TESTING

Comprehensive testing guide available in `TESTING_GUIDE.md`:
- ✅ Database connection tests
- ✅ Duplicate prevention tests (3-layer validation)
- ✅ Stock request workflow tests
- ✅ Real-time update tests
- ✅ Security authorization tests
- ✅ Error handling tests
- ✅ Performance tests
- ✅ Integration tests

**Quick Test**:
```bash
# Test duplicate prevention
1. Add ingredient "Pork"
2. Try adding "Pork" again
3. Should see: ❌ ERROR: "Pork" already exists
```

---

## 🚀 DEPLOYMENT

See `DEPLOYMENT_CHECKLIST.md` for comprehensive deployment guide:
1. Server preparation
2. Application upload
3. Environment configuration
4. Dependency installation
5. Database initialization
6. Server startup
7. Health verification
8. Monitoring setup

**Quick Deploy**:
```bash
npm install
pm2 start server.js --name "POS-Server"
pm2 logs POS-Server
```

---

## 📖 DOCUMENTATION

- **FIXES_SUMMARY.md** - Complete list of all fixes
- **TESTING_GUIDE.md** - Test cases and procedures
- **DEPLOYMENT_CHECKLIST.md** - Deployment steps
- **QUICK_REFERENCE.md** - Quick reference for common tasks

---

## 🐛 TROUBLESHOOTING

### MongoDB Connection Issues
```
Check:
1. MongoDB Atlas cluster is running
2. IP whitelist includes server IP
3. MONGODB_URI in .env is correct
4. Network connectivity to MongoDB Atlas
```

### Duplicate Prevention Not Working
```
Verify:
1. Frontend validation in inventory.js
2. Backend validation in server.js
3. Error handling in handleSaveItem
4. Server restarted after changes
```

### Stock Request Modal Not Opening
```
Check:
1. requestStock() function in staff.js
2. 3-tier lookup finding product
3. showRequestStockModal() function exists
4. Browser console for JavaScript errors
```

---

## 🔄 TECH STACK

**Backend**:
- Node.js v18+
- Express.js (REST API)
- MongoDB with Mongoose ODM
- WebSocket (ws library)
- JWT authentication

**Frontend**:
- EJS templating
- Vanilla JavaScript
- CSS3 styling
- WebSocket client

**Database**:
- MongoDB Atlas (Cloud)
- Automatic backups
- Read replicas ready

---

## 📞 SUPPORT

For issues or questions:
1. Check QUICK_REFERENCE.md for common solutions
2. Review TESTING_GUIDE.md for test procedures
3. Check DEPLOYMENT_CHECKLIST.md for setup issues
4. Review server logs for detailed error messages

---

## 📄 LICENSE

School Project - For Educational Purposes Only

---

## 👥 CONTRIBUTORS

Developed for G'ray Countryside Café POS System

---

**Status**: ✅ Production Ready
**Last Updated**: 2024
**Version**: 1.0.0
# G-ray-countrysideCafe-POS
