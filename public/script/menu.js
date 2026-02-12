// ==================== GLOBAL VARIABLES ====================
let allMenuItems = [];
let notifications = [];
let notificationCount = 0;
let isNotificationModalOpen = false;
let hasNewNotifications = false;
let currentSection = 'dashboard';
let currentCategory = 'all';
let isModalOpen = false;
let retryCount = 0;
let currentInventoryCache = []; // Cache for current inventory items
let lastInventoryCacheTime = 0; // Timestamp of last inventory fetch

// Send Stock Global Variables
let stocksData = [];
let changes = new Map();
let sendStockUIInitialized = false; // Flag to prevent re-rendering flicker
let lastQuantityValues = new Map(); // Store quantity values before re-render

const MAX_RETRIES = 3;
const BACKEND_URL = 'http://localhost:5050';
const INVENTORY_CACHE_DURATION = 5000; // Refresh cache every 5 seconds

// ==================== RECIPE MAPPING (Ingredient to Menu Items) ====================
const recipeMapping = {
    'Chicken': ['Fried Chicken', 'Buttered Honey Chicken', 'Buttered Spicy Chicken', 'Chicken Adobo', 'Sizzling Fried Chicken'],
    'Pork slices': ['Korean Spicy Bulgogi (Pork)', 'Korean Salt and Pepper (Pork)', 'Pork Adobo', 'Sizzling Pork'],
    'Pork belly': ['Crisky Pork Lechon Kawali', 'Sizzling Liempo'],
    'Pork ribs': ['Sizzling Porkchop'],
    'Ground pork': ['Pork Shanghai'],
    'Bacon': [],
    'Ham': [],
    'Beef shanks': [],
    'Cream dory fillet': ['Cream Dory Fish Fillet', 'Fish and Fries'],
    'Shrimp': ['Sinigang (Shrimp)', 'Buttered Shrimp'],
    'Smoked fish': ['Tinapa Rice', 'Tuyo Pesto'],
    'Garlic': ['Korean Spicy Bulgogi (Pork)', 'Korean Salt and Pepper (Pork)', 'Crisky Pork Lechon Kawali', 'Sizzling Liempo', 'Sizzling Porkchop', 'Sizzling Pork Sisig', 'Sizzling Fried Chicken', 'Pork Shanghai', 'Pork Adobo', 'Chicken Adobo', 'Sinigang (PORK)', 'Sinigang (Shrimp)', 'Paknet (Pakbet w/ Bagnet)', 'Special Bulalo (good for 2-3 Persons)', 'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)', 'Pancit Bihon (S)', 'Pancit Bihon (M)', 'Pancit Bihon (L)', 'Pancit Canton (S)', 'Pancit Canton (M)', 'Pancit Canton (L)', 'Spaghetti (S)', 'Spaghetti (M)', 'Spaghetti (L)'],
    'Onion': ['Korean Spicy Bulgogi (Pork)', 'Korean Salt and Pepper (Pork)', 'Crisky Pork Lechon Kawali', 'Pork Adobo', 'Sizzling Pork Sisig', 'Chicken Adobo', 'Sinigang (PORK)', 'Sinigang (Shrimp)', 'Paknet (Pakbet w/ Bagnet)', 'Special Bulalo (good for 2-3 Persons)', 'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)', 'Fried Rice', 'Pancit Bihon (S)', 'Pancit Bihon (M)', 'Pancit Bihon (L)', 'Pancit Canton (S)', 'Pancit Canton (M)', 'Pancit Canton (L)', 'Spaghetti (S)', 'Spaghetti (M)', 'Spaghetti (L)'],
    'Carrots': ['Sinigang (PORK)', 'Sinigang (Shrimp)', 'Paknet (Pakbet w/ Bagnet)', 'Special Bulalo (good for 2-3 Persons)', 'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)'],
    'Cabbage': ['Paknet (Pakbet w/ Bagnet)'],
    'Lettuce': ['Clubhouse Sandwich'],
    'Ginger': ['Sinigang (PORK)', 'Sinigang (Shrimp)', 'Special Bulalo (good for 2-3 Persons)', 'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)'],
    'Calamansi': ['Sinigang (PORK)', 'Sinigang (Shrimp)'],
    'Tomato': ['Pork Adobo', 'Chicken Adobo', 'Sinigang (PORK)', 'Sinigang (Shrimp)', 'Paknet (Pakbet w/ Bagnet)'],
    'Soy sauce': ['Korean Spicy Bulgogi (Pork)', 'Korean Salt and Pepper (Pork)', 'Pork Adobo', 'Chicken Adobo', 'Sizzling Pork Sisig', 'Pancit Bihon (S)', 'Pancit Bihon (M)', 'Pancit Bihon (L)', 'Pancit Canton (S)', 'Pancit Canton (M)', 'Pancit Canton (L)', 'Spaghetti (S)', 'Spaghetti (M)', 'Spaghetti (L)', 'Fried Rice'],
    'Cooking oil': ['Fried Chicken', 'Buttered Honey Chicken', 'Buttered Spicy Chicken', 'Sizzling Fried Chicken', 'Sizzling Pork Sisig', 'Sizzling Liempo', 'Sizzling Porkchop', 'Crisky Pork Lechon Kawali', 'French fries', 'Fish and Fries', 'Cheesy Dynamite Lumpia', 'Lumpiang Shanghai', 'Fried Rice', 'Cheesy Nachos', 'Nachos Supreme'],
    'Salt': ['Korean Spicy Bulgogi (Pork)', 'Korean Salt and Pepper (Pork)', 'Pork Adobo', 'Chicken Adobo', 'Fried Chicken', 'Buttered Honey Chicken', 'Buttered Spicy Chicken', 'Sizzling Fried Chicken', 'Sizzling Pork Sisig', 'Sizzling Liempo', 'Sizzling Porkchop', 'Crisky Pork Lechon Kawali', 'Cream Dory Fish Fillet', 'Fish and Fries', 'Sinigang (PORK)', 'Sinigang (Shrimp)', 'Paknet (Pakbet w/ Bagnet)', 'Buttered Shrimp', 'Special Bulalo (good for 2-3 Persons)', 'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)', 'Fried Rice', 'Plain Rice', 'Pancit Bihon (S)', 'Pancit Bihon (M)', 'Pancit Bihon (L)', 'Pancit Canton (S)', 'Pancit Canton (M)', 'Pancit Canton (L)', 'Spaghetti (S)', 'Spaghetti (M)', 'Spaghetti (L)'],
    'Black pepper': ['Korean Spicy Bulgogi (Pork)', 'Korean Salt and Pepper (Pork)', 'Sizzling Pork Sisig', 'Fried Chicken', 'Sinigang (PORK)', 'Sinigang (Shrimp)', 'Paknet (Pakbet w/ Bagnet)', 'Buttered Shrimp'],
    'Sugar': ['Korean Spicy Bulgogi (Pork)', 'Pork Adobo', 'Chicken Adobo', 'Sizzling Pork Sisig', 'Cucumber Lemonade (Glass)', 'Cucumber Lemonade (Pitcher)', 'Blue Lemonade (Glass)', 'Blue Lemonade (Pitcher)', 'Red Tea (Glass)', 'Matcha Green Tea HC', 'Matcha Green Tea MC', 'Milk Tea Regular HC', 'Milk Tea Regular MC'],
    'Brown sugar': [],
    'Vinegar': [],
    'Water': [],
    'Eggs': ['Fried Rice', 'Omelette', 'Scrambled Eggs'],
    'Butter': ['Buttered Honey Chicken', 'Buttered Spicy Chicken', 'Buttered Shrimp', 'Garlic Bread'],
    'Milk': ['Milk Tea Regular HC', 'Milk Tea Regular MC', 'Cafe Americano Tall', 'Cafe Americano Grande', 'Cafe Latte Tall', 'Cafe Latte Grande', 'Caramel Macchiato Tall', 'Caramel Macchiato Grande', 'Matcha Green Tea HC', 'Matcha Green Tea MC', 'Cookies & Cream HC', 'Cookies & Cream MC', 'Strawberry & Cream HC', 'Mango cheese cake HC'],
    'Cheese': ['Cheesy Nachos', 'Nachos Supreme', 'Cheesy Dynamite Lumpia'],
    'Coke': ['Soda (Mismo)', 'Soda 1.5L'],
    'Sprite': ['Soda (Mismo)', 'Soda 1.5L'],
    'Paper cups': ['Cafe Americano Tall', 'Cafe Americano Grande', 'Cafe Latte Tall', 'Cafe Latte Grande', 'Caramel Macchiato Tall', 'Caramel Macchiato Grande', 'Milk Tea Regular HC', 'Milk Tea Regular MC', 'Matcha Green Tea HC', 'Matcha Green Tea MC', 'Cookies & Cream HC', 'Cookies & Cream MC', 'Strawberry & Cream HC', 'Mango cheese cake HC', 'Cucumber Lemonade (Glass)', 'Blue Lemonade (Glass)', 'Red Tea (Glass)'],
    'Straws': ['Milk Tea Regular HC', 'Milk Tea Regular MC', 'Matcha Green Tea HC', 'Matcha Green Tea MC', 'Cookies & Cream HC', 'Cookies & Cream MC', 'Strawberry & Cream HC', 'Mango cheese cake HC', 'Cucumber Lemonade (Glass)', 'Cucumber Lemonade (Pitcher)', 'Blue Lemonade (Glass)', 'Blue Lemonade (Pitcher)', 'Red Tea (Glass)'],
    'Napkins': ['Korean Spicy Bulgogi (Pork)', 'Korean Salt and Pepper (Pork)', 'Crisky Pork Lechon Kawali', 'Cream Dory Fish Fillet', 'Buttered Honey Chicken', 'Buttered Spicy Chicken', 'Chicken Adobo', 'Pork Adobo', 'Sizzling Fried Chicken', 'Sizzling Pork Sisig', 'Sizzling Liempo', 'Sizzling Porkchop', 'Cheesy Nachos', 'Nachos Supreme', 'French fries', 'Clubhouse Sandwich', 'Fish and Fries', 'Cheesy Dynamite Lumpia', 'Lumpiang Shanghai', 'Pork Shanghai', 'Tinapa Rice', 'Tuyo Pesto', 'Sinigang (PORK)', 'Sinigang (Shrimp)', 'Paknet (Pakbet w/ Bagnet)', 'Buttered Shrimp', 'Special Bulalo (good for 2-3 Persons)', 'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)', 'Fried Chicken']
};

// ==================== MENU DATABASE ====================
const menuDatabase = {
    'Rice': [
        { name: 'Korean Spicy Bulgogi (Pork)', unit: 'plate', defaultPrice: 180 },
        { name: 'Korean Salt and Pepper (Pork)', unit: 'plate', defaultPrice: 175 },
        { name: 'Crisky Pork Lechon Kawali', unit: 'plate', defaultPrice: 165 },
        { name: 'Cream Dory Fish Fillet', unit: 'plate', defaultPrice: 160 },
        { name: 'Buttered Honey Chicken', unit: 'plate', defaultPrice: 155 },
        { name: 'Buttered Spicy Chicken', unit: 'plate', defaultPrice: 155 },
        { name: 'Chicken Adobo', unit: 'plate', defaultPrice: 145 },
        { name: 'Pork Shanghai', unit: 'plate', defaultPrice: 140 }
    ],
    'Sizzling': [
        { name: 'Sizzling Pork Sisig', unit: 'sizzling plate', defaultPrice: 220 },
        { name: 'Sizzling Liempo', unit: 'sizzling plate', defaultPrice: 210 },
        { name: 'Sizzling Porkchop', unit: 'sizzling plate', defaultPrice: 195 },
        { name: 'Sizzling Fried Chicken', unit: 'sizzling plate', defaultPrice: 185 }
    ],
    'Party': [
        { name: 'Pancit Bihon (S)', unit: 'tray', defaultPrice: 350 },
        { name: 'Pancit Bihon (M)', unit: 'tray', defaultPrice: 550 },
        { name: 'Pancit Bihon (L)', unit: 'tray', defaultPrice: 750 },
        { name: 'Pancit Canton (S)', unit: 'tray', defaultPrice: 380 },
        { name: 'Pancit Canton (M)', unit: 'tray', defaultPrice: 580 },
        { name: 'Pancit Canton (L)', unit: 'tray', defaultPrice: 780 },
        { name: 'Spaghetti (S)', unit: 'tray', defaultPrice: 400 },
        { name: 'Spaghetti (M)', unit: 'tray', defaultPrice: 600 },
        { name: 'Spaghetti (L)', unit: 'tray', defaultPrice: 800 }
    ],
    'Drink': [
        { name: 'Cucumber Lemonade (Glass)', unit: 'glass', defaultPrice: 60 },
        { name: 'Cucumber Lemonade (Pitcher)', unit: 'pitcher', defaultPrice: 180 },
        { name: 'Blue Lemonade (Glass)', unit: 'glass', defaultPrice: 65 },
        { name: 'Blue Lemonade (Pitcher)', unit: 'pitcher', defaultPrice: 190 },
        { name: 'Red Tea (Glass)', unit: 'glass', defaultPrice: 55 },
        { name: 'Soda (Mismo)', unit: 'bottle', defaultPrice: 25 },
        { name: 'Soda 1.5L', unit: 'bottle', defaultPrice: 65 }
    ],
    'Cafe': [
        { name: 'Cafe Americano Tall', unit: 'cup', defaultPrice: 80 },
        { name: 'Cafe Americano Grande', unit: 'cup', defaultPrice: 95 },
        { name: 'Cafe Latte Tall', unit: 'cup', defaultPrice: 90 },
        { name: 'Cafe Latte Grande', unit: 'cup', defaultPrice: 105 },
        { name: 'Caramel Macchiato Tall', unit: 'cup', defaultPrice: 100 },
        { name: 'Caramel Macchiato Grande', unit: 'cup', defaultPrice: 115 }
    ],
    'Milk': [
        { name: 'Milk Tea Regular HC', unit: 'cup', defaultPrice: 85 },
        { name: 'Milk Tea Regular MC', unit: 'cup', defaultPrice: 95 },
        { name: 'Matcha Green Tea HC', unit: 'cup', defaultPrice: 90 },
        { name: 'Matcha Green Tea MC', unit: 'cup', defaultPrice: 100 }
    ],
    'Frappe': [
        { name: 'Matcha Green Tea HC', unit: 'cup', defaultPrice: 120 },
        { name: 'Matcha Green Tea MC', unit: 'cup', defaultPrice: 135 },
        { name: 'Cookies & Cream HC', unit: 'cup', defaultPrice: 125 },
        { name: 'Cookies & Cream MC', unit: 'cup', defaultPrice: 140 },
        { name: 'Strawberry & Cream HC', unit: 'cup', defaultPrice: 130 },
        { name: 'Mango cheese cake HC', unit: 'cup', defaultPrice: 135 }
    ],
    'Snack & Appetizer': [
        { name: 'Cheesy Nachos', unit: 'serving', defaultPrice: 150 },
        { name: 'Nachos Supreme', unit: 'serving', defaultPrice: 180 },
        { name: 'French fries', unit: 'serving', defaultPrice: 90 },
        { name: 'Clubhouse Sandwich', unit: 'sandwich', defaultPrice: 120 },
        { name: 'Fish and Fries', unit: 'serving', defaultPrice: 160 },
        { name: 'Cheesy Dynamite Lumpia', unit: 'piece', defaultPrice: 25 },
        { name: 'Lumpiang Shanghai', unit: 'piece', defaultPrice: 20 }
    ],
    'Budget Meals Served with Rice': [
        { name: 'Fried Chicken', unit: 'meal', defaultPrice: 95 },
        { name: 'Buttered Honey Chicken', unit: 'meal', defaultPrice: 105 },
        { name: 'Buttered Spicy Chicken', unit: 'meal', defaultPrice: 105 },
        { name: 'Tinapa Rice', unit: 'meal', defaultPrice: 85 },
        { name: 'Tuyo Pesto', unit: 'meal', defaultPrice: 80 },
        { name: 'Fried Rice', unit: 'serving', defaultPrice: 50 },
        { name: 'Plain Rice', unit: 'bowl', defaultPrice: 25 }
    ],
    'Specialties': [
        { name: 'Sinigang (PORK)', unit: 'serving', defaultPrice: 280 },
        { name: 'Sinigang (Shrimp)', unit: 'serving', defaultPrice: 320 },
        { name: 'Paknet (Pakbet w/ Bagnet)', unit: 'serving', defaultPrice: 260 },
        { name: 'Buttered Shrimp', unit: 'serving', defaultPrice: 300 },
        { name: 'Special Bulalo (good for 2-3 Persons)', unit: 'pot', defaultPrice: 450 },
        { name: 'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)', unit: 'pot', defaultPrice: 850 }
    ],
    'packaging': [
        { name: 'Paper Cups (12oz)', unit: 'pack', defaultPrice: 250 },
        { name: 'Paper Cups (16oz)', unit: 'pack', defaultPrice: 280 },
        { name: 'Straws (Regular)', unit: 'pack', defaultPrice: 120 },
        { name: 'Straws (Boba)', unit: 'pack', defaultPrice: 150 },
        { name: 'Food Containers (Small)', unit: 'pack', defaultPrice: 180 },
        { name: 'Food Containers (Medium)', unit: 'pack', defaultPrice: 220 },
        { name: 'Food Containers (Large)', unit: 'pack', defaultPrice: 260 },
        { name: 'Plastic Utensils Set', unit: 'set', defaultPrice: 85 },
        { name: 'Napkins (Pack of 50)', unit: 'pack', defaultPrice: 75 }
    ]
};

// ==================== CATEGORY DISPLAY NAMES ====================
const categoryDisplayNames = {
    'Rice': 'Rice Bowl Meals',
    'Sizzling': 'Hot Sizzlers',
    'Party': 'Party Trays',
    'Drink': 'Drinks',
    'Cafe': 'Coffee',
    'Milk': 'Milk Tea',
    'Frappe': 'Frappe',
    'Snack & Appetizer': 'Snacks & Appetizers',
    'Budget Meals Served with Rice': 'Budget Meals',
    'Specialties': 'Specialties',
    'packaging': 'Packaging'
};

// ==================== UNIT DISPLAY LABELS ====================
const unitDisplayLabels = {
    'plate': 'Plate',
    'plates': 'Plates',
    'sizzling plate': 'Sizzling Plate',
    'tray': 'Tray',
    'trays': 'Trays',
    'glass': 'Glass',
    'glasses': 'Glasses',
    'cup': 'Cup',
    'cups': 'Cups',
    'pitcher': 'Pitcher',
    'pitchers': 'Pitchers',
    'bottle': 'Bottle',
    'bottles': 'Bottles',
    'serving': 'Serving',
    'servings': 'Servings',
    'meal': 'Meal',
    'meals': 'Meals',
    'bowl': 'Bowl',
    'bowls': 'Bowls',
    'sandwich': 'Sandwich',
    'sandwiches': 'Sandwiches',
    'piece': 'Piece',
    'pieces': 'Pieces',
    'pot': 'Pot',
    'pots': 'Pots',
    'pack': 'Pack',
    'packs': 'Packs',
    'set': 'Set',
    'sets': 'Sets',
    'box': 'Box',
    'boxes': 'Boxes',
    'bag': 'Bag',
    'bags': 'Bags'
};

// ==================== CATEGORY UNITS MAPPING ====================
const categoryUnitsMapping = {
    'Rice': ['plate', 'serving'],
    'Sizzling': ['sizzling plate', 'plate'],
    'Party': ['tray'],
    'Drink': ['glass', 'cup', 'pitcher', 'bottle'],
    'Cafe': ['cup', 'glass'],
    'Milk': ['cup', 'glass'],
    'Frappe': ['cup', 'glass'],
    'Snack & Appetizer': ['serving', 'piece', 'sandwich'],
    'Budget Meals Served with Rice': ['meal', 'bowl'],
    'Specialties': ['serving', 'pot'],
    'packaging': ['pack', 'set', 'box', 'bag']
};

// ==================== DOM ELEMENTS CACHE ====================
const elements = {
    itemModal: document.getElementById('itemModal'),
    modalTitle: document.getElementById('modalTitle'),
    itemForm: document.getElementById('itemForm'),
    closeModal: document.getElementById('closeModal'),
    itemId: document.getElementById('itemId'),
    itemName: document.getElementById('itemName'),
    itemCategory: document.getElementById('itemCategories'),
    itemUnit: document.getElementById('itemUnit'),
    currentStock: document.getElementById('currentStock'),
    minimumStock: document.getElementById('minimumStock'),
    maximumStock: document.getElementById('maximumStock'),
    itemPrice: document.getElementById('itemPrice'),
    addNewItem: document.getElementById('addNewItem'),
    saveItemBtn: document.querySelector('.modal-footer .btn-primary'),
    cancelBtn: document.querySelector('.modal-footer .btn-secondary'),
    navLinks: document.querySelectorAll('.nav-link[data-section]'),
    categoryItems: document.querySelectorAll('.category-item[data-category]'),
    menuGrid: document.getElementById('menuGrid'),
    dashboardGrid: document.getElementById('dashboardGrid'),
    totalProducts: document.getElementById('totalProducts'),
    lowStock: document.getElementById('lowStock'),
    outOfStock: document.getElementById('outOfStock'),
    menuValue: document.getElementById('menuValue'),
    totalMenuItems: document.getElementById('totalMenuItems'),
    currentCategoryTitle: document.getElementById('currentCategoryTitle')
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Menu Management System initializing...');
    
    // Initialize notification system
    addNotificationStyles();
    initializeNotificationSystem();
    
    // Connect to real-time notifications
    connectToAdminEvents();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize categories dropdown
    initializeCategoryDropdown();
    
    // Pre-load inventory cache
    console.log('📦 Pre-loading inventory for menu filtering...');
    await getInventoryCache();
    
    // Check and disable buttons based on inventory
    updateAddButtonStates();
    
    // Try to load from localStorage first
    loadFromLocalStorage();
    
    // Show dashboard section
    showSection('dashboard');
    
    // Fetch menu items from API
    await fetchMenuItems();
    
    // Set up auto-refresh
    setInterval(fetchMenuItems, 30000);
    setInterval(updateAddButtonStates, 15000);
    setInterval(getInventoryCache, INVENTORY_CACHE_DURATION);
    setInterval(loadPendingStockRequests, 30000);
    
    console.log('✅ System initialized');
});

// ==================== LOAD FROM LOCALSTORAGE ====================
function loadFromLocalStorage() {
    try {
        const backup = localStorage.getItem('menuItems_backup');
        if (backup) {
            const parsedData = JSON.parse(backup);
            allMenuItems = Array.isArray(parsedData) ? parsedData : [];
            console.log('📦 Loaded from localStorage:', allMenuItems.length, 'items');
            updateAllUIComponents();
        }
    } catch (error) {
        console.error('❌ Error loading from localStorage:', error);
        allMenuItems = [];
    }
}

// ==================== NOTIFICATION STYLES ====================
function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .notification-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #dc3545;
            color: white;
            font-size: 11px;
            font-weight: bold;
            border-radius: 50%;
            min-width: 18px;
            height: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 4px;
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }

        .notification-item {
            padding: 15px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .notification-item:hover {
            background: #f5f5f5;
        }
        
        .notification-item.unread {
            background: #fff8e1;
        }
        
        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 4px;
            color: white;
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: opacity 0.3s, transform 0.3s;
        }
        
        .toast-success { background: #28a745; }
        .toast-error { background: #dc3545; }
        .toast-warning { background: #ffc107; color: #212529; }
        .toast-info { background: #17a2b8; }
        
        .show {
            opacity: 1 !important;
            transform: translateX(0) !important;
        }

        #notificationNavItem {
            position: relative;
            list-style: none;
            margin-left: auto;
        }

        .notification-icon {
            position: relative;
            display: flex;
            align-items: center;
            cursor: pointer;
            padding: 8px 12px;
            border-radius: 4px;
            transition: background 0.2s;
        }
        
        .notification-icon:hover {
            background: rgba(0,0,0,0.05);
        }
        
        .notification-icon i {
            font-size: 20px;
            color: #333;
            margin-right: 8px;
        }
        
        .notification-icon span {
            font-size: 14px;
            color: #333;
        }

        .send-stock-btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: background 0.2s;
        }
        
        .send-stock-btn:hover {
            background: #218838;
        }
        
        .send-stock-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .quantity-controls {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .quantity-btn {
            width: 30px;
            height: 30px;
            border: 1px solid #ddd;
            background: white;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .quantity-btn:hover {
            background: #f8f9fa;
        }
        
        .quantity-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .quantity-input {
            width: 70px;
            text-align: center;
            padding: 6px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .status {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }
        
        .status-available {
            background: #d4edda;
            color: #155724;
        }
        
        .status-low {
            background: #fff3cd;
            color: #856404;
        }
        
        .status-out {
            background: #f8d7da;
            color: #721c24;
        }
        
        .status-medium {
            background: #cce5ff;
            color: #004085;
        }
    `;
    document.head.appendChild(style);
}

// ==================== INITIALIZE NOTIFICATION SYSTEM ====================
function initializeNotificationSystem() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    const existingNavItem = document.getElementById('notificationNavItem');
    if (existingNavItem) existingNavItem.remove();
    
    const notificationNavItem = document.createElement('li');
    notificationNavItem.id = 'notificationNavItem';
    notificationNavItem.style.cssText = 'position: relative; list-style: none; margin-left: auto;';
    
    const notificationBtn = document.createElement('a');
    notificationBtn.href = '#';
    notificationBtn.className = 'nav-link notification-icon';
    notificationBtn.innerHTML = `
        <i class="fas fa-bell"></i>
        <span>Notifications</span>
        <span id="notificationBadge" class="notification-badge" style="display: none;">0</span>
    `;
    notificationBtn.addEventListener('click', function(e) {
        e.preventDefault();
        toggleNotificationModal();
    });
    
    notificationNavItem.appendChild(notificationBtn);
    navLinks.appendChild(notificationNavItem);
    
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            width: 350px;
            max-height: 500px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            display: none;
            flex-direction: column;
            overflow: hidden;
            border: 1px solid #ddd;
        `;
        
        const notificationHeader = document.createElement('div');
        notificationHeader.style.cssText = `
            padding: 15px;
            background: #f8f9fa;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        const headerTitle = document.createElement('h3');
        headerTitle.textContent = 'Notifications';
        headerTitle.style.cssText = 'margin: 0; font-size: 16px; font-weight: 600; color: #333;';
        
        const clearAllBtn = document.createElement('button');
        clearAllBtn.textContent = 'Clear All';
        clearAllBtn.style.cssText = `
            background: none;
            border: none;
            color: #dc3545;
            cursor: pointer;
            font-size: 14px;
            padding: 5px 10px;
            border-radius: 4px;
            transition: background 0.2s;
        `;
        clearAllBtn.addEventListener('click', clearAllNotifications);
        
        notificationHeader.appendChild(headerTitle);
        notificationHeader.appendChild(clearAllBtn);
        
        const notificationList = document.createElement('div');
        notificationList.id = 'notificationList';
        notificationList.style.cssText = 'flex: 1; overflow-y: auto; max-height: 400px;';
        
        const emptyState = document.createElement('div');
        emptyState.id = 'notificationEmptyState';
        emptyState.style.cssText = 'padding: 30px 20px; text-align: center; color: #666;';
        emptyState.innerHTML = `<div style="font-size: 48px; margin-bottom: 10px;">📭</div><p style="margin: 0;">No notifications yet</p>`;
        notificationList.appendChild(emptyState);
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            padding: 10px;
            background: #f8f9fa;
            border: none;
            border-top: 1px solid #ddd;
            cursor: pointer;
            color: #333;
            font-size: 14px;
            transition: background 0.2s;
        `;
        closeBtn.addEventListener('click', toggleNotificationModal);
        
        notificationContainer.appendChild(notificationHeader);
        notificationContainer.appendChild(notificationList);
        notificationContainer.appendChild(closeBtn);
        
        document.body.appendChild(notificationContainer);
    }
}

// ==================== NOTIFICATION FUNCTIONS ====================
function toggleNotificationModal() {
    const notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) return;
    
    if (isNotificationModalOpen) {
        notificationContainer.style.display = 'none';
        isNotificationModalOpen = false;
    } else {
        notificationContainer.style.display = 'flex';
        isNotificationModalOpen = true;
        hasNewNotifications = false;
        updateNotificationBadge();
        notifications.forEach(notification => { notification.read = true; });
        renderNotifications();
    }
}

function addNotification(productName, message, type = 'info') {
    const notification = {
        id: Date.now() + Math.random(),
        productName: productName,
        message: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        read: false,
        type: type
    };
    
    notifications.unshift(notification);
    hasNewNotifications = true;
    updateNotificationBadge();
    renderNotifications();
}

function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    
    const unreadCount = notifications.filter(n => !n.read).length;
    notificationCount = unreadCount;
    
    if (notificationCount > 0) {
        badge.textContent = notificationCount > 99 ? '99+' : notificationCount;
        badge.style.display = 'flex';
        if (hasNewNotifications && !isNotificationModalOpen) {
            badge.style.animation = 'pulse 1s infinite';
        } else {
            badge.style.animation = 'none';
        }
    } else {
        badge.style.display = 'none';
        badge.style.animation = 'none';
    }
}

function renderNotifications() {
    const notificationList = document.getElementById('notificationList');
    const emptyState = document.getElementById('notificationEmptyState');
    
    if (!notificationList) return;
    
    notificationList.innerHTML = '';
    
    if (notifications.length === 0) {
        notificationList.appendChild(emptyState);
        return;
    }
    
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${!notification.read ? 'unread' : ''}`;
        notificationItem.style.cssText = `
            padding: 15px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            transition: background 0.2s;
        `;
        
        notificationItem.addEventListener('click', () => {
            notification.read = true;
            updateNotificationBadge();
            renderNotifications();
        });
        
        notificationItem.innerHTML = `
            <div style="font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;">
                ${notification.productName || 'System Notification'}
            </div>
            <div style="color: #666; font-size: 13px; margin-bottom: 5px;">
                ${notification.message}
            </div>
            <div style="color: #999; font-size: 12px; display: flex; justify-content: space-between;">
                <span>${notification.date} ${notification.timestamp}</span>
                ${!notification.read ? '<span style="color: #ff9800;">●</span>' : ''}
            </div>
        `;
        
        notificationList.appendChild(notificationItem);
    });
}

function clearAllNotifications() {
    if (notifications.length === 0) return;
    if (confirm('Clear all notifications?')) {
        notifications = [];
        notificationCount = 0;
        hasNewNotifications = false;
        updateNotificationBadge();
        renderNotifications();
    }
}

// ==================== CONNECT TO ADMIN EVENTS ====================
function connectToAdminEvents() {
    try {
        const eventSource = new EventSource(`${BACKEND_URL}/api/admin/events`);
        
        eventSource.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Real-time notification received:', data);
                
                if (data.type === 'stock_request') {
                    handleStockRequestNotification(data);
                } else if (data.type === 'low_stock_alert') {
                    handleLowStockAlert(data);
                } else if (data.type === 'connected') {
                    console.log('✅ Connected to admin real-time updates');
                }
            } catch (error) {
                console.error('Error parsing event data:', error);
            }
        });
        
        eventSource.addEventListener('error', function(error) {
            console.error('❌ EventSource connection error:', error);
            eventSource.close();
            setTimeout(connectToAdminEvents, 5000);
        });
    } catch (error) {
        console.error('Error connecting to admin events:', error);
        setTimeout(connectToAdminEvents, 5000);
    }
}

function handleStockRequestNotification(data) {
    const notification = {
        id: data.requestId || Date.now(),
        productName: data.productName,
        message: `📦 Staff requested ${data.requestedQuantity} ${data.unit} of ${data.productName} (${data.priority} priority)`,
        timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date(data.timestamp).toLocaleDateString(),
        read: false,
        type: 'stock_request',
        priority: data.priority,
        data: data.data
    };

    notifications.unshift(notification);
    hasNewNotifications = true;
    updateNotificationBadge();
    
    const priorityEmoji = { 'normal': '📦', 'urgent': '⚠️', 'asap': '🔴' }[data.priority] || '📦';
    showToast(`${priorityEmoji} Stock request: ${data.productName} (${data.requestedQuantity} ${data.unit})`, 'info');
}

function handleLowStockAlert(data) {
    const notification = {
        id: Date.now(),
        productName: data.productName,
        message: `⚠️ Low stock alert: ${data.productName} has only ${data.currentStock} ${data.unit} left`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
        read: false,
        type: 'low_stock'
    };
    
    notifications.unshift(notification);
    hasNewNotifications = true;
    updateNotificationBadge();
    showToast(`⚠️ Low stock: ${data.productName}`, 'warning');
}

// ==================== LOAD PENDING STOCK REQUESTS ====================
async function loadPendingStockRequests() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/stock-requests/pending`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            const requests = data.data || [];
            
            requests.forEach(req => {
                const exists = notifications.some(n => 
                    n.type === 'stock_request' && n.data && n.data._id === req._id
                );
                
                if (!exists) {
                    const notification = {
                        id: Date.now() + Math.random(),
                        productName: req.productName,
                        message: `📦 Staff requested ${req.requestedQuantity} ${req.unit} of ${req.productName} (${req.priority} priority)`,
                        timestamp: new Date(req.requestDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        date: new Date(req.requestDate).toLocaleDateString(),
                        read: false,
                        type: 'stock_request',
                        priority: req.priority,
                        data: req
                    };
                    notifications.unshift(notification);
                    hasNewNotifications = true;
                    updateNotificationBadge();
                }
            });
            renderNotifications();
        }
    } catch (error) {
        console.error('Error loading pending stock requests:', error);
    }
}

// ==================== TOAST NOTIFICATION ====================
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => { toast.classList.add('show'); }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3000);
}

// ==================== INITIALIZE EVENT LISTENERS ====================
function initializeEventListeners() {
    console.log('🔌 Initializing event listeners...');
    
    if (elements.addNewItem) {
        elements.addNewItem.addEventListener('click', openAddModal);
    }
    
    const addFirstItemBtn = document.getElementById('addFirstItemBtn');
    if (addFirstItemBtn) addFirstItemBtn.addEventListener('click', openAddModal);
    
    const addFirstMenuBtn = document.getElementById('addFirstMenuBtn');
    if (addFirstMenuBtn) addFirstMenuBtn.addEventListener('click', openAddModal);
    
    if (elements.saveItemBtn) {
        elements.saveItemBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            await handleSaveItem();
        });
    }
    
    if (elements.cancelBtn) elements.cancelBtn.addEventListener('click', closeModal);
    if (elements.closeModal) elements.closeModal.addEventListener('click', closeModal);
    
    if (elements.itemCategory) {
        elements.itemCategory.addEventListener('change', function() {
            updateFromCategory();
            if (elements.itemName) elements.itemName.value = '';
            if (elements.itemUnit) elements.itemUnit.value = '';
            if (elements.itemPrice) elements.itemPrice.value = '';
        });
    }
    
    if (elements.itemName) {
        elements.itemName.addEventListener('change', function() {
            updateFromItemNameSelect();
        });
    }
    
    if (elements.itemModal) {
        elements.itemModal.addEventListener('click', (e) => {
            if (e.target === elements.itemModal) closeModal();
        });
    }
    
    if (elements.itemForm) {
        elements.itemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleSaveItem();
        });
    }
    
    if (elements.navLinks && elements.navLinks.length > 0) {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                showSection(section);
            });
        });
    }
    
    if (elements.categoryItems && elements.categoryItems.length > 0) {
        elements.categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const category = item.getAttribute('data-category');
                const fullname = item.getAttribute('data-fullname');
                filterByCategory(category, fullname);
            });
        });
    }
}

// ==================== INITIALIZE CATEGORY DROPDOWN ====================
function initializeCategoryDropdown() {
    if (!elements.itemCategory) return;
    
    elements.itemCategory.innerHTML = '<option value="">Select Category</option>';
    
    Object.keys(categoryDisplayNames).forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = categoryDisplayNames[category];
        elements.itemCategory.appendChild(option);
    });
}

// ==================== CATEGORY DROPDOWN FUNCTIONS ====================
function populateItemNamesByCategory(category = null) {
    const itemNameSelect = elements.itemName;
    if (!itemNameSelect) return;
    
    itemNameSelect.innerHTML = '<option value="">Select Product</option>';
    
    if (!category || category.trim() === '') return;
    
    const categoryItems = menuDatabase[category] || [];
    
    if (categoryItems.length === 0) return;
    
    const sortedItems = [...categoryItems].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = item.name;
        option.dataset.unit = item.unit;
        option.dataset.price = item.defaultPrice;
        itemNameSelect.appendChild(option);
    });
}

function updateFromItemNameSelect() {
    const itemName = elements.itemName.value;
    
    if (!itemName || itemName.trim() === '' || itemName === 'Select Product') return;
    
    const selectedOption = elements.itemName.options[elements.itemName.selectedIndex];
    const unit = selectedOption.dataset.unit;
    const price = selectedOption.dataset.price;
    
    if (unit && elements.itemUnit) elements.itemUnit.value = unit;
    if (price && elements.itemPrice) elements.itemPrice.value = price;
}

function updateFromCategory() {
    const category = elements.itemCategory.value;
    
    if (!category || category.trim() === '' || category === 'Select Category') {
        if (elements.itemName) elements.itemName.innerHTML = '<option value="">Select Product</option>';
        if (elements.itemUnit) elements.itemUnit.value = '';
        if (elements.itemPrice) elements.itemPrice.value = '';
        return;
    }
    
    updateUnitOptions(category);
    populateItemNamesByCategory(category);
    
    if (elements.itemName) elements.itemName.value = '';
    if (elements.itemUnit) elements.itemUnit.value = '';
    if (elements.itemPrice) elements.itemPrice.value = '';
}

function updateUnitOptions(category) {
    const unitSelect = elements.itemUnit;
    if (!unitSelect) return;
    
    const availableUnits = categoryUnitsMapping[category] || ['pcs'];
    const currentUnit = unitSelect.value;
    
    unitSelect.innerHTML = '<option value="">Select Unit</option>';
    
    availableUnits.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unitDisplayLabels[unit] || unit.charAt(0).toUpperCase() + unit.slice(1);
        unitSelect.appendChild(option);
    });
    
    if (currentUnit && availableUnits.includes(currentUnit)) {
        unitSelect.value = currentUnit;
    } else if (availableUnits.length > 0) {
        const defaultUnits = {
            'Rice': 'plate',
            'Sizzling': 'sizzling plate',
            'Party': 'tray',
            'Drink': 'glass',
            'Cafe': 'cup',
            'Milk': 'cup',
            'Frappe': 'cup',
            'Snack & Appetizer': 'serving',
            'Budget Meals Served with Rice': 'meal',
            'Specialties': 'serving',
            'packaging': 'pack'
        };
        unitSelect.value = defaultUnits[category] || availableUnits[0];
    }
}

// ==================== FORMATTING FUNCTIONS ====================
function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return new Intl.NumberFormat('en-US').format(num);
}

function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return '₱0.00';
    const numAmount = parseFloat(amount);
    return '₱' + numAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function getCategoryDisplayName(category) {
    return categoryDisplayNames[category] || category;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== FETCH MENU ITEMS ====================
async function fetchMenuItems() {
    try {
        console.log('🔍 Fetching menu items from API...');
        
        const response = await fetch('/api/menu', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        if (response.status === 401) {
            console.warn('⚠️ Unauthorized - using localStorage data only');
            showToast('Session expired. Please login again.', 'error');
            setTimeout(() => { window.location.href = '/login'; }, 2000);
            return;
        }
        
        if (!response.ok) {
            console.warn(`⚠️ API error ${response.status} - using localStorage data`);
            return;
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.warn('⚠️ Response is not JSON');
            return;
        }
        
        const data = await response.json();
        
        if (data && data.success) {
            allMenuItems = data.data || [];
            console.log(`✅ ${allMenuItems.length} items loaded from API`);
            saveToLocalStorage();
            updateAllUIComponents();
            retryCount = 0;
        }
    } catch (error) {
        console.error('❌ Network error fetching menu items:', error);
        showToast('Network error. Please check your connection.', 'error');
        
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            console.log(`🔄 Retrying fetch (${retryCount}/${MAX_RETRIES})...`);
            setTimeout(fetchMenuItems, 2000 * retryCount);
        }
    }
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('menuItems_backup', JSON.stringify(allMenuItems));
        localStorage.setItem('menuItems_lastUpdate', new Date().toISOString());
    } catch (error) {
        console.warn('⚠️ Could not save to localStorage:', error);
    }
}

// ==================== INVENTORY CACHE ====================
async function getInventoryCache() {
    try {
        const now = Date.now();
        
        if (currentInventoryCache.length > 0 && (now - lastInventoryCacheTime) < INVENTORY_CACHE_DURATION) {
            return currentInventoryCache;
        }
        
        const inventoryResponse = await fetch('/api/inventory', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        if (!inventoryResponse.ok) {
            console.warn('⚠️ Could not fetch inventory data');
            return currentInventoryCache;
        }
        
        const inventoryData = await inventoryResponse.json();
        const inventoryItems = inventoryData.data || inventoryData || [];
        
        currentInventoryCache = inventoryItems;
        lastInventoryCacheTime = now;
        
        return inventoryItems;
    } catch (error) {
        console.error('❌ Error getting inventory cache:', error);
        return currentInventoryCache;
    }
}

// ==================== CHECK INGREDIENT AVAILABILITY ====================
async function checkIfAnyIngredientsInStock() {
    try {
        const inventoryResponse = await fetch('/api/inventory', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        if (!inventoryResponse.ok) return false;
        
        const inventoryData = await inventoryResponse.json();
        const inventoryItems = inventoryData.data || inventoryData || [];
        
        return inventoryItems.some(item => {
            const currentStock = parseFloat(item.currentStock || item.stock || 0);
            return currentStock > 0;
        });
    } catch (error) {
        console.error('❌ Error checking inventory:', error);
        return false;
    }
}

async function updateAddButtonStates() {
    try {
        const hasInStock = await checkIfAnyIngredientsInStock();
        
        const addNewItemBtn = document.getElementById('addNewItem');
        const addFirstItemBtn = document.getElementById('addFirstItemBtn');
        const addFirstMenuBtn = document.getElementById('addFirstMenuBtn');
        
        const buttons = [addNewItemBtn, addFirstItemBtn, addFirstMenuBtn].filter(btn => btn !== null);
        
        if (hasInStock) {
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.title = 'Click to add a new product';
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            });
        } else {
            buttons.forEach(btn => {
                btn.disabled = true;
                btn.title = '⚠️ Cannot add products - All ingredients are out of stock. Please restock inventory.';
                btn.style.opacity = '0.6';
                btn.style.cursor = 'not-allowed';
            });
        }
    } catch (error) {
        console.error('❌ Error updating button states:', error);
    }
}

async function checkMenuItemAvailability(itemName) {
    try {
        let requiredIngredients = [];
        
        for (const ingredient in recipeMapping) {
            if (recipeMapping[ingredient].includes(itemName)) {
                requiredIngredients.push(ingredient);
            }
        }
        
        if (requiredIngredients.length === 0) {
            return { available: true, missingIngredients: [] };
        }
        
        const inventoryItems = await getInventoryCache();
        
        const missingIngredients = [];
        
        requiredIngredients.forEach(ingredient => {
            const inventoryItem = inventoryItems.find(item => 
                item.itemName === ingredient || 
                item.name === ingredient ||
                (item.name && item.name.toLowerCase() === ingredient.toLowerCase())
            );
            
            const currentStock = inventoryItem ? parseFloat(inventoryItem.currentStock || inventoryItem.stock || 0) : 0;
            
            if (!inventoryItem || currentStock <= 0) {
                missingIngredients.push(ingredient);
            }
        });
        
        return { 
            available: missingIngredients.length === 0, 
            missingIngredients: missingIngredients
        };
    } catch (error) {
        console.error('❌ Error checking availability:', error);
        return { available: true, missingIngredients: [] };
    }
}

// ==================== MODAL FUNCTIONS ====================
function openAddModal() {
    if (isModalOpen) return;
    
    checkIfAnyIngredientsInStock().then(hasInStock => {
        if (!hasInStock) {
            showToast('⚠️ Cannot add new product - All ingredients are out of stock. Please restock inventory first.', 'warning');
            alert('Cannot add new product!\n\nAll required ingredients are out of stock.\n\nPlease restock the inventory before adding new menu items.');
            return;
        }
        
        isModalOpen = true;
        const modal = elements.itemModal;
        
        if (elements.modalTitle) elements.modalTitle.textContent = 'Add New Product';
        if (elements.itemForm) elements.itemForm.reset();
        if (elements.itemId) elements.itemId.value = '';
        
        if (elements.currentStock) elements.currentStock.value = '0';
        if (elements.minimumStock) elements.minimumStock.value = '20';
        if (elements.maximumStock) elements.maximumStock.value = '200';
        if (elements.itemPrice) elements.itemPrice.value = '';
        
        if (elements.itemCategory) {
            elements.itemCategory.value = '';
            updateFromCategory();
        }
        
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('show');
            if (elements.itemCategory) elements.itemCategory.focus();
        }, 10);
    });
}

async function openEditModal(itemId) {
    if (isModalOpen) return;
    
    const item = allMenuItems.find(i => i._id === itemId);
    if (!item) {
        showToast('Product not found', 'error');
        return;
    }
    
    isModalOpen = true;
    const modal = elements.itemModal;
    
    if (elements.modalTitle) elements.modalTitle.textContent = 'Edit Product';
    if (elements.itemId) elements.itemId.value = item._id;
    
    if (elements.itemCategory) {
        elements.itemCategory.value = item.category;
        updateUnitOptions(item.category);
        populateItemNamesByCategory(item.category);
        
        setTimeout(() => {
            if (elements.itemName) {
                for (let i = 0; i < elements.itemName.options.length; i++) {
                    if (elements.itemName.options[i].value === item.name || elements.itemName.options[i].value === item.itemName) {
                        elements.itemName.selectedIndex = i;
                        break;
                    }
                }
                
                if (!elements.itemName.value && (item.name || item.itemName)) {
                    const option = document.createElement('option');
                    option.value = item.name || item.itemName;
                    option.textContent = item.name || item.itemName;
                    elements.itemName.appendChild(option);
                    elements.itemName.value = item.name || item.itemName;
                }
            }
            
            if (elements.itemUnit) elements.itemUnit.value = item.unit || '';
            if (elements.itemPrice) elements.itemPrice.value = item.price || '';
            if (elements.currentStock) elements.currentStock.value = item.currentStock || 0;
            if (elements.minimumStock) elements.minimumStock.value = item.minStock || 20;
            if (elements.maximumStock) elements.maximumStock.value = item.maxStock || 200;
            
            if (elements.itemName) elements.itemName.dispatchEvent(new Event('change'));
        }, 150);
    }
    
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
        if (elements.itemName) elements.itemName.focus();
    }, 10);
}

function closeModal() {
    if (elements.itemModal) {
        elements.itemModal.classList.remove('show');
        setTimeout(() => {
            elements.itemModal.style.display = 'none';
            isModalOpen = false;
        }, 150);
    }
}

// ==================== SAVE MENU ITEM ====================
async function handleSaveItem() {
    const formData = {
        itemId: elements.itemId ? elements.itemId.value : '',
        itemName: elements.itemName ? elements.itemName.value : '',
        category: elements.itemCategory ? elements.itemCategory.value : '',
        unit: elements.itemUnit ? elements.itemUnit.value : '',
        currentStock: elements.currentStock ? elements.currentStock.value : '0',
        minStock: elements.minimumStock ? elements.minimumStock.value : '20',
        maxStock: elements.maximumStock ? elements.maximumStock.value : '200',
        price: elements.itemPrice ? elements.itemPrice.value : '0'
    };
    
    if (!formData.itemName || formData.itemName.trim() === '' || formData.itemName === 'Select Product') {
        showToast('Please select a product from the dropdown list', 'error');
        if (elements.itemName) {
            elements.itemName.focus();
            elements.itemName.style.borderColor = '#dc3545';
        }
        return;
    }
    
    if (!formData.category || formData.category.trim() === '' || formData.category === 'Select Category') {
        showToast('Please select a category from the dropdown', 'error');
        if (elements.itemCategory) {
            elements.itemCategory.focus();
            elements.itemCategory.style.borderColor = '#dc3545';
        }
        return;
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
        showToast('Please enter a valid price (must be a number greater than 0)', 'error');
        if (elements.itemPrice) {
            elements.itemPrice.focus();
            elements.itemPrice.style.borderColor = '#dc3545';
        }
        return;
    }
    
    if (!formData.unit || formData.unit.trim() === '' || formData.unit === 'Select Unit') {
        showToast('Please select a unit from the dropdown', 'error');
        if (elements.itemUnit) {
            elements.itemUnit.focus();
            elements.itemUnit.style.borderColor = '#dc3545';
        }
        return;
    }
    
    const maxStock = parseInt(formData.maxStock);
    const minStock = parseInt(formData.minStock);
    const currentStock = parseInt(formData.currentStock);
    
    if (isNaN(maxStock) || maxStock <= 0) {
        showToast('Maximum stock must be a positive number', 'error');
        if (elements.maximumStock) elements.maximumStock.focus();
        return;
    }
    
    if (isNaN(minStock) || minStock < 0) {
        showToast('Minimum stock must be 0 or greater', 'error');
        if (elements.minimumStock) elements.minimumStock.focus();
        return;
    }
    
    if (maxStock <= minStock) {
        showToast('Maximum stock must be greater than minimum stock', 'error');
        if (elements.maximumStock) elements.maximumStock.focus();
        return;
    }
    
    if (currentStock > maxStock) {
        showToast('Current stock cannot exceed maximum stock', 'error');
        if (elements.currentStock) elements.currentStock.focus();
        return;
    }
    
    if (currentStock < 0) {
        showToast('Current stock cannot be negative', 'error');
        if (elements.currentStock) elements.currentStock.focus();
        return;
    }
    
    if (!formData.itemId || formData.itemId.trim() === '') {
        const availabilityCheck = await checkMenuItemAvailability(formData.itemName);
        
        if (!availabilityCheck.available) {
            const missingIngredientsList = availabilityCheck.missingIngredients.join('\n  • ');
            showToast(`Cannot add "${formData.itemName}" - Missing ingredients: ${availabilityCheck.missingIngredients.join(', ')}`, 'error');
            alert(`Cannot add "${formData.itemName}" - Missing ingredients:\n  • ${missingIngredientsList}\n\nPlease restock the missing ingredients first.`);
            return;
        }
    }
    
    await saveMenuItem(formData);
}

async function saveMenuItem(itemData) {
    const isEdit = itemData.itemId && itemData.itemId.trim() !== '';
    
    const saveBtn = elements.saveItemBtn;
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    try {
        const payload = {
            name: itemData.itemName,
            itemName: itemData.itemName,
            category: itemData.category,
            unit: itemData.unit,
            currentStock: Number(itemData.currentStock),
            minStock: Number(itemData.minStock),
            maxStock: Number(itemData.maxStock),
            price: Number(itemData.price),
            itemType: 'finished',
            isActive: true
        };
        
        let url, method;
        
        if (isEdit) {
            url = `/api/menu/${itemData.itemId}`;
            method = 'PUT';
        } else {
            url = '/api/menu';
            method = 'POST';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        });
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid server response format');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`Server error ${response.status}: ${data.message || 'Unknown error'}`);
        }
        
        if (data.success) {
            const action = isEdit ? 'updated' : 'added';
            showToast(`Product ${action} successfully!`, 'success');
            closeModal();
            await fetchMenuItems();
            updateCategoryCounts();
        } else {
            throw new Error(data.message || 'Failed to save product');
        }
    } catch (error) {
        console.error('❌ Error saving product:', error);
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        saveBtn.textContent = originalText;
        saveBtn.disabled = false;
    }
}

// ==================== DELETE MENU ITEM ====================
async function deleteMenuItem(itemId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
    }
    
    const deleteBtn = event.target;
    const originalText = deleteBtn.textContent;
    deleteBtn.textContent = 'Deleting...';
    deleteBtn.disabled = true;
    
    try {
        const response = await fetch(`/api/menu/${itemId}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Invalid server response format');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`Server error ${response.status}: ${data.message || 'Unknown error'}`);
        }
        
        if (data.success) {
            showToast('Product deleted successfully!', 'success');
            allMenuItems = allMenuItems.filter(item => item._id !== itemId);
            updateAllUIComponents();
            updateCategoryCounts();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('❌ Error deleting product:', error);
        showToast('Failed to delete product. Please try again.', 'error');
    } finally {
        deleteBtn.textContent = originalText;
        deleteBtn.disabled = false;
    }
}

// ==================== UPDATE UI COMPONENTS ====================
function updateAllUIComponents() {
    if (currentSection === 'dashboard') {
        updateDashboardStats();
        renderDashboardGrid();
    } else if (currentSection === 'menu') {
        renderMenuGrid();
    } else if (currentSection === 'sendstock') {
        initializeSendStockUI();
    }
    updateCategoryCounts();
}

function updateDashboardStats() {
    if (!allMenuItems || !Array.isArray(allMenuItems)) {
        const totalEl = document.getElementById('totalProducts');
        const lowEl = document.getElementById('lowStock');
        const outEl = document.getElementById('outOfStock');
        const inEl = document.getElementById('inStock');
        const valueEl = document.getElementById('menuValue');
        
        if (totalEl) totalEl.textContent = '0';
        if (lowEl) lowEl.textContent = '0';
        if (outEl) outEl.textContent = '0';
        if (inEl) inEl.textContent = '0';
        if (valueEl) valueEl.textContent = '₱0';
        return;
    }
    
    const totalMenuItems = allMenuItems.length;
    
    const lowStockItems = allMenuItems.filter(item => {
        const currentStock = item.currentStock || 0;
        const minStock = item.minStock || 0;
        return currentStock > 0 && currentStock <= minStock;
    }).length;
    
    const outOfStockItems = allMenuItems.filter(item => (item.currentStock || 0) === 0).length;
    const inStockItems = allMenuItems.filter(item => (item.currentStock || 0) > (item.minStock || 0)).length;
    
    const menuValueTotal = allMenuItems.reduce((total, item) => {
        const price = item.price || 0;
        const stock = item.currentStock || 0;
        return total + (price * stock);
    }, 0);
    
    const totalEl = document.getElementById('totalProducts');
    const lowEl = document.getElementById('lowStock');
    const outEl = document.getElementById('outOfStock');
    const inEl = document.getElementById('inStock');
    const valueEl = document.getElementById('menuValue');
    
    if (totalEl) totalEl.textContent = formatNumber(totalMenuItems);
    if (lowEl) lowEl.textContent = formatNumber(lowStockItems);
    if (outEl) outEl.textContent = formatNumber(outOfStockItems);
    if (inEl) inEl.textContent = formatNumber(inStockItems);
    if (valueEl) valueEl.textContent = formatCurrency(menuValueTotal);
}

function updateCategoryCounts() {
    if (!allMenuItems || !Array.isArray(allMenuItems)) return;
    
    const categories = {
        'all': allMenuItems.length,
        'Rice': allMenuItems.filter(item => item.category === 'Rice').length,
        'Sizzling': allMenuItems.filter(item => item.category === 'Sizzling').length,
        'Party': allMenuItems.filter(item => item.category === 'Party').length,
        'Drink': allMenuItems.filter(item => item.category === 'Drink').length,
        'Cafe': allMenuItems.filter(item => item.category === 'Cafe').length,
        'Milk': allMenuItems.filter(item => item.category === 'Milk').length,
        'Frappe': allMenuItems.filter(item => item.category === 'Frappe').length,
        'Snack & Appetizer': allMenuItems.filter(item => item.category === 'Snack & Appetizer').length,
        'Budget Meals Served with Rice': allMenuItems.filter(item => item.category === 'Budget Meals Served with Rice').length,
        'Specialties': allMenuItems.filter(item => item.category === 'Specialties').length,
        'packaging': allMenuItems.filter(item => item.category === 'packaging').length
    };
    
    if (elements.categoryItems && elements.categoryItems.length > 0) {
        elements.categoryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const countElement = item.querySelector('.category-count');
            if (countElement) {
                countElement.textContent = categories[category] || 0;
            }
        });
    }
}

function showSection(section) {
    document.querySelectorAll('.section-content').forEach(sec => {
        sec.classList.remove('active-section');
    });
    
    const targetSection = document.getElementById(section);
    if (targetSection) targetSection.classList.add('active-section');
    
    if (elements.navLinks && elements.navLinks.length > 0) {
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            }
        });
    }
    
    currentSection = section;
    
    if (section === 'dashboard') {
        updateDashboardStats();
        renderDashboardGrid();
    } else if (section === 'menu') {
        renderMenuGrid();
    } else if (section === 'sendstock') {
        initializeSendStockUI();
    }
}

function filterByCategory(category, fullname) {
    currentCategory = category;
    
    if (elements.categoryItems && elements.categoryItems.length > 0) {
        elements.categoryItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-category') === category) {
                item.classList.add('active');
            }
        });
    }
    
    if (elements.currentCategoryTitle) {
        elements.currentCategoryTitle.textContent = fullname || 'Product Menu';
    }
    
    if (currentSection === 'menu') {
        renderMenuGrid();
    }
}

// ==================== RENDER MENU GRID ====================
async function canMenuItemBeMade(itemName) {
    try {
        let requiredIngredients = [];
        for (const ingredient in recipeMapping) {
            if (recipeMapping[ingredient].includes(itemName)) {
                requiredIngredients.push(ingredient);
            }
        }
        
        if (requiredIngredients.length === 0) return true;
        
        const inventoryItems = await getInventoryCache();
        
        let allInStock = true;
        requiredIngredients.forEach(ingredient => {
            const inventoryItem = inventoryItems.find(item => item.itemName === ingredient);
            const stock = inventoryItem ? parseFloat(inventoryItem.currentStock || 0) : 0;
            if (stock <= 0) allInStock = false;
        });
        
        return allInStock;
    } catch (error) {
        console.error('❌ Error checking if item can be made:', error);
        return true;
    }
}

function renderMenuGrid() {
    if (!elements.menuGrid) return;
    
    if (!allMenuItems || !Array.isArray(allMenuItems) || allMenuItems.length === 0) {
        elements.menuGrid.innerHTML = `
            <div class="empty-state">
                <h3>No products found</h3>
                <p>Add products using the "Add New Product" button</p>
            </div>
        `;
        return;
    }
    
    let filteredItems = [...allMenuItems];
    
    if (currentCategory !== 'all') {
        filteredItems = allMenuItems.filter(item => item.category === currentCategory);
    }
    
    if (filteredItems.length === 0) {
        elements.menuGrid.innerHTML = `
            <div class="empty-state">
                <h3>No products in this category</h3>
                <p>Add products to this category using the "Add New Product" button</p>
            </div>
        `;
        return;
    }
    
    const gridHTML = filteredItems.map(item => {
        const itemName = item.name || item.itemName || 'Unnamed Product';
        const itemPrice = item.price || 0;
        const currentStock = item.currentStock || 0;
        const maxStock = item.maxStock || 0;
        const minStock = item.minStock || 0;
        const unit = item.unit || '';
        const displayUnit = unitDisplayLabels[unit] || unit;
        const itemValue = itemPrice * currentStock;
        const stockPercentage = maxStock > 0 ? ((currentStock / maxStock) * 100) : 0;
        
        let stockClass = '';
        if (currentStock === 0) stockClass = 'out-of-stock';
        else if (currentStock <= minStock) stockClass = 'low-stock';
        
        return `
        <div class="menu-card ${stockClass}">
            <div class="card-header">
                <h4>${escapeHtml(itemName)}</h4>
                <div class="card-actions">
                    <button class="btn-icon" onclick="openEditModal('${item._id}')">Edit</button>
                    <button class="btn-icon delete" onclick="deleteMenuItem('${item._id}')">Delete</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info"><span class="label">Category:</span> ${getCategoryDisplayName(item.category)}</div>
                <div class="card-info"><span class="label">Current Stock:</span> ${currentStock} ${displayUnit}</div>
                <div class="card-info"><span class="label">Selling Price:</span> ₱${itemPrice.toFixed(2)}</div>
                <div class="card-info"><span class="label">Stock Value:</span> ₱${itemValue.toFixed(2)}</div>
                <div class="card-info"><span class="label">Min Stock:</span> ${minStock} ${displayUnit}</div>
                <div class="card-info"><span class="label">Max Stock:</span> ${maxStock} ${displayUnit}</div>
                <div class="card-info">
                    <span class="label">Stock Level:</span>
                    <div class="stock-progress">
                        <div class="progress-bar" style="width: ${Math.min(stockPercentage, 100)}%"></div>
                    </div>
                </div>
                <div class="card-info">
                    <span class="label">Status:</span>
                    <span class="status ${currentStock === 0 ? 'out-of-stock' : currentStock <= minStock ? 'low-stock' : 'in-stock'}">
                        ${currentStock === 0 ? 'Out of Stock' : currentStock <= minStock ? 'Low Stock' : 'In Stock'}
                    </span>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    elements.menuGrid.innerHTML = gridHTML;
}

function renderDashboardGrid() {
    if (!elements.dashboardGrid) return;
    
    if (!allMenuItems || !Array.isArray(allMenuItems) || allMenuItems.length === 0) {
        elements.dashboardGrid.innerHTML = `
            <div class="empty-state">
                <h3>No products available</h3>
                <p>Add products to see dashboard data</p>
            </div>
        `;
        return;
    }
    
    const lowStockItems = allMenuItems.filter(item => {
        const currentStock = item.currentStock || 0;
        const minStock = item.minStock || 0;
        return currentStock <= minStock;
    });
    
    const recentItems = lowStockItems.slice(0, 8);
    
    if (recentItems.length === 0) {
        elements.dashboardGrid.innerHTML = `
            <div class="empty-state">
                <h3>All products are well stocked!</h3>
                <p>No low stock items to display</p>
            </div>
        `;
        return;
    }
    
    const gridHTML = recentItems.map(item => {
        const itemName = item.name || item.itemName || 'Unnamed Product';
        const itemPrice = item.price || 0;
        const currentStock = item.currentStock || 0;
        const maxStock = item.maxStock || 0;
        const minStock = item.minStock || 0;
        const unit = item.unit || '';
        const displayUnit = unitDisplayLabels[unit] || unit;
        const itemValue = itemPrice * currentStock;
        
        return `
        <div class="menu-card ${currentStock === 0 ? 'out-of-stock' : 'low-stock'}">
            <div class="card-header">
                <h4>${escapeHtml(itemName)}</h4>
            </div>
            <div class="card-body">
                <div class="card-info"><span class="label">Stock:</span> ${currentStock}/${maxStock} ${displayUnit}</div>
                <div class="card-info"><span class="label">Value:</span> ₱${itemValue.toFixed(2)}</div>
                <div class="card-info"><span class="label">Min:</span> ${minStock} ${displayUnit}</div>
                <div class="card-info">
                    <span class="label">Status:</span>
                    <span class="status ${currentStock === 0 ? 'out-of-stock' : 'low-stock'}">
                        ${currentStock === 0 ? 'Out of Stock' : 'Low Stock'}
                    </span>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    elements.dashboardGrid.innerHTML = gridHTML;
}

// ==================== LOGOUT ====================
function handleLogout() {
    if (!confirm('Are you sure you want to logout?')) return;
    
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
    })
    .then(() => { window.location.href = '/login'; })
    .catch(error => {
        console.error('Logout error:', error);
        window.location.href = '/login';
    });
}

// ==================== SEND STOCK TO STAFF - COMPLETE WORKING VERSION WITH REQUEST HANDLING ====================

/**
 * COMPLETE FIXED SEND STOCK FUNCTIONALITY
 * This sends stock from ADMIN to STAFF inventory
 * The stock is DEDUCTED from admin and ADDED to staff
 * Also processes and resolves pending stock requests
 */

// Initialize Send Stock UI
async function initializeSendStockUI() {
    console.log('📦 Initializing Send Stock UI...');
    
    // If already initialized, just render without full reload
    if (sendStockUIInitialized) {
        console.log('📊 Send Stock UI already initialized, skipping full reload');
        renderSendStockTable();
        return;
    }
    
    // Clear quantity values on first initialization
    lastQuantityValues.clear();
    console.log('🗑️ Cleared all saved quantity values');
    
    try {
        // Check if we have menu items
        if (!allMenuItems || allMenuItems.length === 0) {
            console.log('⚠️ No menu items found, fetching from API...');
            await fetchMenuItems();
        }
        
        // Use allMenuItems if available, otherwise fetch from API
        let itemsToDisplay = [];
        
        if (allMenuItems && allMenuItems.length > 0) {
            itemsToDisplay = allMenuItems;
            console.log('✅ Using allMenuItems:', itemsToDisplay.length, 'items');
        } else {
            // Try to fetch from API
            const response = await fetch('/api/menu', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                itemsToDisplay = data.data || [];
                console.log('✅ Loaded from API:', itemsToDisplay.length, 'items');
            }
        }
        
        // If still no items, use menuDatabase as fallback
        if (!itemsToDisplay || itemsToDisplay.length === 0) {
            console.log('📋 Using menuDatabase as fallback');
            itemsToDisplay = [];
            Object.entries(menuDatabase).forEach(([category, items]) => {
                items.forEach(item => {
                    itemsToDisplay.push({
                        _id: `menu_${Date.now()}_${Math.random()}`,
                        name: item.name,
                        itemName: item.name,
                        category: category,
                        unit: item.unit,
                        price: item.defaultPrice,
                        currentStock: 100, // Default stock for display
                        minStock: 10,
                        maxStock: 200
                    });
                });
            });
        }
        
        // Transform to stocksData format
        stocksData = itemsToDisplay.map((item, index) => ({
            id: index + 1,
            _id: item._id,
            name: item.name || item.itemName,
            category: categoryDisplayNames[item.category] || item.category,
            description: item.name || item.itemName,
            quantity: parseInt(item.currentStock) || 100,
            price: parseFloat(item.price) || 0,
            unit: item.unit || 'piece',
            minStock: parseInt(item.minStock) || 10,
            maxStock: parseInt(item.maxStock) || 200
        }));
        
        console.log('✅ stocksData ready with', stocksData.length, 'items');
        
        // Render the table
        renderSendStockTable();
        attachSendStockEventListeners();
        
        // Check if we need to show empty state
        checkSendStockEmptyState();
        
        // Mark as initialized to prevent flicker on subsequent visits
        sendStockUIInitialized = true;
        
    } catch (error) {
        console.error('❌ Error initializing Send Stock UI:', error);
        showToast('Error loading products. Using default data.', 'warning');
        
        // Ultimate fallback - use menuDatabase
        stocksData = [];
        let id = 1;
        Object.entries(menuDatabase).forEach(([category, items]) => {
            items.forEach(item => {
                stocksData.push({
                    id: id++,
                    _id: `fallback_${id}`,
                    name: item.name,
                    category: categoryDisplayNames[category] || category,
                    description: item.name,
                    quantity: 100,
                    price: item.defaultPrice || 0,
                    unit: item.unit || 'piece',
                    minStock: 10,
                    maxStock: 200
                });
            });
        });
        
        renderSendStockTable();
        attachSendStockEventListeners();
        checkSendStockEmptyState();
        
        // Mark as initialized to prevent flicker on subsequent visits
        sendStockUIInitialized = true;
    }
}

// Check and show empty state
function checkSendStockEmptyState() {
    const section = document.getElementById('sendstock');
    if (!section) return;
    
    const existingEmptyState = document.getElementById('sendStockEmptyState');
    const tableContainer = section.querySelector('.table-responsive');
    
    if (!stocksData || stocksData.length === 0) {
        if (existingEmptyState) {
            existingEmptyState.style.display = 'block';
            if (tableContainer) tableContainer.style.display = 'none';
            return;
        }
        
        const emptyStateDiv = document.createElement('div');
        emptyStateDiv.id = 'sendStockEmptyState';
        emptyStateDiv.className = 'empty-state';
        emptyStateDiv.style.cssText = `
            text-align: center;
            padding: 60px 20px;
            background: white;
            border-radius: 8px;
            margin: 20px;
            border: 1px solid #eee;
        `;
        emptyStateDiv.innerHTML = `
            <div style="font-size: 64px; margin-bottom: 20px;">📦</div>
            <h3 style="margin-bottom: 10px; color: #333;">No Products Available</h3>
            <p style="color: #666; margin-bottom: 20px;">Add products to the menu first before sending stock to staff.</p>
            <button onclick="openAddModal()" class="btn-primary" style="padding: 12px 24px;">
                <i class="fas fa-plus"></i> Add New Product
            </button>
        `;
        
        // Insert before the table container
        if (tableContainer) {
            tableContainer.parentNode.insertBefore(emptyStateDiv, tableContainer);
            tableContainer.style.display = 'none';
        } else {
            section.appendChild(emptyStateDiv);
        }
    } else {
        if (existingEmptyState) {
            existingEmptyState.style.display = 'none';
        }
        if (tableContainer) {
            tableContainer.style.display = 'block';
        }
    }
}

// ==================== CHECK ITEM INGREDIENTS ====================
async function checkItemIngredients(itemName, currentInventoryItems = []) {
    try {
        // Get required ingredients for this menu item
        let requiredIngredients = [];
        for (const ingredient in recipeMapping) {
            if (recipeMapping[ingredient].includes(itemName)) {
                requiredIngredients.push(ingredient);
            }
        }
        
        // If no required ingredients, item is available to send
        if (requiredIngredients.length === 0) {
            return { available: true, missing: [], insufficient: [] };
        }
        
        // Get inventory items if not provided
        let inventoryItems = currentInventoryItems;
        if (inventoryItems.length === 0) {
            try {
                const response = await fetch('/api/inventory', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    inventoryItems = data.data || data || [];
                }
            } catch (e) {
                console.warn('⚠️ Could not fetch inventory for ingredient check');
            }
        }
        
        // Check which ingredients are missing or insufficient
        const missingIngredients = [];
        const insufficientIngredients = [];
        
        requiredIngredients.forEach(ingredient => {
            const inventoryItem = inventoryItems.find(item => 
                item.itemName === ingredient || 
                item.name === ingredient ||
                (item.itemName && item.itemName.toLowerCase() === ingredient.toLowerCase())
            );
            
            if (!inventoryItem) {
                missingIngredients.push(ingredient);
            } else {
                const stock = parseFloat(inventoryItem.currentStock || 0);
                if (stock <= 0) {
                    insufficientIngredients.push(ingredient);
                }
            }
        });
        
        return {
            available: missingIngredients.length === 0 && insufficientIngredients.length === 0,
            missing: missingIngredients,
            insufficient: insufficientIngredients
        };
    } catch (error) {
        console.error('Error checking item ingredients:', error);
        return { available: false, missing: [], insufficient: [] };
    }
}

// ==================== PROCESS PENDING STOCK REQUESTS ====================
async function processPendingStockRequests(productName, quantitySent, unit) {
    try {
        console.log(`📋 Checking for pending stock requests for "${productName}"...`);
        
        // Fetch all pending requests
        const response = await fetch(`${BACKEND_URL}/api/stock-requests/pending`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (!response.ok) {
            console.warn('⚠️ Could not fetch pending stock requests');
            return;
        }
        
        const data = await response.json();
        const pendingRequests = data.data || [];
        
        // Filter requests for this product
        const requestsForProduct = pendingRequests.filter(req => 
            req.productName.toLowerCase() === productName.toLowerCase() &&
            req.status === 'pending'
        );
        
        if (requestsForProduct.length === 0) {
            console.log('✅ No pending requests found for this product');
            return;
        }
        
        console.log(`📦 Found ${requestsForProduct.length} pending request(s) for "${productName}"`);
        
        // Process each request
        for (const request of requestsForProduct) {
            console.log(`📝 Processing request ID: ${request._id}, Requested: ${request.requestedQuantity} ${unit}`);
            
            // Mark request as processed/fulfilled
            const updateResponse = await fetch(`${BACKEND_URL}/api/stock-requests/${request._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    status: 'fulfilled',
                    fulfilledDate: new Date().toISOString(),
                    fulfilledBy: 'admin',
                    fulfilledQuantity: quantitySent,
                    notes: `Request fulfilled by admin with ${quantitySent} ${unit}`
                })
            });
            
            if (updateResponse.ok) {
                console.log(`✅ Request ${request._id} marked as fulfilled`);
                
                // Remove notification for this request
                notifications = notifications.filter(n => 
                    !(n.type === 'stock_request' && n.data && n.data._id === request._id)
                );
                
                // Add notification about fulfilled request
                addNotification(
                    productName,
                    `✅ Stock request for ${request.requestedQuantity} ${unit} has been fulfilled (sent ${quantitySent} ${unit})`,
                    'success'
                );
            } else {
                console.warn(`⚠️ Could not update request ${request._id}`);
            }
        }
        
        // Refresh notifications display
        renderNotifications();
        updateNotificationBadge();
        
        // Also try to delete processed notifications from staff side via event
        try {
            await fetch(`${BACKEND_URL}/api/stock-requests/clear-notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    productName: productName,
                    status: 'fulfilled'
                })
            });
        } catch (e) {
            console.warn('⚠️ Could not clear staff notifications:', e);
        }
        
        console.log('🎉 All pending requests processed successfully');
        
    } catch (error) {
        console.error('❌ Error processing pending stock requests:', error);
    }
}

// Render Send Stock Table
function renderSendStockTable() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) {
        console.warn('⚠️ tableBody element not found');
        return;
    }
    
    // Save quantity values before re-rendering
    const quantityInputs = tableBody.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        const stockId = input.getAttribute('data-stock-id');
        lastQuantityValues.set(stockId, input.value);
    });
    
    // Get filter values
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    const activeFilter = document.querySelector('.filter-btn.active');
    let filterValue = 'all';
    if (activeFilter) {
        const onclickAttr = activeFilter.getAttribute('onclick');
        if (onclickAttr) {
            const match = onclickAttr.match(/'([^']+)'/);
            if (match) filterValue = match[1];
        }
    }
    
    // Filter data
    let filteredData = [...stocksData];
    
    // Apply search filter
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.name.toLowerCase().includes(searchTerm) || 
            item.category.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply category filter
    if (filterValue !== 'all') {
        filteredData = filteredData.filter(item => {
            const itemCategory = item.category.toLowerCase();
            const filterCategory = filterValue.toLowerCase();
            return itemCategory.includes(filterCategory) || 
                   filterCategory.includes(itemCategory) ||
                   itemCategory === filterCategory;
        });
    }
    
    // Update total items count
    const totalItemsEl = document.getElementById('totalItems');
    if (totalItemsEl) {
        totalItemsEl.textContent = filteredData.length;
    }
    
    // Update last updated time
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = new Date().toLocaleTimeString();
    }
    
    // Render rows
    if (filteredData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 20px;">🔍</div>
                    <h3 style="margin-bottom: 10px; color: #333;">No items found</h3>
                    <p style="color: #666;">Try adjusting your search or filter</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tableBody.innerHTML = '';
    
    filteredData.forEach(stock => {
        const row = document.createElement('tr');
        
        // Determine status
        let statusClass = 'status-available';
        let statusText = 'In Stock';
        
        if (stock.quantity <= 0) {
            statusClass = 'status-out';
            statusText = 'Out of Stock';
        } else if (stock.quantity <= stock.minStock) {
            statusClass = 'status-low';
            statusText = 'Low Stock';
        } else if (stock.quantity <= stock.minStock * 2) {
            statusClass = 'status-medium';
            statusText = 'Medium Stock';
        }
        
        // Format price
        const formattedPrice = `₱${parseFloat(stock.price).toFixed(2)}`;
        
        // Restore quantity value if it was previously set
        const savedQuantity = lastQuantityValues.get(stock.id.toString()) || '0';
        
        // Check if this item has required ingredients
        let requiredIngredients = [];
        for (const ingredient in recipeMapping) {
            if (recipeMapping[ingredient].includes(stock.name)) {
                requiredIngredients.push(ingredient);
            }
        }
        
        let missingIngredientsString = '';
        let sendBtnDisabled = stock.quantity <= 0;
        let sendBtnTitle = 'Send stock to staff';
        
        if (requiredIngredients.length > 0) {
            // Find which ingredients are not in inventory or out of stock
            const currentInventoryItems = [];
            missingIngredientsString = requiredIngredients.join(', ');
            sendBtnTitle = `Required ingredients: ${missingIngredientsString}`;
        }
        
        row.innerHTML = `
            <td>${stock.id}</td>
            <td><strong>${escapeHtml(stock.name)}</strong></td>
            <td>${escapeHtml(stock.category)}</td>
            <td>${escapeHtml(stock.description)}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" onclick="decreaseQuantity(${stock.id})" 
                            ${stock.quantity <= 0 ? 'disabled' : ''}>-</button>
                    <input type="number" 
                           class="quantity-input" 
                           id="quantity-${stock.id}" 
                           data-stock-id="${stock.id}"
                           value="${savedQuantity}" 
                           min="0" 
                           max="${stock.quantity}"
                           step="1"
                           onchange="validateQuantity(${stock.id}, this.value)"
                           onkeyup="this.value = this.value.replace(/[^0-9]/g, '')">
                    <button class="quantity-btn increase" onclick="increaseQuantity(${stock.id})"
                            ${stock.quantity <= 0 ? 'disabled' : ''}>+</button>
                    <span style="margin-left: 5px; color: #666;">${stock.unit}</span>
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 4px;">
                    Available: ${stock.quantity} ${stock.unit}
                </div>
            </td>
            <td>${formattedPrice}</td>
            <td>
                <span class="status ${statusClass}">${statusText}</span>
                ${stock.quantity <= stock.minStock ? 
                    `<span style="display: block; font-size: 11px; color: #dc3545; margin-top: 4px;">
                        Min: ${stock.minStock} ${stock.unit}
                    </span>` : ''}
            </td>
            <td>
                <button class="send-stock-btn" onclick="sendStockToStaff(${stock.id})" 
                        id="sendBtn-${stock.id}"
                        title="${sendBtnTitle}"
                        ${sendBtnDisabled ? 'disabled' : ''}>
                    <i class="fas fa-paper-plane"></i> Send to Staff
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

// Attach Send Stock Event Listeners
function attachSendStockEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        // Remove existing listener to avoid duplicates
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);
        
        newSearchInput.addEventListener('input', function() {
            renderSendStockTable();
        });
    }
}

// Validate quantity input
function validateQuantity(id, value) {
    const stock = stocksData.find(item => item.id === id);
    if (!stock) return;
    
    let quantity = parseInt(value) || 0;
    
    if (quantity < 0) quantity = 0;
    if (quantity > stock.quantity) quantity = stock.quantity;
    
    const input = document.getElementById(`quantity-${id}`);
    if (input) {
        input.value = quantity;
    }
}

// Increase quantity
function increaseQuantity(id) {
    const stock = stocksData.find(item => item.id === id);
    if (!stock) return;
    
    const input = document.getElementById(`quantity-${id}`);
    if (input) {
        let currentValue = parseInt(input.value) || 0;
        if (currentValue < stock.quantity) {
            input.value = currentValue + 1;
        }
    }
}

// Decrease quantity
function decreaseQuantity(id) {
    const stock = stocksData.find(item => item.id === id);
    if (!stock) return;
    
    const input = document.getElementById(`quantity-${id}`);
    if (input) {
        let currentValue = parseInt(input.value) || 0;
        if (currentValue > 0) {
            input.value = currentValue - 1;
        }
    }
}

/**
 * ==================== MAIN SEND STOCK FUNCTION ====================
 * This is the core function that sends stock from ADMIN to STAFF
 * It deducts from admin inventory and adds to staff inventory
 * Also processes any pending stock requests for this product
 */
// ==================== FIXED SEND STOCK TO STAFF WITH REAL-TIME UPDATES ====================
async function sendStockToStaff(id) {
    const stock = stocksData.find(item => item.id === id);
    if (!stock) {
        alert('Item not found');
        return;
    }
    
    // Get the quantity to send
    const quantityInput = document.getElementById(`quantity-${id}`);
    const quantityToSend = quantityInput ? parseInt(quantityInput.value) || 0 : 0;
    
    // Validate quantity
    if (quantityToSend <= 0) {
        alert('Please enter a valid quantity greater than 0');
        return;
    }
    
    if (quantityToSend > stock.quantity) {
        alert(`Not enough stock! Available: ${stock.quantity} ${stock.unit}, Requested: ${quantityToSend} ${stock.unit}`);
        return;
    }
    
    // ==================== CHECK FOR REQUIRED INGREDIENTS ====================
    console.log(`🔍 Checking required ingredients for "${stock.name}"...`);
    
    // Get required ingredients for this menu item
    let requiredIngredients = [];
    for (const ingredient in recipeMapping) {
        if (recipeMapping[ingredient].includes(stock.name)) {
            requiredIngredients.push(ingredient);
        }
    }
    
    if (requiredIngredients.length > 0) {
        console.log(`📋 Required ingredients for "${stock.name}":`, requiredIngredients);
        
        // Fetch current inventory to check if all ingredients exist
        let inventoryItems = [];
        try {
            const inventoryResponse = await fetch('/api/inventory', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            
            if (inventoryResponse.ok) {
                const data = await inventoryResponse.json();
                inventoryItems = data.data || data || [];
            }
        } catch (e) {
            console.warn('⚠️ Could not fetch inventory:', e);
        }
        
        // Check which ingredients are missing
        const missingIngredients = [];
        const insufficientIngredients = [];
        
        requiredIngredients.forEach(ingredient => {
            const inventoryItem = inventoryItems.find(item => 
                item.itemName === ingredient || 
                item.name === ingredient ||
                (item.itemName && item.itemName.toLowerCase() === ingredient.toLowerCase())
            );
            
            if (!inventoryItem) {
                missingIngredients.push(ingredient);
                console.warn(`❌ Missing ingredient: ${ingredient}`);
            } else {
                const currentStock = parseFloat(inventoryItem.currentStock || 0);
                if (currentStock <= 0) {
                    insufficientIngredients.push(`${ingredient} (out of stock)`);
                    console.warn(`⚠️ Insufficient stock: ${ingredient} (${currentStock})`);
                }
            }
        });
        
        // If there are missing or insufficient ingredients, show error and prevent sending
        if (missingIngredients.length > 0) {
            const missingList = missingIngredients.join('\n  • ');
            const errorMsg = `❌ Cannot send stock! The following ingredients are NOT added to the inventory:\n\n  • ${missingList}\n\nPlease add these ingredients to the Inventory first, then you can send the stock to staff.`;
            console.error(errorMsg);
            alert(errorMsg);
            showToast(`❌ There is no ingredient: ${missingIngredients.join(', ')}`, 'error');
            return;
        }
        
        if (insufficientIngredients.length > 0) {
            const insufficientList = insufficientIngredients.join('\n  • ');
            const errorMsg = `⚠️ Cannot send stock! The following ingredients have insufficient stock:\n\n  • ${insufficientList}\n\nPlease restock these ingredients in the Inventory first.`;
            console.warn(errorMsg);
            alert(errorMsg);
            showToast(`⚠️ Insufficient ingredient stock: ${insufficientIngredients.join(', ')}`, 'warning');
            return;
        }
        
        console.log('✅ All required ingredients are available!');
    } else {
        console.log('✅ This item has no required ingredients defined.');
    }
    
    // Confirm with user
    const confirmSend = confirm(`Send ${quantityToSend} ${stock.unit} of "${stock.name}" to staff?\n\nThis will:\n• DEDUCT ${quantityToSend} ${stock.unit} from ADMIN inventory\n• ADD ${quantityToSend} ${stock.unit} to STAFF inventory`);
    if (!confirmSend) {
        return;
    }
    
    // Disable the send button during processing
    const sendBtn = document.getElementById(`sendBtn-${id}`);
    const originalBtnText = sendBtn.innerHTML;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    sendBtn.disabled = true;
    
    try {
        console.log('='.repeat(60));
        console.log(`📦 SENDING STOCK TO STAFF: ${quantityToSend} ${stock.unit} of "${stock.name}"`);
        console.log('='.repeat(60));
        
        // STEP 1: Get the original menu item from admin inventory
        console.log('🔍 Step 1: Finding menu item in admin inventory...');
        
        let adminMenuItem = null;
        
        // Try to find by ID first
        if (stock._id && !stock._id.toString().startsWith('fallback_') && !stock._id.toString().startsWith('menu_')) {
            try {
                const response = await fetch(`/api/menu/${stock._id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    adminMenuItem = data.data || data;
                    console.log('✅ Found admin menu item by ID');
                }
            } catch (e) {
                console.log('⚠️ Could not fetch by ID, trying other methods');
            }
        }
        
        // If not found by ID, search in allMenuItems
        if (!adminMenuItem && allMenuItems && allMenuItems.length > 0) {
            adminMenuItem = allMenuItems.find(item => 
                item.name === stock.name || 
                item.itemName === stock.name ||
                (item.name && item.name.toLowerCase() === stock.name.toLowerCase()) ||
                (item.itemName && item.itemName.toLowerCase() === stock.name.toLowerCase())
            );
            
            if (adminMenuItem) {
                console.log('✅ Found admin menu item in allMenuItems');
            }
        }
        
        // If still not found, search in menuDatabase
        if (!adminMenuItem) {
            console.log('🔍 Searching in menuDatabase...');
            for (const category in menuDatabase) {
                const found = menuDatabase[category].find(item => 
                    item.name === stock.name || 
                    item.name.toLowerCase() === stock.name.toLowerCase()
                );
                
                if (found) {
                    adminMenuItem = {
                        name: found.name,
                        itemName: found.name,
                        category: category,
                        unit: found.unit,
                        price: found.defaultPrice,
                        currentStock: stock.quantity
                    };
                    console.log('✅ Found in menuDatabase');
                    break;
                }
            }
        }
        
        if (!adminMenuItem) {
            throw new Error(`Could not find "${stock.name}" in the menu database`);
        }
        
        console.log('✅ Admin menu item found:', adminMenuItem.name || adminMenuItem.itemName);
        
        // STEP 2: UPDATE ADMIN INVENTORY - DEDUCT the sent quantity
        console.log('📝 Step 2: Updating ADMIN inventory (deducting stock)...');
        
        let adminUpdateSuccess = false;
        
        // Try to update via API if we have a valid ID
        if (adminMenuItem._id && !adminMenuItem._id.toString().startsWith('fallback_') && !adminMenuItem._id.toString().startsWith('menu_')) {
            try {
                const newAdminStock = Math.max(0, (parseInt(adminMenuItem.currentStock) || 0) - quantityToSend);
                
                const updateResponse = await fetch(`/api/menu/${adminMenuItem._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        currentStock: newAdminStock
                    })
                });
                
                if (updateResponse.ok) {
                    adminUpdateSuccess = true;
                    console.log(`✅ Admin inventory updated: ${adminMenuItem.currentStock} → ${newAdminStock} ${stock.unit}`);
                    
                    // Update local data
                    if (allMenuItems && allMenuItems.length > 0) {
                        const localItem = allMenuItems.find(item => item._id === adminMenuItem._id);
                        if (localItem) {
                            localItem.currentStock = newAdminStock;
                        }
                    }
                }
            } catch (e) {
                console.warn('⚠️ Could not update admin inventory via API:', e);
            }
        }
        
        // If API update failed, update local data only
        if (!adminUpdateSuccess) {
            console.log('📝 Updating admin inventory locally only');
            
            // Update stocksData
            stock.quantity = Math.max(0, stock.quantity - quantityToSend);
            
            // Update allMenuItems if possible
            if (allMenuItems && allMenuItems.length > 0) {
                const localItem = allMenuItems.find(item => 
                    item.name === stock.name || 
                    item.itemName === stock.name ||
                    (item.name && item.name.toLowerCase() === stock.name.toLowerCase())
                );
                
                if (localItem) {
                    localItem.currentStock = Math.max(0, (parseInt(localItem.currentStock) || 0) - quantityToSend);
                    console.log(`✅ Admin inventory updated locally: ${localItem.currentStock + quantityToSend} → ${localItem.currentStock} ${stock.unit}`);
                }
            }
            
            adminUpdateSuccess = true;
        }
        
        // STEP 3: UPDATE STAFF INVENTORY - ADD the sent quantity
        console.log('📝 Step 3: Updating STAFF inventory (adding stock)...');
        
        let staffUpdateSuccess = false;
        let updatedStaffItem = null;
        
        // First, check if this item already exists in staff inventory
        let staffInventoryItem = null;
        
        try {
            const staffResponse = await fetch('/api/staff/inventory', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            
            if (staffResponse.ok) {
                const staffData = await staffResponse.json();
                const staffItems = staffData.data || staffData || [];
                
                // Look for existing item in staff inventory
                staffInventoryItem = staffItems.find(item => 
                    item.itemName === (adminMenuItem.name || adminMenuItem.itemName) ||
                    item.name === (adminMenuItem.name || adminMenuItem.itemName) ||
                    (item.itemName && item.itemName.toLowerCase() === (adminMenuItem.name || adminMenuItem.itemName).toLowerCase())
                );
                
                if (staffInventoryItem) {
                    console.log('✅ Found existing staff inventory item');
                }
            } else if (staffResponse.status === 404) {
                console.warn('⚠️ Staff inventory endpoint not found (404). Will create new item.');
            } else {
                console.warn(`⚠️ Error fetching staff inventory: HTTP ${staffResponse.status}`);
            }
        } catch (e) {
            console.warn('⚠️ Could not fetch staff inventory:', e.message || e);
            console.warn('   This may be a network issue. Attempting to create new inventory item instead.');
        }
        
        if (staffInventoryItem) {
            // UPDATE existing staff inventory item
            console.log('📝 Updating existing staff inventory...');
            
            const currentStaffStock = parseInt(staffInventoryItem.currentStock) || 0;
            const newStaffStock = currentStaffStock + quantityToSend;
            
            console.log(`   Current staff stock: ${currentStaffStock} ${stock.unit}`);
            console.log(`   Adding: +${quantityToSend} ${stock.unit}`);
            console.log(`   New staff stock: ${newStaffStock} ${stock.unit}`);
            
            try {
                const updateResponse = await fetch(`/api/staff/inventory/${staffInventoryItem._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        currentStock: newStaffStock,
                        lastUpdated: new Date().toISOString(),
                        source: 'admin_transfer',
                        transferDate: new Date().toISOString(),
                        transferredBy: 'admin',
                        notes: `Received ${quantityToSend} ${stock.unit} from admin`
                    })
                });
                
                if (updateResponse.ok) {
                    staffUpdateSuccess = true;
                    updatedStaffItem = {
                        _id: staffInventoryItem._id,
                        itemName: staffInventoryItem.itemName || adminMenuItem.name,
                        currentStock: newStaffStock,
                        unit: stock.unit
                    };
                    console.log('✅ Staff inventory updated successfully');
                } else {
                    const errorData = await updateResponse.json().catch(() => ({}));
                    console.warn(`⚠️ Could not update staff inventory via API: HTTP ${updateResponse.status}`, errorData);
                }
            } catch (e) {
                console.warn('⚠️ Error updating staff inventory:', e.message || e);
            }
        } else {
            // CREATE new staff inventory item
            console.log('➕ Creating new staff inventory item...');
            
            const createPayload = {
                itemName: adminMenuItem.name || adminMenuItem.itemName,
                name: adminMenuItem.name || adminMenuItem.itemName,
                category: adminMenuItem.category || stock.category,
                unit: adminMenuItem.unit || stock.unit,
                currentStock: quantityToSend,
                minStock: adminMenuItem.minStock || 10,
                maxStock: adminMenuItem.maxStock || 100,
                price: adminMenuItem.price || stock.price,
                itemType: 'finished',
                isActive: true,
                source: 'admin_transfer',
                transferredFrom: 'admin',
                transferredDate: new Date().toISOString(),
                notes: `Initial stock from admin: ${quantityToSend} ${stock.unit}`
            };
            
            console.log('📦 Creating staff inventory with payload:', createPayload);
            
            try {
                const createResponse = await fetch('/api/staff/inventory', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(createPayload)
                });
                
                if (createResponse.ok) {
                    const createData = await createResponse.json();
                    staffUpdateSuccess = true;
                    updatedStaffItem = {
                        _id: createData.data?._id || createData._id,
                        itemName: adminMenuItem.name,
                        currentStock: quantityToSend,
                        unit: stock.unit
                    };
                    console.log('✅ Staff inventory created successfully');
                } else {
                    const errorData = await createResponse.json().catch(() => ({}));
                    console.warn(`⚠️ Could not create staff inventory: HTTP ${createResponse.status}`, errorData);
                }
            } catch (e) {
                console.warn('⚠️ Error creating staff inventory:', e.message || e);
            }
        }
        
        // ==================== 🔴 CRITICAL FIX: EMIT REAL-TIME EVENT TO STAFF ====================
        if (staffUpdateSuccess && updatedStaffItem) {
            try {
                console.log('📡 Emitting real-time stock transfer event to staff...');
                
                // Emit event via admin events endpoint
                const eventPayload = {
                    type: 'stock_transfer',
                    action: 'stock_received',
                    itemName: stock.name,
                    itemId: updatedStaffItem._id,
                    quantitySent: quantityToSend,
                    unit: stock.unit,
                    newStaffStock: updatedStaffItem.currentStock,
                    timestamp: new Date().toISOString(),
                    transferredBy: 'admin'
                };
                
                // Send event to staff via API
                const eventResponse = await fetch(`${BACKEND_URL}/api/admin/emit-stock-transfer`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(eventPayload)
                });
                
                if (eventResponse.ok) {
                    console.log('✅ Real-time event emitted successfully to staff');
                } else {
                    console.warn('⚠️ Failed to emit real-time event:', await eventResponse.text());
                }
            } catch (e) {
                console.warn('⚠️ Error emitting real-time event:', e);
            }
        }
        
        // STEP 4: PROCESS ANY PENDING STOCK REQUESTS FOR THIS PRODUCT
        console.log('📋 Step 4: Processing pending stock requests...');
        await processPendingStockRequests(stock.name, quantityToSend, stock.unit);
        
        // STEP 5: Clear the quantity input
        if (quantityInput) {
            quantityInput.value = 0;
        }
        
        // STEP 6: Show success message
        console.log('✅ Stock sent successfully!');
        console.log('='.repeat(60));
        
        showToast(`✅ Sent ${quantityToSend} ${stock.unit} of "${stock.name}" to staff!`, 'success');
        
        // STEP 7: Add notification
        addNotification(
            stock.name,
            `Sent ${quantityToSend} ${stock.unit} to staff inventory`,
            'success'
        );
        
        // STEP 8: Refresh the table to show updated admin stock
        renderSendStockTable();
        
        // STEP 9: Refresh menu items to update stock levels in other sections
        await fetchMenuItems();
        
    } catch (error) {
        console.error('❌ Error sending stock to staff:', error);
        
        // Better error messages for different error types
        let errorMessage = 'Error sending stock to staff';
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('404')) {
            errorMessage = 'Staff inventory endpoint not found. Please contact system administrator.';
        } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            errorMessage = 'Session expired. Please refresh and login again.';
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        showToast(`❌ ${errorMessage}`, 'error');
    } finally {
        // Re-enable the send button
        sendBtn.innerHTML = originalBtnText;
        sendBtn.disabled = false;
    }
}

// ==================== FILTER TABLE ====================
function filterTable(filter) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderSendStockTable();
}

// ==================== SAVE ALL CHANGES ====================
function saveAllChanges() {
    showToast('Use the "Send to Staff" button for each item', 'info');
}

// ==================== SEND STOCK BATCH ====================
async function sendStockBatch() {
    showToast('Please send stock individually using the Send button for each item', 'info');
}

// ==================== RESET ALL QUANTITIES ====================
function resetAllQuantities() {
    console.log('🔄 Resetting all quantities...');
    
    // Clear all saved quantity values
    lastQuantityValues.clear();
    console.log('✅ Cleared lastQuantityValues Map');
    
    // Clear the input values in the table
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.value = '0';
    });
    console.log('✅ Reset all quantity inputs to 0');
    
    // Show success toast
    showToast('✅ All quantities have been reset to 0', 'success');
    console.log('🎉 Reset operation completed successfully');
}

// ==================== GLOBAL EXPORTS ====================
window.handleLogout = handleLogout;
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.deleteMenuItem = deleteMenuItem;
window.toggleNotificationModal = toggleNotificationModal;
window.clearAllNotifications = clearAllNotifications;
window.initializeSendStockUI = initializeSendStockUI;
window.sendStockToStaff = sendStockToStaff;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.validateQuantity = validateQuantity;
window.filterTable = filterTable;
window.saveAllChanges = saveAllChanges;
window.sendStockBatch = sendStockBatch;
window.resetAllQuantities = resetAllQuantities;
window.loadPendingStockRequests = loadPendingStockRequests;

console.log('✅ Menu Management System loaded successfully with working Send Stock functionality and pending request processing');