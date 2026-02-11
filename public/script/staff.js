let currentOrder = [];
let orderType = null;
let currentCategory = 'all';
let selectedPaymentMethod = null;
let productCatalog = [];
let pendingStockRequests = []; // Track products with pending stock requests
let outOfStockItems = []; // Track items that are permanently out of stock (persists across refreshes)

const menuDatabase = {
    'Rice': [
        { name: 'Korean Spicy Bulgogi (Pork)', unit: 'plate', defaultPrice: 180 },
        { name: 'Korean Salt and Pepper (Pork)', unit: 'plate', defaultPrice: 175 },
        { name: 'Crispy Pork Lechon Kawali', unit: 'plate', defaultPrice: 165 },
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
    ]
};

// Category to display name mapping
const categoryDisplayNames = {
    'Rice': 'Rice Bowl Meals',
    'Sizzling': 'Hot Sizzlers',
    'Party': 'Party Tray',
    'Drink': 'Drinks',
    'Cafe': 'Coffee',
    'Milk': 'Milk Tea',
    'Frappe': 'Frappe',
    'Snack & Appetizer': 'Snacks & Appetizer',
    'Budget Meals Served with Rice': 'Budget Meals Served with Rice',
    'Specialties': 'Specialties'
};

// Image mapping for products
const productImageMap = {
    // Rice
    'Korean Spicy Bulgogi (Pork)': 'rice/korean_spicy_bulgogi.png',
    'Korean Salt and Pepper (Pork)': 'rice/korean_salt_pepper_pork.png',
    'Crispy Pork Lechon Kawali': 'rice/lechon_kawali.png',
    'Cream Dory Fish Fillet': 'rice/cream_dory.png',
    'Buttered Honey Chicken': 'rice/buttered_honey_chicken.png',
    'Buttered Spicy Chicken': 'rice/buttered_spicy_chicken.png',
    'Chicken Adobo': 'rice/chicken_adobo.png',
    'Pork Shanghai': 'rice/pork_shanghai.png',
    // Sizzling
    'Sizzling Pork Sisig': 'sizzling/pork_sisig.png',
    'Sizzling Liempo': 'sizzling/liempo.png',
    'Sizzling Porkchop': 'sizzling/porkchop.png',
    'Sizzling Fried Chicken': 'sizzling/fried_chicken.png',
    // Party
    'Pancit Bihon (S)': 'party/pancit_bihon_small.png',
    'Pancit Bihon (M)': 'party/pancit_bihon_medium.png',
    'Pancit Bihon (L)': 'party/pancit_bihon_large.png',
    'Pancit Canton (S)': 'party/pancit_canton_small.png',
    'Pancit Canton (M)': 'party/pancit_canton_medium.png',
    'Pancit Canton (L)': 'party/pancit_canton_large.png',
    'Spaghetti (S)': 'party/spaghetti_small.png',
    'Spaghetti (M)': 'party/spaghetti_medium.png',
    'Spaghetti (L)': 'party/spaghetti_large.png',
    // Drinks
    'Cucumber Lemonade (Glass)': 'drinks/cucumber_lemonade.png',
    'Cucumber Lemonade (Pitcher)': 'drinks/cucumber_lemonade_pitcher.png',
    'Blue Lemonade (Glass)': 'drinks/blue_lemonade.png',
    'Blue Lemonade (Pitcher)': 'drinks/blue_lemonade_pitcher.png',
    'Red Tea (Glass)': 'drinks/red_tea.png',
    'Soda (Mismo)': 'drinks/soda_mismo.png',
    'Soda 1.5L': 'drinks/soda_1.5liter.png',
    // Coffee
    'Cafe Americano Tall': 'coffee/cafe_americano_tall.png',
    'Cafe Americano Grande': 'coffee/cafe_americano_grande.png',
    'Cafe Latte Tall': 'coffee/cafe_latte_tall.png',
    'Cafe Latte Grande': 'coffee/cafe_latte_grande.png',
    'Caramel Macchiato Tall': 'coffee/caramel_macchiato_tall.png',
    'Caramel Macchiato Grande': 'coffee/caramel_macchiato_grande.png',
    // Milk Tea
    'Milk Tea Regular HC': 'milktea/Milktea_regular.png',
    'Milk Tea Regular MC': 'milktea/Milktea_regular_MC.png',
    'Matcha Green Tea HC': 'milktea/Matcha_greentea_HC.png',
    'Matcha Green Tea MC': 'milktea/Matcha_greentea_MC.png',
    // Frappe
    'Cookies & Cream HC': 'frappe/Cookies_&Cream_HC.png',
    'Cookies & Cream MC': 'frappe/Cookies_&Cream_MC.png',
    'Strawberry & Cream HC': 'frappe/Strawberry_Cream_frappe_HC.png',
    'Mango cheese cake HC': 'frappe/Mango_cheesecake_HC.png',
    // Snacks
    'Cheesy Nachos': 'snacks/cheesy_nachos.png',
    'Nachos Supreme': 'snacks/nachos_supreme.png',
    'French fries': 'snacks/french_fries.png',
    'Clubhouse Sandwich': 'snacks/club_house_sandwich.png',
    'Fish and Fries': 'snacks/fish_fries.png',
    'Cheesy Dynamite Lumpia': 'snacks/Cheesy_dynamite.png',
    'Lumpiang Shanghai': 'snacks/lumpiang_shanghai.png',
    // Budget Meals
    'Fried Chicken': 'budget/fried_chicken_Meal.png',
    'Buttered Honey Chicken': 'budget/buttered_honey_chicken.png',
    'Buttered Spicy Chicken': 'budget/buttered_spicy_chicken.png',
    'Tinapa Rice': 'budget/Tinapa_fried_rice.png',
    'Tuyo Pesto': 'budget/Tuyo_pesto.png',
    'Fried Rice': 'budget/fried_rice.png',
    'Plain Rice': 'budget/plain_rice.png',
    // Specialties
    'Sinigang (PORK)': 'specialties/sinigang_pork.png',
    'Sinigang (Shrimp)': 'specialties/sinigang_shrimp.png',
    'Paknet (Pakbet w/ Bagnet)': 'specialties/paknet.png',
    'Buttered Shrimp': 'specialties/buttered_shrimp.png',
    'Special Bulalo (good for 2-3 Persons)': 'specialties/Special_Bulalo.png',
    'Special Bulalo Buy 1 Take 1 (good for 6-8 Persons)': 'specialties/Special_Bulalo_buy1_take1.png'
};

// Function to get product image
function getProductImage(productName) {
    return productImageMap[productName] || 'default_food.png';
}

const BACKEND_URL = window.location.origin;

document.addEventListener('DOMContentLoaded', function() {
    // Load pending stock requests from localStorage
    const savedPendingRequests = localStorage.getItem('pendingStockRequests');
    if (savedPendingRequests) {
        try {
            pendingStockRequests = JSON.parse(savedPendingRequests);
            console.log(`📦 Loaded ${pendingStockRequests.length} pending stock requests from localStorage:`, pendingStockRequests);
        } catch (error) {
            console.error('Error loading pending stock requests:', error);
            pendingStockRequests = [];
        }
    }
    
    // ✅ Load out-of-stock items from localStorage (persists across refreshes)
    const savedOutOfStockItems = localStorage.getItem('outOfStockItems');
    if (savedOutOfStockItems) {
        try {
            outOfStockItems = JSON.parse(savedOutOfStockItems);
            console.log(`🚫 Loaded ${outOfStockItems.length} permanently out-of-stock items from localStorage:`, outOfStockItems);
        } catch (error) {
            console.error('Error loading out-of-stock items:', error);
            outOfStockItems = [];
        }
    }
    
    loadAllMenuItems();
    setupCategoryButtons();
    
    // Initial setup
    renderMenu();
    updatePayButtonState();
    
    // Set initial order type to "None"
    setOrderTypeNone();
    
    // Event listeners
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.addEventListener('input', updatePayButtonState);
    }
    
    const inputPayment = document.getElementById('inputPayment');
    if (inputPayment) {
        inputPayment.addEventListener('input', updatePayButtonState);
    }
    
    // Category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(btn => {
            const category = btn.getAttribute('data-category');
            btn.addEventListener('click', () => filterCategory(category));
            
            if (category === 'all') {
                btn.classList.add('active');
            }
        });
    }
    
    // Search input
    const searchInput = document.querySelector('input[type="text"][placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchFood(e.target.value);
        });
    }
    
    console.log('✅ POS System loaded - Real-time stock reduction enabled');
    
    // Auto-refresh menu items every 30 seconds
    setInterval(() => {
        console.log('🔄 Auto-refreshing menu items...');
        loadAllMenuItems();
    }, 30000);
    
    // Setup real-time inventory notifications for staff
    setupStaffInventoryListener();
});

// ==================== REAL-TIME INVENTORY NOTIFICATIONS FOR STAFF ====================

let outOfStockNotificationCount = 0;
let staffEventSource = null;
let staffEventSourceRetries = 0;
const MAX_EVENT_SOURCE_RETRIES = 5;

function setupStaffInventoryListener() {
    if (staffEventSourceRetries >= MAX_EVENT_SOURCE_RETRIES) {
        console.warn('⚠️ Max EventSource retries reached. Stopping reconnection attempts.');
        return;
    }

    try {
        console.log(`📡 Setting up real-time inventory notifications (Attempt ${staffEventSourceRetries + 1})...`);
        
        if (staffEventSource) {
            staffEventSource.close();
            staffEventSource = null;
        }
        
        staffEventSource = new EventSource('/api/staff/events', { withCredentials: true });
        
        staffEventSource.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                staffEventSourceRetries = 0;
                
                if (data.type === 'inventory_update' && data.action === 'stock_changed') {
                    console.log('🔔 Stock status changed:', data);
                    
                    if (data.isOutOfStock) {
                        showStockNotification({
                            itemName: data.itemName,
                            status: 'out_of_stock',
                            message: `🚨 OUT OF STOCK: ${data.itemName}`,
                            severity: 'critical'
                        });
                        outOfStockNotificationCount++;
                    } else if (data.isLowStock) {
                        showStockNotification({
                            itemName: data.itemName,
                            status: 'low_stock',
                            message: `⚠️ LOW STOCK: ${data.itemName} (${data.currentStock} remaining)`,
                            severity: 'warning'
                        });
                    }
                    
                    // Update local stock when backend changes
                    const product = productCatalog.find(p => p.name === data.itemName);
                    if (product && data.currentStock !== undefined) {
                        product.stock = data.currentStock;
                        updateStockDisplay(product.name, product.stock);
                    }
                } else if (data.type === 'connected') {
                    console.log('✅ Connected to real-time updates');
                }
            } catch (e) {
                console.error('Error parsing event:', e);
            }
        });
        
        staffEventSource.onerror = function(error) {
            console.error('❌ EventSource error:', error);
            if (staffEventSource) {
                staffEventSource.close();
                staffEventSource = null;
            }
            
            staffEventSourceRetries++;
            const retryDelay = Math.min(1000 * Math.pow(2, staffEventSourceRetries), 30000);
            console.log(`⏳ Retrying EventSource connection in ${retryDelay}ms...`);
            
            setTimeout(() => {
                setupStaffInventoryListener();
            }, retryDelay);
        };
    } catch (error) {
        console.error('❌ Error setting up EventSource:', error);
        staffEventSourceRetries++;
        
        if (staffEventSourceRetries < MAX_EVENT_SOURCE_RETRIES) {
            const retryDelay = Math.min(1000 * Math.pow(2, staffEventSourceRetries), 30000);
            setTimeout(() => {
                setupStaffInventoryListener();
            }, retryDelay);
        }
    }
}

function showStockNotification(notification) {
    console.log('📢 Stock Notification:', notification.message);
    
    let badge = document.getElementById('stockNotificationBadge');
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'stockNotificationBadge';
        badge.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideInRight 0.3s ease-in-out;
        `;
        document.body.appendChild(badge);
    }
    
    if (notification.severity === 'critical') {
        badge.style.backgroundColor = '#dc3545';
        badge.style.color = 'white';
    } else if (notification.severity === 'warning') {
        badge.style.backgroundColor = '#ffc107';
        badge.style.color = '#333';
    }
    
    badge.textContent = notification.message;
    badge.style.display = 'block';
    
    setTimeout(() => {
        badge.style.display = 'none';
    }, 8000);
    
    const notificationCount = document.getElementById('inventoryNotificationCount');
    if (notificationCount) {
        notificationCount.textContent = outOfStockNotificationCount;
        notificationCount.style.display = outOfStockNotificationCount > 0 ? 'inline-block' : 'none';
    }
}

function setOrderTypeNone() {
    orderType = null;
    
    const display = document.getElementById("orderTypeDisplay");
    if (display) display.textContent = "None";
    
    const dineInBtn = document.querySelector('.dineinandtakeout-btn:nth-child(1)');
    const takeoutBtn = document.querySelector('.dineinandtakeout-btn:nth-child(2)');
    
    if (dineInBtn) dineInBtn.classList.remove('active');
    if (takeoutBtn) takeoutBtn.classList.remove('active');
    
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.value = '';
        tableInput.disabled = false;
        tableInput.placeholder = "Enter Table:";
    }
    
    updatePayButtonState();
}

// ==================== LOAD MENU ITEMS ====================

async function loadAllMenuItems() {
    try {
        console.log('📡 Fetching menu items with REAL STOCK DATA from /api/menu...');
        
        const response = await fetch('/api/menu', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            console.warn(`⚠️ API error ${response.status} - using local database`);
            loadFromLocalMenuDatabase();
            return;
        }

        const result = await response.json();
        
        if (result.success && result.data && Array.isArray(result.data) && result.data.length > 0) {
            console.log(`📦 API returned ${result.data.length} menu items`);
            
            productCatalog = [];
            
            result.data.forEach(item => {
                const product = {
                    name: item.name || item.itemName || 'Unknown',
                    price: item.price || 0,
                    category: item.category || 'Uncategorized',
                    image: getProductImage(item.name || item.itemName || ''),
                    stock: item.currentStock || 0,
                    unit: item.unit || 'piece',
                    vatable: true,
                    _id: item._id || `temp_${Date.now()}_${(item.name || item.itemName).replace(/\s+/g, '_')}`,
                    inventoryItemId: item.inventoryItemId || null,
                    minStock: item.minStock || 10,
                    maxStock: item.maxStock || 100,
                    isActive: item.isActive !== false,
                    status: item.status || (item.currentStock > 0 ? 'in_stock' : 'out_of_stock'),
                    missingIngredients: item.missingIngredients || [],
                    availableIngredients: item.availableIngredients || []
                };
                
                productCatalog.push(product);
            });
            
            console.log(`✅ Loaded ${productCatalog.length} products with REAL STOCK DATA`);
            console.log('📊 Sample product stock:', productCatalog.slice(0, 3).map(p => `${p.name}: ${p.stock}`));
            
            renderMenu();
            return;
        }
        
        console.warn('⚠️ API returned no items - using local database');
        loadFromLocalMenuDatabase();
        
    } catch (error) {
        console.error('❌ Error loading menu items:', error);
        loadFromLocalMenuDatabase();
    }
}

async function loadFromLocalMenuDatabase() {
    console.log('⚠️ Loading from local menu database (fallback mode)');
    productCatalog = [];
    
    let inventoryMap = {};
    try {
        const inventoryResponse = await fetch('/api/inventory', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (inventoryResponse.ok) {
            const inventoryData = await inventoryResponse.json();
            if (inventoryData.success && Array.isArray(inventoryData.data)) {
                inventoryData.data.forEach(item => {
                    inventoryMap[item.itemName] = parseFloat(item.currentStock) || 0;
                });
                console.log(`✅ Fetched ${Object.keys(inventoryMap).length} inventory items`);
            }
        }
    } catch (error) {
        console.error('⚠️ Could not fetch inventory:', error);
    }
    
    for (const [categoryKey, items] of Object.entries(menuDatabase)) {
        const displayCategory = categoryDisplayNames[categoryKey] || categoryKey;
        
        for (const menuItem of items) {
            const realStock = inventoryMap[menuItem.name] !== undefined ? inventoryMap[menuItem.name] : 100; // Default 100 for testing
            
            productCatalog.push({
                name: menuItem.name,
                price: menuItem.defaultPrice,
                category: displayCategory,
                image: getProductImage(menuItem.name),
                stock: realStock,
                unit: menuItem.unit,
                vatable: true,
                _id: `temp_${Date.now()}_${menuItem.name.replace(/\s+/g, '_')}`,
                inventoryItemId: null,
                minStock: 10,
                maxStock: 100,
                isActive: true,
                status: realStock > 0 ? 'in_stock' : 'out_of_stock',
                missingIngredients: [],
                availableIngredients: []
            });
        }
    }
    
    console.log(`✅ Loaded ${productCatalog.length} products with stock values:`, 
        productCatalog.slice(0, 5).map(p => `${p.name}: ${p.stock}`));
    renderMenu();
}

// ==================== UI FUNCTIONS ====================

function checkAllFieldsFilled() {
    const hasItems = currentOrder.length > 0;
    const hasOrderType = orderType && orderType !== "None";
    const hasPaymentMethod = selectedPaymentMethod && selectedPaymentMethod.trim() !== '';
    
    let hasTableNumber = true;
    if (orderType === "Dine In") {
        const tableInput = document.getElementById('tableNumber');
        hasTableNumber = tableInput && tableInput.value.trim() !== '';
    }
    
    let hasPaymentAmount = true;
    if (selectedPaymentMethod === 'cash') {
        const inputPayment = document.getElementById('inputPayment');
        hasPaymentAmount = inputPayment && inputPayment.value.trim() !== '';
    }
    
    return hasItems && hasOrderType && hasPaymentMethod && hasTableNumber && hasPaymentAmount;
}

function updatePayButtonState() {
    const payButton = document.getElementById('payButton');
    if (!payButton) return;
    
    const allFieldsFilled = checkAllFieldsFilled();
    
    if (allFieldsFilled) {
        payButton.disabled = false;
        payButton.style.opacity = '1';
        payButton.style.cursor = 'pointer';
        payButton.style.backgroundColor = '#28a745';
    } else {
        payButton.disabled = true;
        payButton.style.opacity = '0.6';
        payButton.style.cursor = 'not-allowed';
        payButton.style.backgroundColor = '#6c757d';
    }
}

function searchFood(searchTerm) {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    
    if (!searchTerm.trim()) {
        renderMenu();
        return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filteredProducts = productCatalog.filter(product => {
        if (currentCategory !== 'all' && product.category !== currentCategory) return false;
        if (product.name.toLowerCase().includes(term)) return true;
        if (product.category.toLowerCase().includes(term)) return true;
        return false;
    });
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
    
    updatePayButtonState();
}

function renderMenu() {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    container.innerHTML = '';

    const items = currentCategory === 'all'
        ? productCatalog
        : productCatalog.filter(p => p.category === currentCategory);

    if (items.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-utensils"></i>
                <h3>No products in this category</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }

    items.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
    
    updatePayButtonState();
}

// ==================== CREATE PRODUCT CARD WITH REAL AVAILABILITY ====================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'compact-product-card';
    
    const isActive = product.isActive !== false;
    // ✅ CHECK IF ITEM IS PERMANENTLY OUT OF STOCK (saved in localStorage)
    const isPermanentlyOutOfStock = outOfStockItems.includes(product.name);
    const isOutOfStock = !isActive || product.stock <= 0 || isPermanentlyOutOfStock;
    
    card.dataset.productName = product.name;
    card.dataset.productId = product._id;
    card.dataset.productCategory = product.category;
    card.dataset.productPrice = product.price;
    card.dataset.productUnit = product.unit;
    card.dataset.isActive = isActive;
    card.dataset.stock = product.stock || 0;
    
    if (isOutOfStock) {
        card.classList.add('out-of-stock');
        card.style.cursor = 'pointer';
        card.style.opacity = '0.6';
        card.style.pointerEvents = 'auto';
        card.onclick = () => showRequestStockModal(product);
    } else {
        card.classList.add('in-stock');
        card.style.cursor = 'pointer';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.onclick = () => addItemToOrder(product.name, product.price, product);
    }

    let stockStatus = '';
    let stockClass = '';
    let statusColor = '';
    
    // ✅ IF PERMANENTLY OUT OF STOCK, SHOW IT WITH LOCK INDICATOR
    if (isOutOfStock) {
        const lockIcon = isPermanentlyOutOfStock ? ' 🔒' : '';
        stockStatus = `Out of Stock${lockIcon}`;
        stockClass = 'out-stock';
        statusColor = '#dc3545';
    } else if (product.stock <= 5) {
        stockStatus = `Critical Stock (${product.stock})`;
        stockClass = 'critical-stock';
        statusColor = '#ff4444';
    } else if (product.stock <= product.minStock) {
        stockStatus = `Low Stock (${product.stock})`;
        stockClass = 'low-stock';
        statusColor = '#ff9800';
    } else {
        stockStatus = `Available (${product.stock})`;
        stockClass = 'in-stock';
        statusColor = '#4CAF50';
    }

    let missingIngredientsHTML = '';
    if (isOutOfStock && product.missingIngredients && product.missingIngredients.length > 0) {
        missingIngredientsHTML = `
            <div class="missing-ingredients" style="font-size: 11px; color: #999; margin-top: 5px; padding: 5px; background: #f9f9f9; border-radius: 3px;">
                <strong>Missing:</strong> ${product.missingIngredients.join(', ')}
            </div>
        `;
    }

    card.innerHTML = `
        <img src="/images/${product.image}" 
             onerror="this.onerror=null; this.src='/images/default_food.jpg';" 
             alt="${product.name}" 
             style="opacity: ${isOutOfStock ? '0.5' : '1'}" />
        <div class="compact-product-name">${product.name}</div>
        <div class="compact-product-category">${product.category}</div>
        <div class="compact-product-price">₱${product.price}</div>
        <div class="compact-product-stock ${stockClass}" style="color: ${statusColor}; font-weight: bold;">
            ${stockStatus}
        </div>
        ${missingIngredientsHTML}
    `;
    
    return card;
}

// ==================== ADD ITEM TO ORDER WITH REAL-TIME STOCK REDUCTION ====================
async function addItemToOrder(name, price, product = null) {
    if (!product) {
        product = productCatalog.find(p => p.name === name);
    }
    
    if (!product) {
        console.error(`Product not found: ${name}`);
        return;
    }
    
    if (!product.isActive || product.stock <= 0) {
        let errorMsg = `Sorry, ${name} is out of stock`;
        if (product && product.missingIngredients && product.missingIngredients.length > 0) {
            errorMsg += `\n\nMissing ingredients:\n${product.missingIngredients.join('\n')}`;
        }
        errorMsg += '\n\nPlease request stock from the manager.';
        alert(errorMsg);
        return;
    }
    
    console.log(`✅ Adding ${name} to order (Current Stock: ${product.stock})`);
    
    // IMMEDIATELY REDUCE LOCAL STOCK FIRST FOR INSTANT FEEDBACK
    const oldStock = product.stock;
    product.stock = Math.max(0, product.stock - 1);
    
    // UPDATE UI IMMEDIATELY - Show reduced stock on menu card
    updateStockDisplay(name, product.stock);
    
    // UPDATE BACKEND ASYNCHRONOUSLY
    try {
        const inventoryResponse = await fetch(`${BACKEND_URL}/api/inventory/name/${encodeURIComponent(name)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (inventoryResponse.ok) {
            const inventoryData = await inventoryResponse.json();
            const inventoryItem = inventoryData.data;
            
            if (inventoryItem) {
                const currentStock = parseFloat(inventoryItem.currentStock) || 0;
                
                // Only reduce if backend stock matches our expected stock
                if (currentStock === oldStock) {
                    await fetch(`${BACKEND_URL}/api/inventory/${inventoryItem._id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({
                            currentStock: Math.max(0, currentStock - 1)
                        })
                    });
                    console.log(`📉 Stock reduced for ${name}: ${currentStock} → ${currentStock - 1}`);
                } else {
                    // Backend stock is different, sync it
                    console.warn(`⚠️ Stock mismatch for ${name}: local=${oldStock}, backend=${currentStock}`);
                    product.stock = currentStock - 1;
                    updateStockDisplay(name, product.stock);
                }
            }
        }
    } catch (error) {
        console.error('Error reducing stock on backend:', error);
    }
    
    // Add to order
    const existingItem = currentOrder.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
        currentOrder.push({
            name: name,
            price: price || product.price,
            quantity: 1,
            subtotal: price || product.price,
            category: product.category || 'Uncategorized',
            productId: product._id,
            unit: product.unit,
            vatable: true
        });
    }
    
    renderOrder();
    updatePayButtonState();
    renderMenu();
    
    // ✅ IF STOCK REACHES 0, MARK AS PERMANENTLY OUT OF STOCK
    if (product.stock === 0 && !outOfStockItems.includes(name)) {
        outOfStockItems.push(name);
        localStorage.setItem('outOfStockItems', JSON.stringify(outOfStockItems));
        console.log(`🚫 ${name} marked as OUT OF STOCK and saved to localStorage`);
    }
}

// ==================== UPDATE STOCK DISPLAY ====================
function updateStockDisplay(productName, newStock) {
    // Find all product cards with this name and update their stock display
    const cards = document.querySelectorAll('.compact-product-card');
    cards.forEach(card => {
        if (card.dataset.productName === productName) {
            const stockDiv = card.querySelector('.compact-product-stock');
            if (stockDiv) {
                if (newStock <= 0) {
                    stockDiv.textContent = `Out of Stock (${newStock})`;
                    stockDiv.className = 'compact-product-stock out-stock';
                    stockDiv.style.color = '#dc3545';
                } else if (newStock <= 10) {
                    stockDiv.textContent = `Low Stock (${newStock})`;
                    stockDiv.className = 'compact-product-stock low-stock';
                    stockDiv.style.color = '#ff9800';
                } else {
                    stockDiv.textContent = `Available (${newStock})`;
                    stockDiv.className = 'compact-product-stock in-stock';
                    stockDiv.style.color = '#4CAF50';
                }
            }
        }
    });
}

// ==================== REMOVE ITEM FROM ORDER WITH STOCK RESTORATION ====================
function removeItemFromOrder(index) {
    const item = currentOrder[index];
    const product = productCatalog.find(p => p.name === item.name);
    
    if (product) {
        // Restore stock
        product.stock += 1;
        
        // Update backend asynchronously
        updateStockOnServer(product.name, product.stock);
        
        // Update UI
        updateStockDisplay(item.name, product.stock);
    }
    
    if (item.quantity > 1) {
        item.quantity--;
        item.subtotal = item.quantity * item.price;
    } else {
        currentOrder.splice(index, 1);
    }
    
    renderOrder();
    updateInputPaymentField();
    updatePayButtonState();
    renderMenu();
}

// ==================== UPDATE STOCK ON SERVER ====================
async function updateStockOnServer(productName, newStock) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/inventory/name/${encodeURIComponent(productName)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            const inventoryItem = data.data;
            
            if (inventoryItem) {
                await fetch(`${BACKEND_URL}/api/inventory/${inventoryItem._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        currentStock: newStock
                    })
                });
                console.log(`📤 Stock synced for ${productName}: ${newStock}`);
            }
        }
    } catch (error) {
        console.error('Error updating stock on server:', error);
    }
}

// ==================== UPDATE STOCK DISPLAY ====================
function updateStockDisplay(productName, newStock) {
    const product = productCatalog.find(p => p.name === productName);
    if (!product) return;
    
    product.stock = newStock;
    
    const menuContainer = document.getElementById('menuContainer');
    if (menuContainer) {
        const productCards = menuContainer.querySelectorAll('.compact-product-card');
        
        productCards.forEach(card => {
            const nameElement = card.querySelector('.compact-product-name');
            if (nameElement && nameElement.textContent === productName) {
                const stockElement = card.querySelector('.compact-product-stock');
                if (stockElement) {
                    let stockStatus = '';
                    let stockClass = '';
                    let statusColor = '';
                    
                    if (newStock <= 0) {
                        stockStatus = 'Out of Stock';
                        stockClass = 'out-stock';
                        statusColor = '#dc3545';
                        
                        card.classList.add('out-of-stock');
                        card.style.cursor = 'pointer';
                        card.style.opacity = '0.6';
                        card.onclick = () => showRequestStockModal(product);
                    } else if (newStock <= 5) {
                        stockStatus = `Critical Stock (${newStock})`;
                        stockClass = 'critical-stock';
                        statusColor = '#ff4444';
                        
                        card.classList.remove('out-of-stock');
                        card.style.cursor = 'pointer';
                        card.style.opacity = '1';
                        card.onclick = () => addItemToOrder(productName, product.price, product);
                    } else if (newStock <= product.minStock) {
                        stockStatus = `Low Stock (${newStock})`;
                        stockClass = 'low-stock';
                        statusColor = '#ff9800';
                        
                        card.classList.remove('out-of-stock');
                        card.style.cursor = 'pointer';
                        card.style.opacity = '1';
                        card.onclick = () => addItemToOrder(productName, product.price, product);
                    } else {
                        stockStatus = `In Stock (${newStock})`;
                        stockClass = 'in-stock';
                        statusColor = '#4CAF50';
                        
                        card.classList.remove('out-of-stock');
                        card.style.cursor = 'pointer';
                        card.style.opacity = '1';
                        card.onclick = () => addItemToOrder(productName, product.price, product);
                    }
                    
                    stockElement.textContent = stockStatus;
                    stockElement.style.color = statusColor;
                    stockElement.className = `compact-product-stock ${stockClass}`;
                }
            }
        });
    }
    
    updateOrderStockDisplay(productName, newStock);
}

function updateOrderStockDisplay(productName, newStock) {
    const orderItems = document.querySelectorAll('.order-item-info');
    orderItems.forEach(item => {
        const nameElement = item.querySelector('.order-item-name');
        if (nameElement && nameElement.textContent === productName) {
            const stockElement = item.querySelector('.order-item-stock');
            if (stockElement) {
                const product = productCatalog.find(p => p.name === productName);
                if (product) {
                    stockElement.textContent = `Stock: ${newStock} ${product.unit}`;
                }
            }
        }
    });
}

// ==================== RENDER ORDER ====================
function renderOrder() {
    const list = document.getElementById('productlist');
    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('totals');

    if (!list) {
        console.error('productlist element not found!');
        return;
    }

    list.innerHTML = '';
    let subtotal = 0;
    let vatableAmount = 0;

    currentOrder.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        if (item.vatable) {
            vatableAmount += itemTotal;
        }

        const product = productCatalog.find(p => p.name === item.name);
        const remainingStock = product ? product.stock : 0;
        
        list.innerHTML += `
            <li>
                <div class="order-item-info">
                    <span class="order-item-name">${item.name}</span>
                    <span class="order-item-stock">Stock: ${remainingStock} ${item.unit || 'left'}</span>
                </div>
                <div class="order-item-controls">
                    <span class="order-item-quantity">x${item.quantity}</span>
                    <span class="order-item-price">₱${itemTotal.toFixed(2)}</span>
                    <button onclick="removeItemFromOrder(${index})" class="remove-item-btn">✕</button>
                </div>
            </li>`;
    });

    const fixedTax = 0;
    const total = subtotal + fixedTax;

    if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = '₱0.12';
    if (totalEl) totalEl.textContent = `${total.toFixed(2)}`;
    
    updatePayButtonState();
}

// ==================== STOCK REQUEST MODAL ====================
function closeStockRequestModal() {
    const modal = document.getElementById('stockRequestModal');
    if (modal) modal.remove();
}

function showRequestStockModal(product) {
    const hasPendingRequest = pendingStockRequests.includes(product.name);
    
    const modalHTML = `
        <div id="stockRequestModal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="margin-top: 0; color: #333;">Request Stock</h2>
                <p style="color: #666; font-size: 16px;">Product: <strong>${product.name}</strong></p>
                <p style="color: #666; font-size: 14px;">Category: ${product.category}</p>
                <p style="color: #666; font-size: 14px;">Price: ₱${product.price}</p>
                <p style="color: #dc3545; font-size: 14px;">Current Stock: ${product.stock || 0}</p>
                
                ${hasPendingRequest ? `
                    <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 5px; margin: 15px 0; color: #856404;">
                        <p style="margin: 0; font-weight: bold;">⏳ Stock Request Already Pending</p>
                        <p style="margin: 5px 0 0 0; font-size: 13px;">A stock request for this item has already been submitted.</p>
                    </div>
                ` : ''}
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">Quantity Requested:</label>
                    <input type="number" id="requestQty" min="1" value="10" max="500" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                </div>
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">Priority Level:</label>
                    <select id="requestPriority" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="low">Low</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="closeStockRequestModal()" style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; background: #f0f0f0; color: #333;">Cancel</button>
                    <button onclick="submitStockRequest('${product._id}', '${product.name}', '${product.unit}')" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; background: #4CAF50; color: white;">Request Stock</button>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('stockRequestModal');
    if (existingModal) existingModal.remove();
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function submitStockRequest(productId, productName, unit) {
    const quantity = parseInt(document.getElementById('requestQty').value);
    const priority = document.getElementById('requestPriority').value;
    
    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }
    
    if (quantity > 500) {
        alert('Maximum request quantity is 500');
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/stock-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                productId: productId,
                productName: productName,
                requestedQuantity: quantity,
                unit: unit,
                priority: priority,
                requestedBy: 'staff',
                status: 'pending'
            })
        });
        
        if (response.ok) {
            if (!pendingStockRequests.includes(productName)) {
                pendingStockRequests.push(productName);
                localStorage.setItem('pendingStockRequests', JSON.stringify(pendingStockRequests));
            }
            
            closeStockRequestModal();
            showStockRequestSuccess(productName, quantity, unit);
        } else {
            const errorData = await response.json();
            alert(`Failed to submit stock request:\n${errorData.message || 'Please try again.'}`);
        }
    } catch (error) {
        console.error('Error submitting stock request:', error);
        alert('Error submitting stock request. Please try again.');
    }
}

function showStockRequestSuccess(productName, quantity, unit) {
    const successHTML = `
        <div id="successModal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10001; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #4CAF50; margin-top: 0;">✓ Stock Request Submitted</h2>
                <p style="color: #666; font-size: 16px; margin: 15px 0;">Your request for <strong>${quantity} ${unit}</strong> of <strong>${productName}</strong> has been submitted successfully.</p>
                <button onclick="closeSuccessModal()" style="padding: 10px 30px; border: none; border-radius: 5px; cursor: pointer; background: #4CAF50; color: white; font-size: 16px; margin-top: 20px;">OK</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.remove();
}

// ==================== STOCK MANAGEMENT MODAL ====================
function openStockManagementModal() {
    const stocksData = buildStocksData();
    
    const containerHTML = `
        <div id="sendingStocksContainer" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; z-index: 10000; overflow-y: auto;">
            <div style="background: white; padding: 25px; max-width: 1400px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h1 style="color: #333; margin: 0; font-size: 28px; display: flex; align-items: center; gap: 12px;">
                        <i class="fas fa-boxes" style="color: #4CAF50;"></i> Stock Management
                    </h1>
                    <button onclick="closeSendingStocksModal()" style="background: #dc3545; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-size: 16px;">✕ Close</button>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <div style="position: relative; flex: 1; max-width: 400px;">
                        <i class="fas fa-search" style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #777;"></i>
                        <input type="text" id="sendingStocksSearch" placeholder="Search stocks..." style="width: 100%; padding: 12px 20px 12px 45px; border: 1px solid #ddd; border-radius: 6px; font-size: 15px;">
                    </div>
                    <button onclick="syncAllStockToDatabase()" style="padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; background: #4CAF50; color: white; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-sync-alt"></i> Sync All Stock
                    </button>
                </div>
                
                <div id="filterButtonsContainer" style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;"></div>
                
                <div style="overflow-x: auto;">
                    <table id="sendingStocksTable" style="width: 100%; border-collapse: collapse; margin-top: 10px; background: white;">
                        <thead>
                            <tr style="background: #f8f9fa;">
                                <th style="padding: 18px 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Name</th>
                                <th style="padding: 18px 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Category</th>
                                <th style="padding: 18px 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Current Stock</th>
                                <th style="padding: 18px 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Unit</th>
                                <th style="padding: 18px 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Price</th>
                                <th style="padding: 18px 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Status</th>
                                <th style="padding: 18px 15px; text-align: left; border-bottom: 2px solid #dee2e6;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="sendingStocksTableBody"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', containerHTML);
    initializeSendingStocksInterface(stocksData);
}

function buildStocksData() {
    return productCatalog.map(product => ({
        name: product.name,
        category: product.category,
        stock: product.stock,
        unit: product.unit,
        price: `₱${product.price}`,
        status: product.stock > 0 ? 'in_stock' : 'out_of_stock',
        productId: product._id
    }));
}

function initializeSendingStocksInterface(stocksData) {
    const filterContainer = document.getElementById('filterButtonsContainer');
    const categories = ['all', ...new Set(stocksData.map(s => s.category))];
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'filter-btn-send';
        btn.textContent = cat === 'all' ? 'All Stocks' : cat;
        btn.style.cssText = `padding: 10px 20px; background: ${cat === 'all' ? '#4CAF50' : '#f8f9fa'}; color: ${cat === 'all' ? 'white' : '#333'}; border: 1px solid ${cat === 'all' ? '#4CAF50' : '#dee2e6'}; border-radius: 6px; cursor: pointer; font-size: 14px;`;
        
        btn.onclick = (e) => {
            document.querySelectorAll('.filter-btn-send').forEach(b => {
                b.style.background = '#f8f9fa';
                b.style.color = '#333';
                b.style.border = '1px solid #dee2e6';
            });
            e.target.style.background = '#4CAF50';
            e.target.style.color = 'white';
            e.target.style.border = '1px solid #4CAF50';
            renderSendingStocksTable(stocksData, cat === 'all' ? 'all' : cat);
        };
        
        filterContainer.appendChild(btn);
    });
    
    const searchInput = document.getElementById('sendingStocksSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const activeFilter = document.querySelector('.filter-btn-send.active') || document.querySelector('.filter-btn-send');
            const filter = activeFilter?.textContent === 'All Stocks' ? 'all' : activeFilter?.textContent;
            renderSendingStocksTable(stocksData, filter || 'all', e.target.value.toLowerCase());
        });
    }
    
    renderSendingStocksTable(stocksData, 'all');
}

function renderSendingStocksTable(stocksData, filter, searchTerm = '') {
    const tbody = document.getElementById('sendingStocksTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    let filteredData = filter === 'all' 
        ? stocksData 
        : stocksData.filter(item => item.category === filter);
    
    if (searchTerm) {
        filteredData = filteredData.filter(item =>
            item.name.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
    }
    
    filteredData.forEach(stock => {
        const row = document.createElement('tr');
        row.style.cssText = 'border-bottom: 1px solid #e9ecef;';
        
        let statusBg = '#d4edda';
        let statusColor = '#155724';
        let statusText = 'In Stock';
        
        if (stock.stock <= 0) {
            statusBg = '#f8d7da';
            statusColor = '#721c24';
            statusText = 'Out of Stock';
        } else if (stock.stock <= 5) {
            statusBg = '#f8d7da';
            statusColor = '#721c24';
            statusText = 'Critical';
        } else if (stock.stock <= 10) {
            statusBg = '#fff3cd';
            statusColor = '#856404';
            statusText = 'Low Stock';
        }
        
        row.innerHTML = `
            <td style="padding: 16px 15px;"><strong>${stock.name}</strong></td>
            <td style="padding: 16px 15px;">${stock.category}</td>
            <td style="padding: 16px 15px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <button onclick="decreaseStockFromModal('${stock.name}')" style="width: 32px; height: 32px; border: none; border-radius: 4px; background: #f8d7da; color: #721c24; cursor: pointer;">-</button>
                    <span style="font-weight: bold; font-size: 16px;">${stock.stock}</span>
                    <button onclick="increaseStockFromModal('${stock.name}')" style="width: 32px; height: 32px; border: none; border-radius: 4px; background: #d4edda; color: #155724; cursor: pointer;">+</button>
                    <span style="color: #666;">${stock.unit}</span>
                </div>
            </td>
            <td style="padding: 16px 15px;">${stock.unit}</td>
            <td style="padding: 16px 15px;">${stock.price}</td>
            <td style="padding: 16px 15px;">
                <span style="display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; background: ${statusBg}; color: ${statusColor};">
                    ${statusText}
                </span>
            </td>
            <td style="padding: 16px 15px;">
                <button onclick="requestSendingStock('${stock.productId}', '${stock.name}')" style="padding: 8px 16px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Request Stock
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function closeSendingStocksModal() {
    const container = document.getElementById('sendingStocksContainer');
    if (container) container.remove();
}

// ==================== STOCK MANAGEMENT ACTIONS ====================
async function increaseStockFromModal(itemName) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/inventory/name/${encodeURIComponent(itemName)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (!response.ok) {
            alert('Item not found');
            return;
        }
        
        const data = await response.json();
        const item = data.data;
        const currentStock = parseFloat(item.currentStock) || 0;
        
        const updateResponse = await fetch(`${BACKEND_URL}/api/inventory/${item._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                currentStock: currentStock + 1
            })
        });
        
        if (updateResponse.ok) {
            const product = productCatalog.find(p => p.name === itemName);
            if (product) {
                product.stock = currentStock + 1;
                updateStockDisplay(product.name, product.stock);
            }
            openStockManagementModal();
        }
    } catch (error) {
        console.error('Error increasing stock:', error);
    }
}

async function decreaseStockFromModal(itemName) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/inventory/name/${encodeURIComponent(itemName)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        if (!response.ok) {
            alert('Item not found');
            return;
        }
        
        const data = await response.json();
        const item = data.data;
        const currentStock = parseFloat(item.currentStock) || 0;
        
        if (currentStock <= 0) {
            alert('Cannot reduce below 0');
            return;
        }
        
        const updateResponse = await fetch(`${BACKEND_URL}/api/inventory/${item._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                currentStock: currentStock - 1
            })
        });
        
        if (updateResponse.ok) {
            const product = productCatalog.find(p => p.name === itemName);
            if (product) {
                product.stock = currentStock - 1;
                updateStockDisplay(product.name, product.stock);
            }
            openStockManagementModal();
        }
    } catch (error) {
        console.error('Error decreasing stock:', error);
    }
}

async function syncAllStockToDatabase() {
    if (!confirm('Sync all stock quantities to database?')) return;
    
    let successCount = 0;
    let failCount = 0;
    
    for (const product of productCatalog) {
        if (!product.inventoryItemId) continue;
        
        try {
            const response = await fetch(`${BACKEND_URL}/api/inventory/${product.inventoryItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentStock: product.stock })
            });
            
            if (response.ok) successCount++;
            else failCount++;
        } catch (error) {
            failCount++;
        }
    }
    
    alert(`✅ Sync completed!\nSuccess: ${successCount}\nFailed: ${failCount}`);
    openStockManagementModal();
}

// ==================== REQUEST STOCK FROM MANAGEMENT ====================
async function requestSendingStock(productId, productName) {
    let productUnit = 'unit';
    let foundProduct = false;
    
    for (const category in menuDatabase) {
        const item = menuDatabase[category].find(p => p.name === productName);
        if (item) {
            productUnit = item.unit;
            foundProduct = true;
            break;
        }
    }
    
    if (!foundProduct) {
        alert(`Product ${productName} not found`);
        return;
    }
    
    const requestHTML = `
        <div id="sendingStockRequestModal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10002; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%;">
                <h2 style="margin-top: 0; color: #333;">Request Stock</h2>
                <p><strong>Product:</strong> ${productName}</p>
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Quantity:</label>
                    <input type="number" id="sendingRequestQty" min="1" value="10" max="500" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">
                </div>
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600;">Priority:</label>
                    <select id="sendingRequestPriority" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="this.closest('#sendingStockRequestModal').remove()" style="padding: 12px 30px; border: 1px solid #ddd; border-radius: 6px; background: #f0f0f0;">Cancel</button>
                    <button onclick="submitSendingStockRequest('${productId}', '${productName}', '${productUnit}')" style="padding: 12px 30px; border: none; border-radius: 6px; background: #4CAF50; color: white;">Submit</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', requestHTML);
}

async function submitSendingStockRequest(id, productName, unit) {
    const quantity = parseInt(document.getElementById('sendingRequestQty').value);
    const priority = document.getElementById('sendingRequestPriority').value;
    
    if (!quantity || quantity <= 0 || quantity > 500) {
        alert('Please enter a valid quantity (1-500)');
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/stock-requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                productId: id,
                productName: productName,
                requestedQuantity: quantity,
                unit: unit,
                priority: priority,
                requestedBy: 'staff',
                status: 'pending'
            })
        });
        
        if (response.ok) {
            if (!pendingStockRequests.includes(productName)) {
                pendingStockRequests.push(productName);
                localStorage.setItem('pendingStockRequests', JSON.stringify(pendingStockRequests));
            }
            
            document.getElementById('sendingStockRequestModal')?.remove();
            alert(`✅ Stock request for ${quantity} ${unit} of ${productName} submitted!`);
        } else {
            const error = await response.json();
            alert(`Failed: ${error.message || 'Please try again'}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting request');
    }
}

// ==================== ORDER MANAGEMENT ====================
function clearCurrentOrder() {
    if (currentOrder.length === 0) {
        alert("No items to clear");
        return;
    }
    
    if (confirm(`Clear current order with ${currentOrder.length} item(s)?`)) {
        currentOrder.forEach(orderItem => {
            const product = productCatalog.find(p => p.name === orderItem.name);
            if (product) {
                product.stock += orderItem.quantity;
                updateStockOnServer(product.name, product.stock);
                updateStockDisplay(product.name, product.stock);
            }
        });
        
        currentOrder = [];
        renderOrder();
        
        const inputPayment = document.getElementById('inputPayment');
        if (inputPayment) inputPayment.value = '';
        
        const changeSection = document.getElementById('changeSection');
        if (changeSection) changeSection.style.display = 'none';
        
        renderMenu();
        updatePayButtonState();
    }
}

// ==================== ORDER TYPE ====================
function setDineIn() {
    orderType = "Dine In";
    document.getElementById("orderTypeDisplay").textContent = orderType;
    
    const dineInBtn = document.querySelector('.dineinandtakeout-btn:nth-child(1)');
    const takeoutBtn = document.querySelector('.dineinandtakeout-btn:nth-child(2)');
    
    if (dineInBtn) dineInBtn.classList.add('active');
    if (takeoutBtn) takeoutBtn.classList.remove('active');
    
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.placeholder = "Enter Table:";
        tableInput.value = '';
        tableInput.disabled = false;
    }
    
    updatePayButtonState();
}

function setTakeout() {
    orderType = "Take Out";
    document.getElementById("orderTypeDisplay").textContent = orderType;
    
    const dineInBtn = document.querySelector('.dineinandtakeout-btn:nth-child(1)');
    const takeoutBtn = document.querySelector('.dineinandtakeout-btn:nth-child(2)');
    
    if (dineInBtn) dineInBtn.classList.remove('active');
    if (takeoutBtn) takeoutBtn.classList.add('active');
    
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.value = 'Takeout';
        tableInput.disabled = true;
    }
    
    updatePayButtonState();
}

// ==================== PAYMENT ====================
function selectPaymentMethod(method) {
    selectedPaymentMethod = method.toLowerCase();
    
    const buttons = document.querySelectorAll('.payment-method-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        btn.style.backgroundColor = '';
        btn.style.color = '';
    });
    
    const clickedButton = event.currentTarget;
    if (clickedButton) {
        clickedButton.classList.add('active');
        clickedButton.style.backgroundColor = '#28a745';
        clickedButton.style.color = 'white';
    }
    
    updatePaymentMethodDisplay();
    updateInputPaymentField();
}

function updatePaymentMethodDisplay() {
    const displayElement = document.getElementById("paymentMethodDisplay");
    if (!displayElement) return;
    
    let displayText = "None";
    switch(selectedPaymentMethod) {
        case 'cash': displayText = 'Cash'; break;
        case 'gcash': displayText = 'GCash'; break;
        default: if (selectedPaymentMethod) displayText = selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1);
    }
    
    displayElement.textContent = displayText;
}

function updateInputPaymentField() {
    const inputPayment = document.getElementById('inputPayment');
    const changeSection = document.getElementById('changeSection');
    
    if (!inputPayment) return;
    
    if (selectedPaymentMethod === 'cash' && currentOrder.length > 0) {
        inputPayment.disabled = false;
        inputPayment.placeholder = "Enter Cash Amount";
        inputPayment.value = '';
        inputPayment.oninput = calculateChange;
        setTimeout(() => inputPayment.focus(), 100);
    } else {
        inputPayment.disabled = true;
        inputPayment.placeholder = "Select Payment Method First";
        inputPayment.value = '';
        if (changeSection) changeSection.style.display = 'none';
    }
    
    updatePayButtonState();
}

function calculateChange() {
    const inputPayment = document.getElementById('inputPayment');
    const changeSection = document.getElementById('changeSection');
    const changeAmount = document.getElementById('changeAmount');
    const totalEl = document.getElementById('totals');
    
    if (!inputPayment || !changeSection || !changeAmount || !totalEl) return;
    
    const total = parseFloat(totalEl.textContent.replace('₱', '')) || 0;
    const paid = parseFloat(inputPayment.value) || 0;
    
    if (paid >= total && paid > 0) {
        changeAmount.textContent = (paid - total).toFixed(2);
        changeSection.style.display = 'block';
    } else {
        changeSection.style.display = 'none';
    }
    
    updatePayButtonState();
}

async function saveOrderToMongoDB(orderData) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
            credentials: 'include'
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        
        if (result.success) {
            return {
                success: true,
                orderId: result.orderId,
                orderNumber: result.orderNumber,
                customerId: result.customerId
            };
        } else {
            throw new Error(result.message || 'Failed to save order');
        }
    } catch (error) {
        console.error('❌ Error saving order:', error.message);
        throw error;
    }
}

async function completePayment(paymentMethod, total, paid, change, tableNumber) {
    const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const orderData = {
        items: currentOrder.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: "Regular",
            image: item.image || 'default_food.jpg',
            id: item._id || null,
            vatable: true
        })),
        subtotal: subtotal,
        tax: 0,
        total: total,
        type: orderType || "Dine In",
        notes: "",
        payment: { method: paymentMethod, amountPaid: paid, change: change },
        tableNumber: tableNumber
    };
    
    try {
        const saved = await saveOrderToMongoDB(orderData);
        
        if (saved.success) {
            await printReceipt({
                ...orderData,
                orderNumber: saved.orderNumber,
                tableNumber: tableNumber,
                paymentMethod: paymentMethod,
                amountPaid: paid,
                change: change,
                vatAmount: 0,
                vatableAmount: subtotal,
                customerId: saved.customerId
            });
            
            showSuccessMessage(saved.orderNumber, total);
            resetOrderUI();
        }
    } catch (error) {
        alert(`❌ Payment failed: ${error.message}`);
    }
}

function showSuccessMessage(orderNumber, total) {
    const successHTML = `
    <div id="successMessage" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="background: white; padding: 30px; border-radius: 15px; width: 90%; max-width: 400px; text-align: center;">
            <div style="width: 80px; height: 80px; background: #28a745; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-check" style="color: white; font-size: 40px;"></i>
            </div>
            <h2 style="color: #28a745; margin-bottom: 10px;">Payment Successful!</h2>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 25px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>Order #:</span>
                    <span style="font-weight: bold;">${orderNumber}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Total Amount:</span>
                    <span style="font-weight: bold; font-size: 18px;">₱${total.toFixed(2)}</span>
                </div>
            </div>
            <button onclick="this.closest('#successMessage').remove()" style="width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer;">OK</button>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

function resetOrderUI() {
    currentOrder = [];
    renderOrder();
    loadAllMenuItems();
    setOrderTypeNone();
    
    document.getElementById("paymentMethodDisplay").textContent = "None";
    
    document.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.backgroundColor = '';
        btn.style.color = '';
    });
    
    const tableInput = document.getElementById('tableNumber');
    if (tableInput) {
        tableInput.value = '';
        tableInput.disabled = false;
        tableInput.placeholder = "Enter table #";
    }
    
    const inputPayment = document.getElementById('inputPayment');
    if (inputPayment) {
        inputPayment.value = '';
        inputPayment.disabled = true;
        inputPayment.placeholder = "Select payment method first";
    }
    
    const changeSection = document.getElementById('changeSection');
    if (changeSection) changeSection.style.display = 'none';
    
    selectedPaymentMethod = null;
    updatePayButtonState();
}

function Payment() {
    if (!Array.isArray(currentOrder) || currentOrder.length === 0) {
        alert("Please Add Product First");
        return;
    }
    
    if (!orderType || orderType === "None") {
        alert("Please Choose if Dine or Take Out");
        return;
    }
    
    if (!selectedPaymentMethod) {
        alert("Please Select a payment method");
        return;
    }
    
    if (orderType === "Dine In") {
        const tableInput = document.getElementById('tableNumber');
        if (!tableInput || !tableInput.value.trim()) {
            alert("Please Enter table number");
            tableInput?.focus();
            return;
        }
    }
    
    showOrderConfirmation();
}

function showOrderConfirmation() {
    const orderTypeText = document.getElementById('orderTypeDisplay').textContent;
    const paymentMethodText = document.getElementById('paymentMethodDisplay').textContent;
    const total = parseFloat(document.getElementById('totals').textContent) || 0;
    const tableInput = document.getElementById('tableNumber');
    const tableNumber = tableInput ? tableInput.value : 'N/A';
    const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    let cashAmount = 0, change = 0;
    if (paymentMethodText === 'Cash') {
        const inputPayment = document.getElementById('inputPayment');
        cashAmount = inputPayment ? parseFloat(inputPayment.value) || 0 : 0;
        change = cashAmount - total;
    }
    
    const modalId = 'orderPopup_' + Date.now();
    
    const popupHTML = `
    <div id="${modalId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;">
        <div style="background: white; padding: 25px; border-radius: 10px; width: 90%; max-width: 450px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 2px solid #374151; padding-bottom: 10px;">
                <h2 style="margin: 0; color: #374151;">Order Confirmation</h2>
                <button onclick="document.getElementById('${modalId}').remove()" style="background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div><small style="color: #666;">Order Type</small><div style="font-weight: bold;">${orderTypeText}</div></div>
                    <div><small style="color: #666;">Payment Method</small><div style="font-weight: bold;">${paymentMethodText}</div></div>
                </div>
                
                ${tableNumber !== 'N/A' && tableNumber !== '' && tableNumber !== 'Takeout' ? `
                <div style="margin-bottom: 10px;">
                    <small style="color: #666;">Table Number</small>
                    <div style="font-weight: bold;">${tableNumber}</div>
                </div>` : ''}
                
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; max-height: 200px; overflow-y: auto;">
                    <h4 style="margin: 0 0 10px 0; color: #374151;">Order Items</h4>
                    ${currentOrder.map(item => `
                        <div style="display: flex; justify-content: space-between; margin: 5px 0; padding-bottom: 5px; border-bottom: 1px solid #eee;">
                            <span>${item.name} x${item.quantity}</span>
                            <span>₱${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                    
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 2px solid #ddd;">
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                            <span>Subtotal:</span> <span>₱${subtotal.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                            <span>Tax:</span> <span>₱0.12</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                            <span>Total Amount:</span>
                            <span style="font-weight: bold; font-size: 18px;">₱${total.toFixed(2)}</span>
                        </div>
                        
                        ${paymentMethodText === 'Cash' ? `
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                                <span>Amount Paid:</span> <span>₱${cashAmount.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                                <span>Change:</span>
                                <span style="font-weight: bold; color: #28a745;">₱${change.toFixed(2)}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button onclick="document.getElementById('${modalId}').remove()" style="flex: 1; padding: 12px; background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; font-weight: bold;">Cancel</button>
                <button onclick="processConfirmedOrder('${modalId}')" style="flex: 1; padding: 12px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">Confirm & Process</button>
            </div>
        </div>
    </div>`;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function processConfirmedOrder(modalId) {
    const orderTypeDisplay = document.getElementById('orderTypeDisplay').textContent;
    const paymentMethodDisplay = document.getElementById('paymentMethodDisplay').textContent;
    const total = parseFloat(document.getElementById('totals').textContent) || 0;
    const tableInput = document.getElementById('tableNumber');
    const tableNumber = tableInput ? tableInput.value : 'N/A';
    
    document.getElementById(modalId)?.remove();
    
    if (paymentMethodDisplay === 'Cash') {
        const inputPayment = document.getElementById('inputPayment');
        const cashAmount = inputPayment ? parseFloat(inputPayment.value) || 0 : 0;
        
        if (cashAmount < total) {
            alert(`Insufficient payment. Total: ₱${total.toFixed(2)} | Paid: ₱${cashAmount.toFixed(2)}`);
            return;
        }
        
        completePayment('cash', total, cashAmount, cashAmount - total, tableNumber);
    } else if (paymentMethodDisplay === 'GCash') {
        completePayment('gcash', total, total, 0, tableNumber);
    } else {
        alert(`Unsupported payment method: ${paymentMethodDisplay}`);
    }
}

// ==================== CATEGORY FILTER ====================
function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderMenu();
        });
    });
}

function filterCategory(category) {
    currentCategory = category;
    
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    renderMenu();
}

// ==================== PRINT RECEIPT ====================
function printReceipt(orderData) {
    return new Promise((resolve) => {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-PH');
        const timeString = now.toLocaleTimeString('en-PH', { hour12: false, hour: '2-digit', minute: '2-digit' });
        
        const companyName = "GRAY COUNTRYSIDE CAFE";
        const transactionNumber = `TRX-${now.getTime().toString().slice(-8)}`;
        
        let itemsHTML = '';
        currentOrder.forEach(item => {
            itemsHTML += `
                <div style="display: flex; justify-content: space-between; margin: 2px 0;">
                    <span>${item.name} x${item.quantity}</span>
                    <span>₱${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `;
        });
        
        const receiptContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt</title>
            <style>
                @media print { @page { size: 80mm auto; margin: 0; } body { width: 76mm; margin: 0 auto; padding: 2mm; font-family: 'Courier New', monospace; font-size: 10px; } }
                body { font-family: 'Courier New', monospace; width: 76mm; margin: 20px auto; padding: 5mm; background: white; }
                .receipt { width: 100%; }
                .header { text-align: center; margin-bottom: 5px; }
                .company-name { font-weight: bold; font-size: 12px; }
                .divider { border-top: 1px dashed #000; margin: 5px 0; }
                .total { font-weight: bold; font-size: 12px; }
                .thank-you { text-align: center; margin-top: 10px; }
            </style>
        </head>
        <body>
            <div class="receipt">
                <div class="header">
                    <div class="company-name">${companyName}</div>
                    <div>${dateString} ${timeString}</div>
                    <div>Order #: ${orderData.orderNumber || 'N/A'}</div>
                    <div>${orderData.type} ${orderData.tableNumber ? `(Table: ${orderData.tableNumber})` : ''}</div>
                </div>
                
                <div class="divider"></div>
                
                ${itemsHTML}
                
                <div class="divider"></div>
                
                <div style="display: flex; justify-content: space-between;">
                    <span>Subtotal:</span> <span>₱${orderData.subtotal.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Total:</span> <span class="total">₱${orderData.total.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Paid:</span> <span>₱${orderData.amountPaid.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Change:</span> <span>₱${orderData.change.toFixed(2)}</span>
                </div>
                
                <div class="thank-you">
                    THANK YOU. PLEASE COME AGAIN!
                </div>
            </div>
            <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
        </body>
        </html>
        `;
        
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '-9999px';
        iframe.style.bottom = '-9999px';
        document.body.appendChild(iframe);
        
        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(receiptContent);
        iframeDoc.close();
        
        setTimeout(() => {
            if (document.body.contains(iframe)) document.body.removeChild(iframe);
            resolve();
        }, 2000);
    });
}

// ==================== MANAGE OUT-OF-STOCK ITEMS ====================
// Function to mark an item as back in stock
function markBackInStock(productName) {
    if (outOfStockItems.includes(productName)) {
        outOfStockItems = outOfStockItems.filter(name => name !== productName);
        localStorage.setItem('outOfStockItems', JSON.stringify(outOfStockItems));
        console.log(`✅ ${productName} marked as back in stock`);
        renderMenu(); // Re-render to show updated status
    }
}

// Function to clear all out-of-stock items (admin reset)
function clearAllOutOfStockItems() {
    outOfStockItems = [];
    localStorage.removeItem('outOfStockItems');
    console.log('✅ All out-of-stock items cleared');
    renderMenu(); // Re-render menu
}

// Function to get count of permanently out-of-stock items
function getOutOfStockCount() {
    return outOfStockItems.length;
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelector('[id^="orderPopup_"]')?.remove();
        document.getElementById('successMessage')?.remove();
    }
    
    if (event.key === 'F5') {
        event.preventDefault();
        loadAllMenuItems();
    }
});

// ==================== CLICK OUTSIDE TO CLOSE ====================
document.addEventListener('click', function(event) {
    const orderPopup = document.querySelector('[id^="orderPopup_"]');
    const successMsg = document.getElementById('successMessage');
    
    if (orderPopup && event.target === orderPopup) orderPopup.remove();
    if (successMsg && event.target === successMsg) successMsg.remove();
});