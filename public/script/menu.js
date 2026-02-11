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

const MAX_RETRIES = 3;
const BACKEND_URL = 'http://localhost:5050';
const INVENTORY_CACHE_DURATION = 5000; // Refresh cache every 5 seconds

// ==================== RECIPE MAPPING (Ingredient to Menu Items) ====================
// Maps each RAW INGREDIENT to all MENU ITEMS that use it
// When ingredient stock = 0, the associated menu items become UNAVAILABLE
const recipeMapping = {
    // ===== MEAT & POULTRY =====
    'Chicken': [
        'Fried Chicken',
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Chicken Adobo',
        'Sizzling Fried Chicken'
    ],
    
    'Pork slices': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Pork Adobo',
        'Sizzling Pork'
    ],
    
    'Pork belly': [
        'Crisky Pork Lechon Kawali',
        'Sizzling Liempo'
    ],
    
    'Pork ribs': [
        'Sizzling Porkchop'
    ],
    
    'Ground pork': [
        'Pork Shanghai'
    ],
    
    'Bacon': [
    ],
    
    'Ham': [
    ],
    
    'Beef shanks': [
    ],
    
    // ===== SEAFOOD =====
    'Cream dory fillet': [
        'Cream Dory Fish Fillet',
        'Fish and Fries'
    ],
    
    'Shrimp': [
        'Sinigang (Shrimp)',
        'Buttered Shrimp'
    ],
    
    'Smoked fish': [
        'Tinapa Rice',
        'Tuyo Pesto'
    ],
    
    // ===== VEGETABLES & HERBS =====
    'Garlic': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crisky Pork Lechon Kawali',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Sizzling Pork Sisig',
        'Sizzling Fried Chicken',
        'Pork Shanghai',
        'Pork Adobo',
        'Chicken Adobo',
        'Sinigang (PORK)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Pancit Bihon (S)',
        'Pancit Bihon (M)',
        'Pancit Bihon (L)',
        'Pancit Canton (S)',
        'Pancit Canton (M)',
        'Pancit Canton (L)',
        'Spaghetti (S)',
        'Spaghetti (M)',
        'Spaghetti (L)'
    ],
    
    'Onion': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crisky Pork Lechon Kawali',
        'Pork Adobo',
        'Sizzling Pork Sisig',
        'Chicken Adobo',
        'Sinigang (PORK)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Fried Rice',
        'Pancit Bihon (S)',
        'Pancit Bihon (M)',
        'Pancit Bihon (L)',
        'Pancit Canton (S)',
        'Pancit Canton (M)',
        'Pancit Canton (L)',
        'Spaghetti (S)',
        'Spaghetti (M)',
        'Spaghetti (L)'
    ],
    
    'Carrots': [
        'Sinigang (PORK)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)'
    ],
    
    'Cabbage': [
        'Paknet (Pakbet w/ Bagnet)'
    ],
    
    'Lettuce': [
        'Clubhouse Sandwich'
    ],
    
    'Ginger': [
        'Sinigang (PORK)',
        'Sinigang (Shrimp)',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)'
    ],
    
    'Calamansi': [
        'Sinigang (PORK)',
        'Sinigang (Shrimp)'
    ],
    
    'Tomato': [
        'Pork Adobo',
        'Chicken Adobo',
        'Sinigang (PORK)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)'
    ],
    
    // ===== PANTRY STAPLES =====
    'Soy sauce': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Pork Adobo',
        'Chicken Adobo',
        'Sizzling Pork Sisig',
        'Pancit Bihon (S)',
        'Pancit Bihon (M)',
        'Pancit Bihon (L)',
        'Pancit Canton (S)',
        'Pancit Canton (M)',
        'Pancit Canton (L)',
        'Spaghetti (S)',
        'Spaghetti (M)',
        'Spaghetti (L)',
        'Fried Rice'
    ],
    
    'Cooking oil': [
        'Fried Chicken',
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Sizzling Fried Chicken',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Crisky Pork Lechon Kawali',
        'French fries',
        'Fish and Fries',
        'Cheesy Dynamite Lumpia',
        'Lumpiang Shanghai',
        'Fried Rice',
        'Cheesy Nachos',
        'Nachos Supreme'
    ],
    
    'Salt': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Pork Adobo',
        'Chicken Adobo',
        'Fried Chicken',
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Sizzling Fried Chicken',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Crisky Pork Lechon Kawali',
        'Cream Dory Fish Fillet',
        'Fish and Fries',
        'Sinigang (PORK)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Fried Rice',
        'Plain Rice',
        'Pancit Bihon (S)',
        'Pancit Bihon (M)',
        'Pancit Bihon (L)',
        'Pancit Canton (S)',
        'Pancit Canton (M)',
        'Pancit Canton (L)',
        'Spaghetti (S)',
        'Spaghetti (M)',
        'Spaghetti (L)'
    ],
    
    'Black pepper': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Sizzling Pork Sisig',
        'Fried Chicken',
        'Sinigang (PORK)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp'
    ],
    
    'Sugar': [
        'Korean Spicy Bulgogi (Pork)',
        'Pork Adobo',
        'Chicken Adobo',
        'Sizzling Pork Sisig',
        'Cucumber Lemonade (Glass)',
        'Cucumber Lemonade (Pitcher)',
        'Blue Lemonade (Glass)',
        'Blue Lemonade (Pitcher)',
        'Red Tea (Glass)',
        'Matcha Green Tea HC',
        'Matcha Green Tea MC',
        'Milk Tea Regular HC',
        'Milk Tea Regular MC'
    ],
    
    'Brown sugar': [
    ],
    
    'Vinegar': [
    ],
    
    'Water': [
    ],
    
    // ===== DAIRY & EGGS =====
    'Eggs': [
        'Fried Rice',
        'Omelette',
        'Scrambled Eggs'
    ],
    
    'Butter': [
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Buttered Shrimp',
        'Garlic Bread'
    ],
    
    'Milk': [
        'Milk Tea Regular HC',
        'Milk Tea Regular MC',
        'Cafe Americano Tall',
        'Cafe Americano Grande',
        'Cafe Latte Tall',
        'Cafe Latte Grande',
        'Caramel Macchiato Tall',
        'Caramel Macchiato Grande',
        'Matcha Green Tea HC',
        'Matcha Green Tea MC',
        'Cookies & Cream HC',
        'Cookies & Cream MC',
        'Strawberry & Cream HC',
        'Mango cheese cake HC'
    ],
    
    'Cheese': [
        'Cheesy Nachos',
        'Nachos Supreme',
        'Cheesy Dynamite Lumpia'
    ],
    
    // ===== BEVERAGES =====
    'Coke': [
        'Soda (Mismo)',
        'Soda 1.5L'
    ],
    
    'Sprite': [
        'Soda (Mismo)',
        'Soda 1.5L'
    ],
    
    // ===== PACKAGING (These prevent items if out of stock) =====
    'Paper cups': [
        'Cafe Americano Tall',
        'Cafe Americano Grande',
        'Cafe Latte Tall',
        'Cafe Latte Grande',
        'Caramel Macchiato Tall',
        'Caramel Macchiato Grande',
        'Milk Tea Regular HC',
        'Milk Tea Regular MC',
        'Matcha Green Tea HC',
        'Matcha Green Tea MC',
        'Cookies & Cream HC',
        'Cookies & Cream MC',
        'Strawberry & Cream HC',
        'Mango cheese cake HC',
        'Cucumber Lemonade (Glass)',
        'Blue Lemonade (Glass)',
        'Red Tea (Glass)'
    ],
    
    'Straws': [
        'Milk Tea Regular HC',
        'Milk Tea Regular MC',
        'Matcha Green Tea HC',
        'Matcha Green Tea MC',
        'Cookies & Cream HC',
        'Cookies & Cream MC',
        'Strawberry & Cream HC',
        'Mango cheese cake HC',
        'Cucumber Lemonade (Glass)',
        'Cucumber Lemonade (Pitcher)',
        'Blue Lemonade (Glass)',
        'Blue Lemonade (Pitcher)',
        'Red Tea (Glass)'
    ],
    
    'Napkins': [
        'Korean Spicy Bulgogi (Pork)',
        'Korean Salt and Pepper (Pork)',
        'Crisky Pork Lechon Kawali',
        'Cream Dory Fish Fillet',
        'Buttered Honey Chicken',
        'Buttered Spicy Chicken',
        'Chicken Adobo',
        'Pork Adobo',
        'Sizzling Fried Chicken',
        'Sizzling Pork Sisig',
        'Sizzling Liempo',
        'Sizzling Porkchop',
        'Cheesy Nachos',
        'Nachos Supreme',
        'French fries',
        'Clubhouse Sandwich',
        'Fish and Fries',
        'Cheesy Dynamite Lumpia',
        'Lumpiang Shanghai',
        'Pork Shanghai',
        'Tinapa Rice',
        'Tuyo Pesto',
        'Sinigang (PORK)',
        'Sinigang (Shrimp)',
        'Paknet (Pakbet w/ Bagnet)',
        'Buttered Shrimp',
        'Special Bulalo (good for 2-3 Persons)',
        'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)',
        'Fried Chicken'
    ]
};

// Menu Database - Keep this section exactly as is
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

// Category to display name mapping
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

// Category-specific units mapping
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

// Unit display labels
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
    
    // Connect to real-time notifications from admin events
    connectToAdminEvents();
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize categories dropdown
    initializeCategoryDropdown();
    
    // Pre-load inventory cache for menu filtering
    console.log('📦 Pre-loading inventory for menu filtering...');
    await getInventoryCache();
    
    // Check and disable buttons based on inventory
    updateAddButtonStates();
    
    // Try to load from localStorage first
    loadFromLocalStorage();
    
    // Show dashboard section with current data
    showSection('dashboard');
    
    // Then try to fetch from API
    fetchMenuItems().then(() => {
        console.log('✅ Data loaded, dashboard updated');
        // Re-show dashboard to ensure data is rendered
        showSection('dashboard');
    }).catch(error => {
        console.error('❌ Error loading menu items:', error);
    });
    
    // Set up auto-refresh of menu items
    setInterval(fetchMenuItems, 30000);
    
    // Set up periodic check of button states (every 15 seconds)
    setInterval(updateAddButtonStates, 15000);
    
    // Set up periodic inventory cache refresh (every 5 seconds)
    setInterval(getInventoryCache, INVENTORY_CACHE_DURATION);
    
    // Load pending stock requests for notifications
    loadPendingStockRequests();
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
            
            // Update UI with localStorage data
            updateAllUIComponents();
            
            const lastUpdate = localStorage.getItem('menuItems_lastUpdate');
            if (lastUpdate) {
                const updateTime = new Date(lastUpdate).toLocaleString();
                console.log('📅 Last update from server:', updateTime);
            }
        } else {
            console.log('📭 No localStorage backup found');
            allMenuItems = [];
        }
    } catch (error) {
        console.error('❌ Error loading from localStorage:', error);
        allMenuItems = [];
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

// ==================== REAL-TIME EVENTS (EventSource) ====================
function connectToAdminEvents() {
    try {
        const eventSource = new EventSource(`${BACKEND_URL}/api/admin/events`);
        
        eventSource.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Real-time notification received:', data);
                
                // Handle stock request notifications
                if (data.type === 'stock_request') {
                    handleStockRequestNotification(data);
                }
                // Handle other notification types
                else if (data.type === 'low_stock_alert') {
                    handleLowStockAlert(data);
                }
                // Handle connection confirmation
                else if (data.type === 'connected') {
                    console.log('✅ Connected to admin real-time updates');
                }
            } catch (error) {
                console.error('Error parsing event data:', error);
            }
        });
        
        eventSource.addEventListener('error', function(error) {
            console.error('❌ EventSource connection error:', error);
            eventSource.close();
            // Attempt to reconnect after 5 seconds
            setTimeout(connectToAdminEvents, 5000);
        });
        
        console.log('🔌 Connected to real-time admin events');
    } catch (error) {
        console.error('Error connecting to admin events:', error);
        // Retry connection after 5 seconds
        setTimeout(connectToAdminEvents, 5000);
    }
}

function handleStockRequestNotification(data) {
    // Add notification to the notification center
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

    // Show toast notification
    const priorityEmoji = {
        'normal': '📦',
        'urgent': '⚠️',
        'asap': '🔴'
    }[data.priority] || '📦';

    showToast(`${priorityEmoji} Stock request: ${data.productName} (${data.requestedQuantity} ${data.unit})`, 'info');

    console.log(`✅ Stock request notification handled for ${data.productName}`);
}

function handleLowStockAlert(data) {
    // Add notification for low stock alerts
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

// ==================== NOTIFICATION SYSTEM ====================
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
        
        .toast-success {
            background: #28a745;
        }
        
        .toast-error {
            background: #dc3545;
        }
        
        .toast-warning {
            background: #ffc107;
            color: #212529;
        }
        
        .toast-info {
            background: #17a2b8;
        }
        
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

        .notification-badge {
            position: absolute;
            top: 0;
            right: 0;
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
            border: 2px solid white;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 20px;
            margin: 0;
            padding: 0;
            list-style: none;
        }

        .nav-link {
            color: #333;
            text-decoration: none;
            padding: 8px 12px;
            border-radius: 4px;
            transition: background 0.2s;
        }

        .nav-link:hover {
            background: rgba(0,0,0,0.05);
        }

        .nav-link.active {
            background: #007bff;
            color: white;
        }

        .nav-link.active i,
        .nav-link.active span {
            color: white;
        }
    `;
    document.head.appendChild(style);
}

function initializeNotificationSystem() {
    // Find the nav-links container
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) {
        console.warn('⚠️ nav-links element not found');
        return;
    }
    
    // Remove existing notification nav item if it exists
    const existingNavItem = document.getElementById('notificationNavItem');
    if (existingNavItem) {
        existingNavItem.remove();
    }
    
    // Create notification nav item
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
    
    // Create notification container
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
        headerTitle.style.cssText = `margin: 0; font-size: 16px; font-weight: 600; color: #333;`;
        
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
        clearAllBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(220,53,69,0.1)';
        });
        clearAllBtn.addEventListener('mouseleave', function() {
            this.style.background = 'none';
        });
        clearAllBtn.addEventListener('click', clearAllNotifications);
        
        notificationHeader.appendChild(headerTitle);
        notificationHeader.appendChild(clearAllBtn);
        
        const notificationList = document.createElement('div');
        notificationList.id = 'notificationList';
        notificationList.style.cssText = `flex: 1; overflow-y: auto; max-height: 400px;`;
        
        const emptyState = document.createElement('div');
        emptyState.id = 'notificationEmptyState';
        emptyState.style.cssText = `padding: 30px 20px; text-align: center; color: #666;`;
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
        closeBtn.addEventListener('mouseenter', function() {
            this.style.background = '#e9ecef';
        });
        closeBtn.addEventListener('mouseleave', function() {
            this.style.background = '#f8f9fa';
        });
        closeBtn.addEventListener('click', toggleNotificationModal);
        
        notificationContainer.appendChild(notificationHeader);
        notificationContainer.appendChild(notificationList);
        notificationContainer.appendChild(closeBtn);
        
        document.body.appendChild(notificationContainer);
    }
}

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
        
        // Mark all notifications as read
        notifications.forEach(notification => {
            notification.read = true;
        });
        
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
        
        const productName = document.createElement('div');
        productName.style.cssText = `font-weight: 600; color: #333; margin-bottom: 5px; font-size: 14px;`;
        productName.textContent = notification.productName || 'System Notification';
        
        const message = document.createElement('div');
        message.style.cssText = `color: #666; font-size: 13px; margin-bottom: 5px;`;
        message.textContent = notification.message;
        
        const timestamp = document.createElement('div');
        timestamp.style.cssText = `color: #999; font-size: 12px; display: flex; justify-content: space-between;`;
        timestamp.innerHTML = `
            <span>${notification.date} ${notification.timestamp}</span>
            ${!notification.read ? '<span style="color: #ff9800;">●</span>' : ''}
        `;
        
        notificationItem.appendChild(productName);
        notificationItem.appendChild(message);
        notificationItem.appendChild(timestamp);
        
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

function checkOutOfStockItems() {
    if (!allMenuItems || allMenuItems.length === 0) return;
    
    const outOfStockItems = allMenuItems.filter(item => item.currentStock === 0);
    
    outOfStockItems.forEach(item => {
        const recentNotification = notifications.find(n => 
            n.productName === (item.name || item.itemName) && 
            n.message.includes('out of stock') &&
            (Date.now() - n.id) < 3600000
        );
        
        if (!recentNotification) {
            addNotification(
                item.name || item.itemName,
                'Out of stock',
                'warning'
            );
        }
    });
}

// ==================== FIXED EVENT LISTENERS ====================
function initializeEventListeners() {
    console.log('🔌 Initializing event listeners...');
    
    // Add new item button
    if (elements.addNewItem) {
        elements.addNewItem.addEventListener('click', openAddModal);
        console.log('✅ Add new item button listener added');
    }
    
    // Add first item buttons (empty state buttons)
    const addFirstItemBtn = document.getElementById('addFirstItemBtn');
    if (addFirstItemBtn) {
        addFirstItemBtn.addEventListener('click', openAddModal);
        console.log('✅ Add first item button listener added');
    }
    
    const addFirstMenuBtn = document.getElementById('addFirstMenuBtn');
    if (addFirstMenuBtn) {
        addFirstMenuBtn.addEventListener('click', openAddModal);
        console.log('✅ Add first menu button listener added');
    }
    
    // Save item button
    if (elements.saveItemBtn) {
        elements.saveItemBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            await handleSaveItem();
        });
        console.log('✅ Save item button listener added');
    }
    
    // Cancel and close modal buttons
    if (elements.cancelBtn) {
        elements.cancelBtn.addEventListener('click', closeModal);
    }
    
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeModal);
    }
    
    // Category change listener - FIXED
    if (elements.itemCategory) {
        elements.itemCategory.addEventListener('change', function() {
            updateFromCategory();
            // Clear item name when category changes
            if (elements.itemName) {
                elements.itemName.value = '';
            }
            if (elements.itemUnit) {
                elements.itemUnit.value = '';
            }
            if (elements.itemPrice) {
                elements.itemPrice.value = '';
            }
        });
        console.log('✅ Category change listener added');
    }
    
    // Product name change listener - FIXED
    if (elements.itemName) {
        elements.itemName.addEventListener('change', function() {
            console.log('Item name changed:', this.value);
            updateFromItemNameSelect();
        });
        console.log('✅ Product name change listener added');
    }
    
    // Modal overlay click
    if (elements.itemModal) {
        elements.itemModal.addEventListener('click', (e) => {
            if (e.target === elements.itemModal) {
                closeModal();
            }
        });
    }
    
    // Form submit
    if (elements.itemForm) {
        elements.itemForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleSaveItem();
        });
    }
    
    // Navigation
    if (elements.navLinks && elements.navLinks.length > 0) {
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                showSection(section);
            });
        });
        console.log('✅ Navigation listeners added');
    }
    
    // Category filter
    if (elements.categoryItems && elements.categoryItems.length > 0) {
        elements.categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const category = item.getAttribute('data-category');
                const fullname = item.getAttribute('data-fullname');
                filterByCategory(category, fullname);
            });
        });
        console.log('✅ Category filter listeners added');
    }
    
    console.log('✅ All event listeners initialized');
}

// ==================== HELPER FUNCTIONS ====================
function getUnitFromItem(itemName, category) {
    for (const cat in menuDatabase) {
        const foundItem = menuDatabase[cat].find(item => item.name === itemName);
        if (foundItem) {
            return foundItem.unit;
        }
    }
    
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
    
    return defaultUnits[category] || 'unit';
}

function getDefaultPrice(itemName) {
    for (const category in menuDatabase) {
        const foundItem = menuDatabase[category].find(item => item.name === itemName);
        if (foundItem) {
            return foundItem.defaultPrice;
        }
    }
    return 0;
}

function getCategoryDisplayName(category) {
    return categoryDisplayNames[category] || category;
}

// FIXED: Better populate function
function populateItemNamesByCategory(category = null) {
    const itemNameSelect = elements.itemName;
    if (!itemNameSelect) return;
    
    itemNameSelect.innerHTML = '<option value="">Select Product</option>';
    
    if (!category || category.trim() === '') {
        console.log('No category selected for populating items');
        return;
    }
    
    const categoryItems = menuDatabase[category] || [];
    console.log(`Found ${categoryItems.length} items for category: ${category}`);
    
    if (categoryItems.length === 0) {
        console.warn(`No items found for category: ${category}`);
        return;
    }
    
    const sortedItems = [...categoryItems].sort((a, b) => a.name.localeCompare(b.name));
    
    sortedItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = item.name;
        option.dataset.unit = item.unit;
        option.dataset.price = item.defaultPrice;
        itemNameSelect.appendChild(option);
    });
    
    console.log(`📋 Populated ${sortedItems.length} items for category: ${category}`);
}

// FIXED: Better update from item name
function updateFromItemNameSelect() {
    const itemName = elements.itemName.value;
    console.log('updateFromItemNameSelect called with:', itemName);
    
    if (!itemName || itemName.trim() === '' || itemName === 'Select Product') {
        console.log('No item selected');
        if (elements.itemUnit) elements.itemUnit.value = '';
        if (elements.itemPrice) elements.itemPrice.value = '';
        return;
    }
    
    const selectedOption = elements.itemName.options[elements.itemName.selectedIndex];
    console.log('Selected option:', selectedOption);
    
    const unit = selectedOption.dataset.unit;
    const price = selectedOption.dataset.price;
    
    console.log('Unit from dataset:', unit, 'Price from dataset:', price);
    
    if (unit && elements.itemUnit) {
        elements.itemUnit.value = unit;
        console.log('Set unit to:', unit);
    }
    
    if (price && elements.itemPrice) {
        elements.itemPrice.value = price;
        console.log('Set price to:', price);
    }
    
    // Also try to get from menuDatabase as fallback
    if (!unit || !price) {
        console.log('Falling back to menuDatabase lookup');
        for (const category in menuDatabase) {
            const foundItem = menuDatabase[category].find(item => item.name === itemName);
            if (foundItem) {
                if (!unit && elements.itemUnit) {
                    elements.itemUnit.value = foundItem.unit;
                    console.log('Set unit from menuDatabase:', foundItem.unit);
                }
                if (!price && elements.itemPrice) {
                    elements.itemPrice.value = foundItem.defaultPrice;
                    console.log('Set price from menuDatabase:', foundItem.defaultPrice);
                }
                break;
            }
        }
    }
}

// FIXED: Better update from category
function updateFromCategory() {
    const category = elements.itemCategory.value;
    console.log('updateFromCategory called with:', category);
    
    if (!category || category.trim() === '' || category === 'Select Category') {
        console.log('No category selected');
        if (elements.itemName) {
            elements.itemName.innerHTML = '<option value="">Select Product</option>';
        }
        if (elements.itemUnit) elements.itemUnit.value = '';
        if (elements.itemPrice) elements.itemPrice.value = '';
        return;
    }
    
    updateUnitOptions(category);
    populateItemNamesByCategory(category);
    
    // Reset values
    if (elements.itemName) {
        elements.itemName.value = '';
        console.log('Reset item name');
    }
    if (elements.itemUnit) {
        elements.itemUnit.value = '';
        console.log('Reset unit');
    }
    if (elements.itemPrice) {
        elements.itemPrice.value = '';
        console.log('Reset price');
    }
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
    
    console.log(`Updated unit options for ${category}: ${availableUnits.join(', ')}`);
}

function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
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
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return new Intl.NumberFormat('en-US').format(num);
}

function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) {
        return '₱0.00';
    }
    
    const numAmount = parseFloat(amount);
    return '₱' + numAmount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// ==================== FETCH FUNCTION ====================
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
        
        console.log('📡 API Response status:', response.status);
        
        if (response.status === 401) {
            console.warn('⚠️ Unauthorized - using localStorage data only');
            showToast('Session expired. Please login again.', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
            return;
        }
        
        if (!response.ok) {
            console.warn(`⚠️ API error ${response.status} - using localStorage data`);
            
            // Try to get error message from response
            const errorText = await response.text();
            console.error('❌ Server response:', errorText.substring(0, 200));
            
            // Show user-friendly message based on status
            if (response.status === 404) {
                showToast('API endpoint not found. Please check server configuration.', 'error');
            } else if (response.status === 500) {
                showToast('Server error. Please try again later.', 'error');
            }
            
            return;
        }
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.warn('⚠️ Response is not JSON, got:', text.substring(0, 200));
            
            // Check if it's an HTML error page
            if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
                console.error('❌ Server returned HTML error page instead of JSON');
                showToast('Server configuration error. Please contact administrator.', 'error');
            }
            return;
        }
        
        const data = await response.json();
        console.log('✅ API Response received:', data);
        
        if (data && data.success) {
            allMenuItems = data.data || [];
            console.log(`✅ ${allMenuItems.length} items loaded from API`);
            
            // Save to localStorage
            saveToLocalStorage();
            
            // Update all UI components
            updateAllUIComponents();
            
            retryCount = 0;
            
        } else {
            const errorMsg = data ? (data.message || 'Unknown error') : 'No data received';
            console.error('❌ API returned error:', errorMsg);
            showToast(`Error: ${errorMsg}`, 'error');
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
        console.log('💾 Saved to localStorage');
    } catch (error) {
        console.warn('⚠️ Could not save to localStorage:', error);
    }
}

// ==================== CORE FUNCTIONS ====================
function updateDashboardStats() {
    console.log('📊 Updating dashboard stats...');
    
    if (!allMenuItems || !Array.isArray(allMenuItems)) {
        console.warn('⚠️ allMenuItems is not an array or is empty');
        // Set all to 0
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
    
    const outOfStockItems = allMenuItems.filter(item => {
        const currentStock = item.currentStock || 0;
        return currentStock === 0;
    }).length;
    
    const inStockItems = allMenuItems.filter(item => {
        const currentStock = item.currentStock || 0;
        const minStock = item.minStock || 0;
        return currentStock > minStock;
    }).length;
    
    const menuValueTotal = allMenuItems.reduce((total, item) => {
        const price = item.price || 0;
        const stock = item.currentStock || 0;
        return total + (price * stock);
    }, 0);
    
    // Update UI with correct element IDs
    const totalEl = document.getElementById('totalProducts');
    const lowEl = document.getElementById('lowStock');
    const outEl = document.getElementById('outOfStock');
    const inEl = document.getElementById('inStock');
    const valueEl = document.getElementById('menuValue');
    
    if (totalEl) {
        totalEl.textContent = formatNumber(totalMenuItems);
        console.log('✅ Total Products:', totalMenuItems);
    }
    
    if (lowEl) {
        lowEl.textContent = formatNumber(lowStockItems);
        console.log('✅ Low Stock:', lowStockItems);
    }
    
    if (outEl) {
        outEl.textContent = formatNumber(outOfStockItems);
        console.log('✅ Out of Stock:', outOfStockItems);
    }
    
    if (inEl) {
        inEl.textContent = formatNumber(inStockItems);
        console.log('✅ In Stock:', inStockItems);
    }
    
    if (valueEl) {
        valueEl.textContent = formatCurrency(menuValueTotal);
        console.log('✅ Menu Value: ₱', menuValueTotal);
    }
    
    checkOutOfStockItems();
}

function showSection(section) {
    document.querySelectorAll('.section-content').forEach(sec => {
        sec.classList.remove('active-section');
    });
    
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active-section');
    }
    
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
// Check if a menu item can be made (all required ingredients in stock)
async function canMenuItemBeMade(itemName) {
    try {
        // Get the recipe mapping from recipeMapping
        if (!recipeMapping) {
            console.warn('⚠️ Recipe mapping not available');
            return true; // If no recipe mapping, assume it can be made
        }
        
        // Find which ingredients this menu item requires
        let requiredIngredients = [];
        for (const ingredient in recipeMapping) {
            if (recipeMapping[ingredient].includes(itemName)) {
                requiredIngredients.push(ingredient);
            }
        }
        
        // If no recipe found, it can be made (e.g., packaging items)
        if (requiredIngredients.length === 0) {
            return true;
        }
        
        // Get cached inventory or fetch if needed
        const inventoryItems = await getInventoryCache();
        
        // Check if ALL required ingredients are in stock
        let allInStock = true;
        requiredIngredients.forEach(ingredient => {
            const inventoryItem = inventoryItems.find(item => item.itemName === ingredient);
            const stock = inventoryItem ? parseFloat(inventoryItem.currentStock || 0) : 0;
            
            if (stock <= 0) {
                allInStock = false;
            }
        });
        
        return allInStock;
    } catch (error) {
        console.error('❌ Error checking if item can be made:', error);
        return true; // If error, assume it can be made
    }
}

// Get inventory from cache or fetch if cache is outdated
async function getInventoryCache() {
    try {
        const now = Date.now();
        
        // If cache is fresh, return it
        if (currentInventoryCache.length > 0 && (now - lastInventoryCacheTime) < INVENTORY_CACHE_DURATION) {
            return currentInventoryCache;
        }
        
        // Fetch fresh inventory
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
            return currentInventoryCache; // Return cached data if fetch fails
        }
        
        const inventoryData = await inventoryResponse.json();
        const inventoryItems = inventoryData.data || inventoryData || [];
        
        // Update cache
        currentInventoryCache = inventoryItems;
        lastInventoryCacheTime = now;
        
        return inventoryItems;
    } catch (error) {
        console.error('❌ Error getting inventory cache:', error);
        return currentInventoryCache;
    }
}

function renderMenuGrid() {
    console.log('🎨 Rendering menu grid...');
    console.log('📊 Current category:', currentCategory);
    console.log('📦 Total items in allMenuItems:', allMenuItems ? allMenuItems.length : 0);
    
    if (!elements.menuGrid) {
        console.error('❌ menuGrid element not found');
        return;
    }
    
    if (!allMenuItems || !Array.isArray(allMenuItems) || allMenuItems.length === 0) {
        console.log('📭 No items to display');
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
        console.log(`🔍 Filtered items for ${currentCategory}:`, filteredItems.length);
    }
    
    if (filteredItems.length === 0) {
        console.log('📭 No items to display for this category');
        elements.menuGrid.innerHTML = `
            <div class="empty-state">
                <h3>No products in this category</h3>
                <p>Add products to this category using the "Add New Product" button</p>
            </div>
        `;
        return;
    }
    
    console.log(`🎯 Rendering ${filteredItems.length} items`);
    
    // Filter items to only show those that can be made (all ingredients in stock)
    let availableItems = filteredItems.filter(item => {
        const itemName = item.name || item.itemName || 'Unnamed Product';
        
        // Get required ingredients for this item
        let requiredIngredients = [];
        if (recipeMapping) {
            for (const ingredient in recipeMapping) {
                if (recipeMapping[ingredient].includes(itemName)) {
                    requiredIngredients.push(ingredient);
                }
            }
        }
        
        // If no recipe, show it (e.g., packaging items)
        if (requiredIngredients.length === 0) {
            return true;
        }
        
        // Check if all required ingredients are in stock using cached inventory
        let canBeMade = true;
        requiredIngredients.forEach(ingredient => {
            const inventoryItem = currentInventoryCache.find(inv => inv.itemName === ingredient);
            const stock = inventoryItem ? parseFloat(inventoryItem.currentStock || 0) : 0;
            
            if (stock <= 0) {
                canBeMade = false;
            }
        });
        
        return canBeMade;
    });
    
    if (availableItems.length === 0) {
        console.log('📭 No items can be made with current inventory');
        elements.menuGrid.innerHTML = `
            <div class="empty-state">
                <h3>⚠️ No Available Products</h3>
                <p>Some or all required ingredients are out of stock</p>
                <p>Please restock ingredients in Inventory to make these items available</p>
            </div>
        `;
        return;
    }
    
    const gridHTML = availableItems.map(item => {
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
        if (currentStock === 0) {
            stockClass = 'out-of-stock';
        } else if (currentStock <= minStock) {
            stockClass = 'low-stock';
        }
        
        return `
        <div class="menu-card ${stockClass}">
            <div class="card-header">
                <h4>${itemName}</h4>
                <div class="card-actions">
                    <button class="btn-icon" onclick="openEditModal('${item._id}')">Edit</button>
                    <button class="btn-icon delete" onclick="deleteMenuItem('${item._id}')">Delete</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <span class="label">Category:</span> ${getCategoryDisplayName(item.category)}
                </div>
                <div class="card-info">
                    <span class="label">Current Stock:</span> ${currentStock} ${displayUnit}
                </div>
                <div class="card-info">
                    <span class="label">Selling Price:</span> ₱${itemPrice.toFixed(2)}
                </div>
                <div class="card-info">
                    <span class="label">Stock Value:</span> ₱${itemValue.toFixed(2)}
                </div>
                <div class="card-info">
                    <span class="label">Min Stock:</span> ${minStock} ${displayUnit}
                </div>
                <div class="card-info">
                    <span class="label">Max Stock:</span> ${maxStock} ${displayUnit}
                </div>
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
                <h4>${itemName}</h4>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <span class="label">Stock:</span> ${currentStock}/${maxStock} ${displayUnit}
                </div>
                <div class="card-info">
                    <span class="label">Value:</span> ₱${itemValue.toFixed(2)}
                </div>
                <div class="card-info">
                    <span class="label">Min:</span> ${minStock} ${displayUnit}
                </div>
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

// ==================== UPDATED CATEGORY COUNTS FUNCTION ====================
function updateCategoryCounts() {
    console.log('📊 Updating category counts...');
    console.log('📦 Total items:', allMenuItems ? allMenuItems.length : 0);
    
    if (!allMenuItems || !Array.isArray(allMenuItems)) {
        console.warn('⚠️ allMenuItems is not an array or is empty');
        return;
    }
    
    // Calculate counts for each category
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
    
    console.log('📈 Calculated category counts:', categories);
    
    // Update each category item
    if (elements.categoryItems && elements.categoryItems.length > 0) {
        elements.categoryItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const countElement = item.querySelector('.category-count');
            
            if (countElement) {
                const count = categories[category] || 0;
                countElement.textContent = count;
                console.log(`✅ Updated ${category}: ${count}`);
            } else {
                console.warn(`⚠️ No count element found for category: ${category}`);
            }
        });
    } else {
        console.warn('⚠️ No category items found in DOM');
    }
}

// ==================== FIXED MODAL FUNCTIONS ====================

// Check if ANY ingredients have stock (at least one ingredient > 0)
async function checkIfAnyIngredientsInStock() {
    try {
        console.log('🔍 Checking if any ingredients are in stock...');
        
        // Fetch current inventory from API
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
            return false;
        }
        
        const inventoryData = await inventoryResponse.json();
        const inventoryItems = inventoryData.data || inventoryData || [];
        
        console.log(`📦 Found ${inventoryItems.length} inventory items`);
        
        // Check if ANY item has stock > 0
        const hasStock = inventoryItems.some(item => {
            const currentStock = parseFloat(item.currentStock || item.stock || 0);
            return currentStock > 0;
        });
        
        console.log(`📊 Has in-stock items: ${hasStock}`);
        
        return hasStock;
    } catch (error) {
        console.error('❌ Error checking inventory:', error);
        return false;
    }
}

// Update button disabled states based on inventory
async function updateAddButtonStates() {
    try {
        console.log('🔘 Updating Add button states based on inventory...');
        
        const hasInStock = await checkIfAnyIngredientsInStock();
        
        // Get all add buttons
        const addNewItemBtn = document.getElementById('addNewItem');
        const addFirstItemBtn = document.getElementById('addFirstItemBtn');
        const addFirstMenuBtn = document.getElementById('addFirstMenuBtn');
        
        const buttons = [addNewItemBtn, addFirstItemBtn, addFirstMenuBtn].filter(btn => btn !== null);
        
        if (hasInStock) {
            // Enable buttons
            console.log('✅ Enabling Add buttons - inventory has stock');
            buttons.forEach(btn => {
                btn.disabled = false;
                btn.title = 'Click to add a new product';
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            });
        } else {
            // Disable buttons
            console.log('❌ Disabling Add buttons - all ingredients out of stock');
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

function openAddModal() {
    if (isModalOpen) return;
    
    // Check if any ingredients are in stock
    const hasInStockIngredients = checkIfAnyIngredientsInStock();
    
    if (!hasInStockIngredients) {
        showToast('⚠️ Cannot add new product - All ingredients are out of stock. Please restock inventory first.', 'warning');
        alert('Cannot add new product!\n\nAll required ingredients are out of stock.\n\nPlease restock the inventory before adding new menu items.');
        return;
    }
    
    isModalOpen = true;
    const modal = elements.itemModal;
    
    if (elements.modalTitle) elements.modalTitle.textContent = 'Add New Product';
    if (elements.itemForm) elements.itemForm.reset();
    if (elements.itemId) elements.itemId.value = '';
    
    // Set default values
    if (elements.currentStock) elements.currentStock.value = '0';
    if (elements.minimumStock) elements.minimumStock.value = '20';
    if (elements.maximumStock) elements.maximumStock.value = '200';
    if (elements.itemPrice) elements.itemPrice.value = '';
    
    // Reset category and unit
    if (elements.itemCategory) {
        elements.itemCategory.value = '';
        // Force update of dropdowns
        updateFromCategory();
    }
    
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
        // Focus on category first
        if (elements.itemCategory) {
            elements.itemCategory.focus();
        }
    }, 10);
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
    
    console.log('Editing item:', item);
    
    // Set category first, then populate other fields
    if (elements.itemCategory) {
        elements.itemCategory.value = item.category;
        console.log('Set category to:', item.category);
        
        // Update unit options first
        updateUnitOptions(item.category);
        
        // Then populate item names
        populateItemNamesByCategory(item.category);
        
        // Set values after dropdowns are populated
        setTimeout(() => {
            if (elements.itemName) {
                // Find the option that matches the item name
                for (let i = 0; i < elements.itemName.options.length; i++) {
                    if (elements.itemName.options[i].value === item.name || elements.itemName.options[i].value === item.itemName) {
                        elements.itemName.selectedIndex = i;
                        console.log('Set item name to:', elements.itemName.value);
                        break;
                    }
                }
                
                // If not found in dropdown, set the value directly
                if (!elements.itemName.value && (item.name || item.itemName)) {
                    // Create a new option if it doesn't exist
                    const option = document.createElement('option');
                    option.value = item.name || item.itemName;
                    option.textContent = item.name || item.itemName;
                    elements.itemName.appendChild(option);
                    elements.itemName.value = item.name || item.itemName;
                    console.log('Created and set custom item name:', elements.itemName.value);
                }
            }
            
            if (elements.itemUnit) {
                elements.itemUnit.value = item.unit || '';
                console.log('Set unit to:', elements.itemUnit.value);
            }
            
            if (elements.itemPrice) {
                elements.itemPrice.value = item.price || '';
                console.log('Set price to:', elements.itemPrice.value);
            }
            
            if (elements.currentStock) {
                elements.currentStock.value = item.currentStock || 0;
                console.log('Set current stock to:', elements.currentStock.value);
            }
            
            if (elements.minimumStock) {
                elements.minimumStock.value = item.minStock || 20;
                console.log('Set min stock to:', elements.minimumStock.value);
            }
            
            if (elements.maximumStock) {
                elements.maximumStock.value = item.maxStock || 200;
                console.log('Set max stock to:', elements.maximumStock.value);
            }
            
            // Trigger change event to update unit and price if needed
            if (elements.itemName) {
                elements.itemName.dispatchEvent(new Event('change'));
            }
        }, 150); // Increased delay to ensure dropdowns are populated
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

// ==================== AVAILABILITY CHECK FUNCTION ====================
// Check if a menu item can be created/edited based on ingredient availability
async function checkMenuItemAvailability(itemName) {
    try {
        console.log('═══════════════════════════════════════════════════');
        console.log('🔵 AVAILABILITY CHECK STARTED for:', itemName);
        console.log('═══════════════════════════════════════════════════');
        
        // Get the recipe mapping from inventory.js
        // recipeMapping maps ingredients to menu items
        // We need to find which ingredients this menu item requires
        
        // First, check if we have access to recipeMapping
        let requiredIngredients = [];
        
        console.log('📋 recipeMapping available?', typeof recipeMapping !== 'undefined');
        
        // Look for the menu item in recipeMapping to find its required ingredients
        if (typeof recipeMapping !== 'undefined' && recipeMapping) {
            console.log('🔎 Searching recipeMapping for:', itemName);
            for (const ingredient in recipeMapping) {
                const menuItems = recipeMapping[ingredient];
                if (menuItems.includes(itemName)) {
                    console.log('  ✓ Found in:', ingredient);
                    requiredIngredients.push(ingredient);
                }
            }
        } else {
            console.warn('⚠️ Recipe mapping not found. Availability check skipped.');
            return { available: true, missingIngredients: [] };
        }
        
        console.log('📦 Required ingredients:', requiredIngredients);
        
        if (requiredIngredients.length === 0) {
            console.log(`✅ No recipe found for "${itemName}" - allowing creation (may be a packaging item)`);
            return { available: true, missingIngredients: [] };
        }
        
        console.log(`🔍 Checking ingredients for "${itemName}": ${requiredIngredients.join(', ')}`);
        
        // Fetch current inventory from API
        console.log('📡 Fetching inventory from /api/inventory...');
        const inventoryResponse = await fetch('/api/inventory', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        console.log('📡 Inventory API response status:', inventoryResponse.status);
        
        if (!inventoryResponse.ok) {
            console.warn('⚠️ Could not fetch inventory data (status:', inventoryResponse.status, '). Allowing save with warning.');
            return { available: true, missingIngredients: [] };
        }
        
        const inventoryData = await inventoryResponse.json();
        console.log('📦 Inventory data received:', inventoryData);
        
        const inventoryItems = inventoryData.data || inventoryData || [];
        console.log('📊 Number of inventory items:', inventoryItems.length);
        console.log('📋 Sample inventory item:', inventoryItems[0]);
        
        // Check if all required ingredients are in stock
        const missingIngredients = [];
        
        requiredIngredients.forEach(ingredient => {
            console.log(`\n  🔍 Checking ingredient: "${ingredient}"`);
            
            const inventoryItem = inventoryItems.find(item => {
                const nameMatch = item.itemName === ingredient || 
                                item.name === ingredient ||
                                (item.name && item.name.toLowerCase() === ingredient.toLowerCase());
                
                console.log(`    Comparing with: "${item.itemName || item.name}" → Match: ${nameMatch}`);
                return nameMatch;
            });
            
            console.log(`    Found item:`, inventoryItem ? 'YES' : 'NO');
            
            if (inventoryItem) {
                const stock = inventoryItem.currentStock !== undefined ? inventoryItem.currentStock : (inventoryItem.stock || 0);
                console.log(`    Stock level: ${stock}`);
            }
            
            // Check if item doesn't exist OR if stock is 0 or less
            const currentStock = inventoryItem ? (inventoryItem.currentStock !== undefined ? parseFloat(inventoryItem.currentStock) : parseFloat(inventoryItem.stock || 0)) : 0;
            
            if (!inventoryItem || currentStock <= 0) {
                console.log(`    ❌ MISSING: ${ingredient} (Stock: ${currentStock})`);
                missingIngredients.push(ingredient);
            } else {
                console.log(`    ✅ IN STOCK: ${ingredient} (Stock: ${currentStock})`);
            }
        });
        
        console.log('\n📋 Missing ingredients:', missingIngredients);
        
        if (missingIngredients.length > 0) {
            console.warn(`❌ BLOCKED: Missing ingredients for "${itemName}": ${missingIngredients.join(', ')}`);
            console.log('═══════════════════════════════════════════════════');
            return { 
                available: false, 
                missingIngredients: missingIngredients
            };
        }
        
        console.log(`✅ ALLOWED: All ingredients available for "${itemName}"`);
        console.log('═══════════════════════════════════════════════════');
        return { 
            available: true, 
            missingIngredients: []
        };
        
    } catch (error) {
        console.error('❌ Error checking availability:', error);
        console.error('Stack trace:', error.stack);
        console.log('═══════════════════════════════════════════════════');
        // On error, allow save but warn user
        showToast('Warning: Could not verify ingredient availability. Proceeding with caution.', 'warning');
        return { available: true, missingIngredients: [] };
    }
}

// ==================== FIXED SAVE FUNCTION ====================
async function handleSaveItem() {
    console.log('handleSaveItem called');
    
    // Get form data
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
    
    console.log('Form data:', formData);
    
    // Validate required fields
    if (!formData.itemName || formData.itemName.trim() === '' || formData.itemName === 'Select Product') {
        console.error('Validation failed: No item name selected');
        showToast('Please select a product from the dropdown list', 'error');
        if (elements.itemName) {
            elements.itemName.focus();
            elements.itemName.style.borderColor = '#dc3545';
        }
        return;
    } else {
        if (elements.itemName) {
            elements.itemName.style.borderColor = '';
        }
    }
    
    if (!formData.category || formData.category.trim() === '' || formData.category === 'Select Category') {
        console.error('Validation failed: No category selected');
        showToast('Please select a category from the dropdown', 'error');
        if (elements.itemCategory) {
            elements.itemCategory.focus();
            elements.itemCategory.style.borderColor = '#dc3545';
        }
        return;
    } else {
        if (elements.itemCategory) {
            elements.itemCategory.style.borderColor = '';
        }
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
        console.error('Validation failed: Invalid price', formData.price);
        showToast('Please enter a valid price (must be a number greater than 0)', 'error');
        if (elements.itemPrice) {
            elements.itemPrice.focus();
            elements.itemPrice.style.borderColor = '#dc3545';
        }
        return;
    } else {
        if (elements.itemPrice) {
            elements.itemPrice.style.borderColor = '';
        }
    }
    
    if (!formData.unit || formData.unit.trim() === '' || formData.unit === 'Select Unit') {
        console.error('Validation failed: No unit selected');
        showToast('Please select a unit from the dropdown', 'error');
        if (elements.itemUnit) {
            elements.itemUnit.focus();
            elements.itemUnit.style.borderColor = '#dc3545';
        }
        return;
    } else {
        if (elements.itemUnit) {
            elements.itemUnit.style.borderColor = '';
        }
    }
    
    // Validate stock values
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
    
    // ==================== CHECK INGREDIENT AVAILABILITY ====================
    // Only check on NEW items (not edits) to prevent admin from creating items without ingredients
    if (!formData.itemId || formData.itemId.trim() === '') {
        console.log('🔍 New menu item - checking ingredient availability...');
        const availabilityCheck = await checkMenuItemAvailability(formData.itemName);
        
        if (!availabilityCheck.available) {
            console.error('❌ Cannot create menu item - missing ingredients:', availabilityCheck.missingIngredients);
            
            const missingIngredientsList = availabilityCheck.missingIngredients.join('\n  • ');
            const errorMsg = `Cannot add "${formData.itemName}" - Missing ingredients:\n  • ${missingIngredientsList}\n\nPlease restock the missing ingredients first.`;
            
            showToast(`Cannot add "${formData.itemName}" - Missing ingredients: ${availabilityCheck.missingIngredients.join(', ')}`, 'error');
            
            // Optional: Show more detailed alert
            alert(errorMsg);
            return;
        }
        console.log('✅ All ingredients available - proceeding with save');
    } else {
        console.log('📝 Editing existing item - skipping ingredient availability check');
    }
    
    await saveMenuItem(formData);
}

async function saveMenuItem(itemData) {
    const isEdit = itemData.itemId && itemData.itemId.trim() !== '';
    
    // Disable save button during request
    const saveBtn = elements.saveItemBtn;
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saving...';
    saveBtn.disabled = true;
    
    try {
        // Create payload
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
        
        console.log('Saving payload:', payload);
        
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
        
        console.log('📡 Save API Response status:', response.status);
        
        // Check if response is HTML error page
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Server returned non-JSON response:', text.substring(0, 200));
            
            if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
                throw new Error('Server returned error page. Check API endpoint.');
            } else {
                throw new Error('Invalid server response format');
            }
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`Server error ${response.status}: ${data.message || 'Unknown error'}`);
        }
        
        if (data.success) {
            const action = isEdit ? 'updated' : 'added';
            showToast(`Product ${action} successfully!`, 'success');
            
            // Close modal
            closeModal();
            
            // Refresh data from server
            await fetchMenuItems();
            
            // ✅ AUTO-UPDATE CATEGORY COUNTS
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

// ==================== DELETE FUNCTION ====================
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
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        console.log('📡 Delete API Response status:', response.status);
        
        // Check if response is HTML error page
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('❌ Server returned non-JSON response:', text.substring(0, 200));
            
            if (text.includes('<!DOCTYPE html>') || text.includes('<html')) {
                throw new Error('Server returned error page. Check API endpoint.');
            } else {
                throw new Error('Invalid server response format');
            }
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(`Server error ${response.status}: ${data.message || 'Unknown error'}`);
        }
        
        if (data.success) {
            showToast('Product deleted successfully!', 'success');
            
            // Remove from local array
            allMenuItems = allMenuItems.filter(item => item._id !== itemId);
            
            // Update UI
            updateAllUIComponents();
            
            // ✅ AUTO-UPDATE CATEGORY COUNTS
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

// ==================== LOGOUT FUNCTION ====================
function handleLogout() {
    if (!confirm('Are you sure you want to logout?')) return;
    
    fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    .then(() => {
        window.location.href = '/login';
    })
    .catch(error => {
        console.error('Logout error:', error);
        window.location.href = '/login';
    });
}

// ==================== UPDATE ALL UI COMPONENTS ====================
function updateAllUIComponents() {
    console.log('🔄 Updating all UI components...');
    console.log('📊 Current section:', currentSection);
    
    // Update based on current section
    if (currentSection === 'dashboard') {
        updateDashboardStats();
        renderDashboardGrid();
    } else if (currentSection === 'menu') {
        renderMenuGrid();
    } else if (currentSection === 'sendstock') {
        initializeSendStockUI();
    }
    
    updateCategoryCounts();
    console.log('✅ All UI components updated');
}

// ==================== SEND STOCKS SECTION ====================
let stocksData = [];
let changes = new Map();

// Initialize Send Stock UI
async function initializeSendStockUI() {
    console.log('📦 Initializing Send Stock UI...');
    
    try {
        // Fetch actual product data from API
        console.log('⏳ Fetching products from API...');
        const response = await fetch('/api/menu', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        let itemsToDisplay = [];
        
        if (response.ok) {
            const data = await response.json();
            itemsToDisplay = data.data || [];
            console.log('✅ Loaded from API:', itemsToDisplay.length, 'items');
            console.log('📊 Sample item:', itemsToDisplay[0]);
        } else {
            throw new Error('Failed to fetch products');
        }
        
        // If API failed or returned no data, use allMenuItems or fallback
        if (!itemsToDisplay || itemsToDisplay.length === 0) {
            console.log('⚠️ API returned no data, using allMenuItems...');
            if (allMenuItems && allMenuItems.length > 0) {
                itemsToDisplay = allMenuItems;
                console.log('✅ Using allMenuItems:', itemsToDisplay.length, 'items');
            } else {
                // Fallback to menuDatabase
                console.log('⚠️ Using fallback menuDatabase...');
                itemsToDisplay = [];
                let id = 1;
                
                // Convert menuDatabase to item array
                Object.entries(menuDatabase).forEach(([category, items]) => {
                    const displayCategory = categoryDisplayNames[category] || category;
                    items.forEach(item => {
                        itemsToDisplay.push({
                            id: id++,
                            name: item.name,
                            category: displayCategory,
                            description: item.name,
                            quantity: 0,
                            price: item.defaultPrice || 0,
                            unit: item.unit || 'piece'
                        });
                    });
                });
                console.log('✅ Loaded from menuDatabase:', itemsToDisplay.length, 'items');
            }
        }
        
        // Convert to stocksData format
        stocksData = itemsToDisplay.map((item, index) => {
            // Normalize category - try to map abbreviated to full names
            let normalizedCategory = item.category;
            
            // If category is abbreviated (like "Rice"), convert to display name
            if (categoryDisplayNames[item.category]) {
                normalizedCategory = categoryDisplayNames[item.category];
            }
            
            return {
                id: index + 1,
                name: item.name,
                category: normalizedCategory,
                description: item.description || item.name || '',
                quantity: item.quantity || item.currentStock || 0,
                price: `₱${item.price || 0}.00`,
                status: (item.quantity || item.currentStock || 0) <= 0 ? 'low' : (item.quantity || item.currentStock || 0) <= 20 ? 'shipped' : 'available',
                unit: item.unit || 'piece'
            };
        });
        
        console.log('✅ stocksData prepared with', stocksData.length, 'items');
        console.log('📊 Categories in data:', [...new Set(stocksData.map(s => s.category))]);
        
        renderSendStockTable();
        attachSendStockEventListeners();
        
        console.log('✅ Send Stock UI initialized');
        
    } catch (error) {
        console.error('❌ Error initializing Send Stock UI:', error);
        showToast('Error loading products. Using default data.', 'warning');
        
        // Fallback: Use menuDatabase
        let itemsToDisplay = [];
        let id = 1;
        Object.entries(menuDatabase).forEach(([category, items]) => {
            const displayCategory = categoryDisplayNames[category] || category;
            items.forEach(item => {
                itemsToDisplay.push({
                    id: id++,
                    name: item.name,
                    category: displayCategory,
                    description: item.name,
                    quantity: 0,
                    price: item.defaultPrice || 0,
                    unit: item.unit || 'piece'
                });
            });
        });
        
        stocksData = itemsToDisplay.map((item, index) => ({
            id: index + 1,
            name: item.name,
            category: item.category,
            description: item.description || '',
            quantity: item.quantity || 0,
            price: `₱${item.price || 0}.00`,
            status: 'available',
            unit: item.unit || 'piece'
        }));
        
        console.log('✅ Fallback data loaded with', stocksData.length, 'items');
        renderSendStockTable();
        attachSendStockEventListeners();
    }
}

// Load pending stock requests from API
async function loadPendingStockRequests() {
    try {
        const response = await fetch(`${BACKEND_URL}/api/stock-requests/pending`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            const requests = data.data || [];
            
            // Add notifications for pending requests
            requests.forEach(req => {
                // Check if notification already exists
                const exists = notifications.some(n => 
                    n.type === 'stock_request' && 
                    n.data && n.data._id === req._id
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

// Render Send Stock Table
function renderSendStockTable() {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) return;
    
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const activeFilter = document.querySelector('.filter-btn.active');
    const activeFilterValue = activeFilter ? activeFilter.getAttribute('onclick')?.match(/'([^']+)'/) : null;
    const filterValue = activeFilterValue ? activeFilterValue[1] : 'all';
    
    let filteredData = stocksData;
    
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
            // Check if item category matches the filter (exact match)
            if (item.category === filterValue) return true;
            
            // Also check if the display name matches (for abbreviated categories)
            const displayName = categoryDisplayNames[item.category];
            if (displayName === filterValue) return true;
            
            return false;
        });
    }
    
    // Render rows
    tableBody.innerHTML = '';
    filteredData.forEach(stock => {
        const row = document.createElement('tr');
        
        let statusClass = 'status-available';
        let statusText = 'Available';
        
        // Determine status based on quantity
        if (stock.quantity <= 0) {
            statusClass = 'status-low';
            statusText = 'Out of Stock';
        } else if (stock.quantity <= 10) {
            statusClass = 'status-pending';
            statusText = 'Low Stock';
        } else if (stock.quantity <= 20) {
            statusClass = 'status-shipped';
            statusText = 'Medium Stock';
        }
        
        row.innerHTML = `
            <td>${stock.id}</td>
            <td><strong>${stock.name}</strong></td>
            <td>${stock.category}</td>
            <td>${stock.description}</td>
            <td>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease" onclick="decreaseQuantity(${stock.id})">-</button>
                    <input type="number" 
                           class="quantity-input" 
                           id="quantity-${stock.id}" 
                           value="${stock.quantity}" 
                           min="0" 
                           max="1000"
                           onchange="updateQuantity(${stock.id}, this.value)">
                    <button class="quantity-btn increase" onclick="increaseQuantity(${stock.id})">+</button>
                    <span>${stock.unit}</span>
                </div>
            </td>
            <td>${stock.price}</td>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>
                <button class="send-stock-btn" onclick="sendStock(${stock.id})">
                    <i class="fas fa-paper-plane"></i> Send Stocks
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // Update footer
    const totalItems = document.getElementById('totalItems');
    const lastUpdated = document.getElementById('lastUpdated');
    
    if (totalItems) totalItems.textContent = filteredData.length;
    if (lastUpdated) lastUpdated.textContent = new Date().toLocaleTimeString();
}

// Attach Send Stock Event Listeners
function attachSendStockEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && !searchInput.hasListener) {
        searchInput.addEventListener('input', renderSendStockTable);
        searchInput.hasListener = true;
    }
}

// Update quantity from input
function updateQuantity(id, value) {
    const quantity = parseInt(value) || 0;
    if (quantity < 0 || quantity > 1000) {
        alert('Quantity must be between 0 and 1000');
        renderSendStockTable();
        return;
    }
    
    const stockIndex = stocksData.findIndex(item => item.id === id);
    if (stockIndex !== -1) {
        stocksData[stockIndex].quantity = quantity;
        changes.set(id, quantity);
        updateStatus(id);
    }
}

// Increase quantity
function increaseQuantity(id) {
    const stockIndex = stocksData.findIndex(item => item.id === id);
    if (stockIndex !== -1 && stocksData[stockIndex].quantity < 1000) {
        stocksData[stockIndex].quantity++;
        changes.set(id, stocksData[stockIndex].quantity);
        document.getElementById(`quantity-${id}`).value = stocksData[stockIndex].quantity;
        updateStatus(id);
    }
}

// Decrease quantity
function decreaseQuantity(id) {
    const stockIndex = stocksData.findIndex(item => item.id === id);
    if (stockIndex !== -1 && stocksData[stockIndex].quantity > 0) {
        stocksData[stockIndex].quantity--;
        changes.set(id, stocksData[stockIndex].quantity);
        document.getElementById(`quantity-${id}`).value = stocksData[stockIndex].quantity;
        updateStatus(id);
    }
}

// Update status for specific item
function updateStatus(id) {
    const stock = stocksData.find(item => item.id === id);
    if (!stock) return;
    
    const row = document.querySelector(`tr:has(#quantity-${id})`);
    if (!row) return;
    
    let statusClass = 'status-available';
    let statusText = 'Available';
    
    if (stock.quantity <= 0) {
        statusClass = 'status-low';
        statusText = 'Out of Stock';
    } else if (stock.quantity <= 10) {
        statusClass = 'status-pending';
        statusText = 'Low Stock';
    } else if (stock.quantity <= 20) {
        statusClass = 'status-shipped';
        statusText = 'Medium Stock';
    }
    
    const statusElement = row.querySelector('.status');
    if (statusElement) {
        statusElement.className = `status ${statusClass}`;
        statusElement.textContent = statusText;
    }
}

// Filter function
function filterTable(filter) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderSendStockTable();
}

// Save all changes
function saveAllChanges() {
    if (changes.size === 0) {
        alert('No changes to save.');
        return;
    }
    
    const changesArray = Array.from(changes.entries()).map(([id, quantity]) => {
        const stock = stocksData.find(item => item.id === id);
        return `${stock.name}: ${quantity} ${stock.unit}`;
    });
    
    alert(`Saved ${changes.size} changes:\n\n${changesArray.join('\n')}`);
    changes.clear();
    
    // In a real app, you would send this to your backend
    console.log('Changes saved:', Array.from(changes.entries()));
}

// Send stock batch
// ==================== HELPER FUNCTION: Find Inventory Item with Flexible Matching ====================
async function findInventoryItem(itemName) {
    try {
        // Step 1: Try exact name match first (searches both InventoryItem and MenuItem collections)
        console.log(`🔍 Level 1: Trying exact name match for "${itemName}"...`);
        let inventoryResponse = await fetch(`${BACKEND_URL}/api/inventory/name/${encodeURIComponent(itemName)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (inventoryResponse.ok) {
            const inventoryData = await inventoryResponse.json();
            if (inventoryData.data) {
                const source = inventoryData.data.source || 'Unknown';
                console.log(`✅ Level 1 SUCCESS: Found "${inventoryData.data.itemName}" from ${source}`);
                return inventoryData.data;
            }
        } else {
            console.log(`   ℹ️  Not found via Level 1 endpoint`);
        }
        
        // Step 2: Try case-insensitive match by fetching all inventory
        console.log(`🔍 Level 2: Trying case-insensitive search...`);
        try {
            const allInventoryResponse = await fetch(`${BACKEND_URL}/api/inventory`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            
            if (allInventoryResponse.ok) {
                const allInventoryData = await allInventoryResponse.json();
                if (allInventoryData.success && Array.isArray(allInventoryData.data)) {
                    const nameLower = itemName.toLowerCase().trim();
                    
                    // Try exact case-insensitive match
                    let match = allInventoryData.data.find(item => 
                        item.itemName && item.itemName.toLowerCase().trim() === nameLower
                    );
                    
                    if (match) {
                        console.log(`✅ Level 2 SUCCESS: Found via case-insensitive match: "${match.itemName}"`);
                        return match;
                    }
                    
                    // Try fuzzy match (remove special characters and spaces)
                    console.log(`🔍 Level 3: Trying fuzzy match (remove special chars)...`);
                    const nameNormalized = itemName.toLowerCase().replace(/[^a-z0-9]/g, '');
                    match = allInventoryData.data.find(item => 
                        item.itemName && item.itemName.toLowerCase().replace(/[^a-z0-9]/g, '') === nameNormalized
                    );
                    
                    if (match) {
                        console.log(`✅ Level 3 SUCCESS: Found via fuzzy match: "${match.itemName}"`);
                        return match;
                    }
                }
            }
        } catch (error) {
            console.error('Error in case-insensitive search:', error);
        }
        
        console.error(`❌ ALL LEVELS FAILED: Item "${itemName}" not found in inventory or menu`);
        return null;
    } catch (error) {
        console.error('❌ Error finding inventory item:', error);
        return null;
    }
}

// ==================== SEND STOCK - BATCH ====================
async function sendStockBatch() {
    try {
        let totalItems = 0;
        let successCount = 0;
        let failedItems = [];
        
        // Get all inputs with quantity values
        const quantityInputs = document.querySelectorAll('input[type="number"]');
        
        for (const input of quantityInputs) {
            const quantity = parseInt(input.value) || 0;
            if (quantity <= 0) continue;
            
            const stockId = input.getAttribute('data-stock-id');
            if (!stockId) continue;
            
            totalItems++;
            const stock = stocksData.find(item => item.id === parseInt(stockId));
            if (!stock) {
                failedItems.push(stock.name);
                continue;
            }
            
            try {
                console.log(`📦 Sending ${quantity} ${stock.unit} of ${stock.name}...`);
                
                // Find inventory item with flexible matching
                const inventoryItem = await findInventoryItem(stock.name);
                
                if (!inventoryItem) {
                    failedItems.push(stock.name);
                    console.warn(`⚠️ Could not find inventory item for "${stock.name}"`);
                    continue;
                }
                
                // Update inventory
                const currentStock = parseFloat(inventoryItem.currentStock) || 0;
                const newStock = currentStock + quantity;
                
                const updateResponse = await fetch(`${BACKEND_URL}/api/inventory/${inventoryItem._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ currentStock: newStock })
                });
                
                if (updateResponse.ok) {
                    successCount++;
                    input.value = '';
                    console.log(`✅ Successfully sent ${quantity} ${stock.unit} of ${stock.name}`);
                } else {
                    failedItems.push(stock.name);
                    console.error(`❌ Failed to update ${stock.name}`);
                }
            } catch (error) {
                failedItems.push(stock.name);
                console.error(`Error sending stock for ${stock.name}:`, error);
            }
        }
        
        if (totalItems > 0) {
            let message = `✅ Sent stock for ${successCount}/${totalItems} items to staff!`;
            if (failedItems.length > 0) {
                message += `\n\n❌ Failed items:\n${failedItems.join('\n')}`;
            }
            showToast(message, 'success');
            renderSendStockTable();
        } else {
            showToast('⚠️ No quantities entered', 'warning');
        }
    } catch (error) {
        console.error('Error in batch send:', error);
        showToast('❌ Error sending batch', 'error');
    }
}

// Send stock
async function sendStock(id) {
    const stock = stocksData.find(item => item.id === id);
    if (!stock) {
        alert('Item not found');
        return;
    }
    
    // Get the quantity to send from the input field
    const quantityInput = document.querySelector(`input[data-stock-id="${id}"]`);
    const quantityToSend = quantityInput ? parseInt(quantityInput.value) || 0 : stock.quantity;
    
    if (quantityToSend <= 0) {
        alert('Please enter a valid quantity');
        return;
    }
    
    try {
        console.log(`📦 Sending ${quantityToSend} ${stock.unit} of ${stock.name} to staff...`);
        
        // Use the helper function for flexible name matching
        // This searches both raw ingredients and menu items
        const inventoryItem = await findInventoryItem(stock.name);
        
        if (!inventoryItem) {
            console.error(`❌ Item "${stock.name}" not found in inventory or menu`);
            
            // Try to show helpful suggestions
            try {
                const allResponse = await fetch(`${BACKEND_URL}/api/inventory`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include'
                });
                
                if (allResponse.ok) {
                    const allData = await allResponse.json();
                    if (allData.success && Array.isArray(allData.data)) {
                        const similarItems = allData.data
                            .filter(item => item.itemName && item.itemName.toLowerCase().includes(stock.name.toLowerCase().split(' ')[0]))
                            .map(item => `"${item.itemName}"`)
                            .slice(0, 5);
                        
                        let errorMsg = `Item "${stock.name}" not found in inventory or menu.\n\n`;
                        if (similarItems.length > 0) {
                            errorMsg += `Did you mean one of these?\n${similarItems.join('\n')}\n\n`;
                        }
                        errorMsg += `Available items:\n${allData.data.map(item => item.itemName).join('\n')}`;
                        alert(errorMsg);
                    } else {
                        alert(`Item "${stock.name}" not found in inventory or menu`);
                    }
                } else {
                    alert(`Item "${stock.name}" not found in inventory or menu`);
                }
            } catch (error) {
                alert(`Item "${stock.name}" not found in inventory or menu`);
            }
            return;
        }
        
        // Update inventory with new stock (add the quantity sent)
        const currentStock = parseFloat(inventoryItem.currentStock) || 0;
        const newStock = currentStock + quantityToSend;
        
        const updateResponse = await fetch(`${BACKEND_URL}/api/inventory/${inventoryItem._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                currentStock: newStock
            })
        });
        
        if (updateResponse.ok) {
            console.log(`✅ Successfully sent ${quantityToSend} ${stock.unit} of ${stock.name}`);
            console.log(`📊 Stock updated: ${currentStock} → ${newStock} ${stock.unit}`);
            
            // Clear the input field
            if (quantityInput) {
                quantityInput.value = '';
            }
            
            // Show success message
            showToast(`✅ Sent ${quantityToSend} ${stock.unit} of ${stock.name} to staff!`, 'success');
            
            // Re-render the table
            renderSendStockTable();
        } else {
            const errorData = await updateResponse.json();
            alert(`Failed to send stock: ${errorData.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('❌ Error sending stock:', error);
        alert(`Failed to send stock: ${error.message}`);
    }
}

// ==================== GLOBAL EXPORTS ====================
window.handleLogout = handleLogout;
window.openAddModal = openAddModal;
window.openEditModal = openEditModal;
window.deleteMenuItem = deleteMenuItem;
window.toggleNotificationModal = toggleNotificationModal;
window.clearAllNotifications = clearAllNotifications;
window.initializeSendStockUI = initializeSendStockUI;
window.updateQuantity = updateQuantity;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.filterTable = filterTable;
window.saveAllChanges = saveAllChanges;
window.sendStockBatch = sendStockBatch;
window.sendStock = sendStock;
window.loadPendingStockRequests = loadPendingStockRequests;

console.log('✅ Menu Management System loaded successfully');