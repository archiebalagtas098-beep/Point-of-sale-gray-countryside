let currentOrder = [];
let orderType = null;
let currentCategory = 'all';
let selectedPaymentMethod = null;
let productCatalog = [];
let staffInventory = []; // Store staff inventory items received from admin
let pendingStockRequests = []; // Track products with pending stock requests
let outOfStockItems = []; // Track items that are permanently out of stock (persists across refreshes)

// Track active stock requests to prevent duplicates
let activeStockRequestModals = new Set();
let stockRequestTimestamps = {};

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
    return productImageMap[productName] || 'default_food.jpg';
}

const BACKEND_URL = window.location.origin;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Staff POS System initializing...');
    
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
    
    // Load out-of-stock items from localStorage
    const savedOutOfStockItems = localStorage.getItem('outOfStockItems');
    if (savedOutOfStockItems) {
        try {
            outOfStockItems = JSON.parse(savedOutOfStockItems);
            console.log(`🚫 Loaded ${outOfStockItems.length} out-of-stock items from localStorage:`, outOfStockItems);
        } catch (error) {
            console.error('Error loading out-of-stock items:', error);
            outOfStockItems = [];
        }
    }
    
    // Load stock request timestamps from localStorage
    const savedTimestamps = localStorage.getItem('stockRequestTimestamps');
    if (savedTimestamps) {
        try {
            stockRequestTimestamps = JSON.parse(savedTimestamps);
            console.log(`⏰ Loaded stock request timestamps from localStorage`);
        } catch (error) {
            console.error('Error loading stock request timestamps:', error);
            stockRequestTimestamps = {};
        }
    }
    
    loadAllMenuItems();
    setupCategoryButtons();
    
    // Load staff inventory from database
    loadStaffInventory();
    
    // Initial render
    renderMenu();
    updatePayButtonState();
    
    // Set initial order type to "None"
    setOrderTypeNone();
    
    // Setup real-time inventory notifications for staff
    setupStaffInventoryListener();
    
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
    
    console.log('✅ POS System loaded - Ready to receive stocks from admin');
});

// ==================== 🔴 FIXED: REAL-TIME STOCK TRANSFER LISTENER ====================
let staffEventSource = null;
let staffEventSourceRetries = 0;
const MAX_EVENT_SOURCE_RETRIES = 10;

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
        
        // ==================== 🔴 CRITICAL FIX: HANDLE STOCK TRANSFER EVENTS ====================
        staffEventSource.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                console.log('📨 Real-time event received:', data);
                
                // Handle stock transfer from admin
                if (data.type === 'stock_transfer' && data.action === 'stock_received') {
                    console.log('🎉 Stock transfer received from admin:', data);
                    handleStockTransferFromAdmin(data);
                }
                
                // Handle inventory updates
                if (data.type === 'inventory_update' && data.action === 'stock_changed') {
                    console.log('🔔 Stock status changed:', data);
                    
                    if (data.isOutOfStock) {
                        showStockNotification({
                            itemName: data.itemName,
                            status: 'out_of_stock',
                            message: `🚨 OUT OF STOCK: ${data.itemName}`,
                            severity: 'critical'
                        });
                    } else if (data.isLowStock) {
                        showStockNotification({
                            itemName: data.itemName,
                            status: 'low_stock',
                            message: `⚠️ LOW STOCK: ${data.itemName} (${data.currentStock} remaining)`,
                            severity: 'warning'
                        });
                    }
                }
                
                // Handle connection confirmation
                if (data.type === 'connected') {
                    console.log('✅ Connected to real-time updates');
                    staffEventSourceRetries = 0;
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

// ==================== 🔴 FIXED: HANDLE STOCK TRANSFER FROM ADMIN ====================
function handleStockTransferFromAdmin(transferData) {
    console.log('📨 Processing stock transfer from admin:', transferData);
    
    const { itemName, quantitySent, unit, newStaffStock, itemId } = transferData;
    
    if (!itemName || !quantitySent) {
        console.warn('⚠️ Invalid transfer data');
        return;
    }
    
    // Update staff inventory array
    if (itemId) {
        const existingItem = staffInventory.find(item => item._id === itemId);
        if (existingItem) {
            existingItem.currentStock = newStaffStock || (parseInt(existingItem.currentStock || 0) + parseInt(quantitySent));
            console.log(`✅ Updated staff inventory: ${existingItem.itemName} stock = ${existingItem.currentStock}`);
        } else {
            // Add new item to staff inventory
            staffInventory.push({
                _id: itemId,
                itemName: itemName,
                name: itemName,
                currentStock: newStaffStock || parseInt(quantitySent),
                unit: unit,
                source: 'admin_transfer'
            });
            console.log(`➕ Added new item to staff inventory: ${itemName} stock = ${quantitySent}`);
        }
    }
    
    // Find product in catalog
    let product = productCatalog.find(p => 
        p.name === itemName ||
        p.name.toLowerCase() === itemName.toLowerCase()
    );
    
    if (!product) {
        console.warn(`⚠️ Product "${itemName}" not found in catalog - adding it now`);
        
        // Add product to catalog
        product = {
            name: itemName,
            price: 0,
            category: 'Uncategorized',
            image: getProductImage(itemName),
            stock: parseInt(quantitySent),
            unit: unit,
            vatable: true,
            _id: itemId || `temp_${Date.now()}`,
            isActive: true,
            status: 'in_stock'
        };
        productCatalog.push(product);
        console.log(`➕ Added new product to catalog: ${itemName}`);
    } else {
        // Update existing product stock
        const previousStock = product.stock || 0;
        const newStock = previousStock + parseInt(quantitySent);
        
        product.stock = newStock;
        product.source = 'staff_inventory';
        product.status = newStock > 0 ? 'in_stock' : 'out_of_stock';
        
        console.log(`✅ Updated product stock: "${product.name}": ${previousStock} → ${newStock} ${unit}`);
        
        // Remove from out of stock if now in stock
        if (newStock > 0) {
            outOfStockItems = outOfStockItems.filter(name => name !== itemName);
            console.log(`✅ "${itemName}" is now IN STOCK with ${newStock} ${unit}`);
        }
    }
    
    // Remove from pending stock requests if it exists
    const requestIndex = pendingStockRequests.indexOf(itemName);
    if (requestIndex > -1) {
        pendingStockRequests.splice(requestIndex, 1);
        localStorage.setItem('pendingStockRequests', JSON.stringify(pendingStockRequests));
        console.log(`✅ Removed ${itemName} from pending stock requests`);
    }
    
    // Save to localStorage
    localStorage.setItem('outOfStockItems', JSON.stringify(outOfStockItems));
    
    // Update the product card immediately
    updateProductCardStock(itemName, parseInt(quantitySent));
    
    // Show success notification
    showStockNotification({
        itemName: itemName,
        status: 'stock_received',
        message: `🎉 Received ${quantitySent} ${unit} of ${itemName} from admin!`,
        severity: 'success'
    });
    
    // Re-render menu to show new stock
    renderMenu();
}

// ==================== 🔴 FIXED: UPDATE PRODUCT CARD STOCK ====================
function updateProductCardStock(productName, newStock) {
    console.log(`🔄 Updating product card for "${productName}" with stock: ${newStock}`);
    
    // Find all product cards with this name
    const cards = document.querySelectorAll('.compact-product-card');
    cards.forEach(card => {
        if (card.dataset.productName === productName) {
            // Update stock display
            const stockDiv = card.querySelector('.compact-product-stock');
            if (stockDiv) {
                stockDiv.textContent = `In Stock: ${newStock}`;
                stockDiv.className = 'compact-product-stock in-stock';
                stockDiv.style.color = '#28a745';
                stockDiv.style.fontWeight = 'bold';
            }
            
            // Remove out of stock classes and styling
            card.classList.remove('out-of-stock');
            card.style.opacity = '1';
            card.style.pointerEvents = 'auto';
            
            // Change onclick to add to order instead of request
            card.onclick = (e) => {
                e.preventDefault();
                const product = productCatalog.find(p => p.name === productName);
                if (product && product.stock > 0) {
                    addItemToOrder(product.name, product.price, product);
                } else {
                    showRequestStockModal(product);
                }
            };
            
            // Remove warning labels
            const warningLabel = card.querySelector('.out-of-stock-warning');
            if (warningLabel) {
                warningLabel.remove();
            }
            
            // Update card image opacity
            const img = card.querySelector('img');
            if (img) {
                img.style.opacity = '1';
            }
            
            console.log(`✅ Updated product card for "${productName}"`);
        }
    });
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
    } else if (notification.severity === 'success') {
        badge.style.backgroundColor = '#28a745';
        badge.style.color = 'white';
    }
    
    badge.textContent = notification.message;
    badge.style.display = 'block';
    
    setTimeout(() => {
        badge.style.display = 'none';
    }, 5000);
    
    const notificationCount = document.getElementById('inventoryNotificationCount');
    if (notificationCount) {
        const count = parseInt(notificationCount.textContent) || 0;
        notificationCount.textContent = count + 1;
        notificationCount.style.display = 'inline-block';
    }
}

// ==================== LOAD STAFF INVENTORY FROM API ====================
async function loadStaffInventory() {
    try {
        console.log('📦 Loading staff inventory from API...');
        
        const response = await fetch('/api/staff/inventory', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            console.warn(`⚠️ Could not load staff inventory (HTTP ${response.status})`);
            staffInventory = [];
            return;
        }
        
        const data = await response.json();
        staffInventory = data.data || data || [];
        
        console.log(`✅ Loaded ${staffInventory.length} items in staff inventory from admin transfers`, staffInventory);
        
        // Update product catalog with staff inventory stock levels
        mergeStaffInventoryWithCatalog();
        
    } catch (error) {
        console.error('❌ Error loading staff inventory:', error);
        staffInventory = [];
    }
}

// ==================== MERGE STAFF INVENTORY WITH PRODUCT CATALOG ====================
function mergeStaffInventoryWithCatalog() {
    if (!productCatalog || productCatalog.length === 0 || !staffInventory) {
        console.log('⚠️ Cannot merge: empty product catalog or staff inventory');
        return;
    }
    
    console.log('🔄 Merging staff inventory with product catalog...');
    
    let updatedCount = 0;
    
    productCatalog.forEach(product => {
        // Look for matching item in staff inventory
        const staffItem = staffInventory.find(item =>
            item.itemName === product.name ||
            item.name === product.name ||
            (item.itemName && item.itemName.toLowerCase() === product.name.toLowerCase())
        );
        
        if (staffItem) {
            // Update product with staff inventory stock
            const previousStock = product.stock || 0;
            const newStock = parseInt(staffItem.currentStock) || 0;
            
            product.stock = newStock;
            product.staffInventoryId = staffItem._id;
            product.source = 'staff_inventory';
            product.status = newStock > 0 ? 'in_stock' : 'out_of_stock';
            
            // Remove from outOfStockItems if it now has stock
            if (newStock > 0) {
                outOfStockItems = outOfStockItems.filter(name => name !== product.name);
                console.log(`✅ ${product.name} is now IN STOCK with ${newStock} ${product.unit}`);
            } else {
                if (!outOfStockItems.includes(product.name)) {
                    outOfStockItems.push(product.name);
                }
            }
            
            console.log(`✅ Updated "${product.name}": ${previousStock} → ${newStock} ${product.unit}`);
            updatedCount++;
        }
    });
    
    console.log(`🎯 Updated ${updatedCount} products from staff inventory`);
    localStorage.setItem('outOfStockItems', JSON.stringify(outOfStockItems));
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

// ==================== LOAD MENU ITEMS FROM ADMIN ====================
async function loadAllMenuItems() {
    try {
        console.log('📡 Fetching menu items...');
        
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
            console.log(`📦 API returned ${result.data.length} menu items from admin`);
            
            productCatalog = [];
            
            // Load ALL products from admin menu
            result.data.forEach(item => {
                const product = {
                    name: item.name || item.itemName || 'Unknown',
                    price: item.price || 0,
                    category: categoryDisplayNames[item.category] || item.category || 'Uncategorized',
                    image: getProductImage(item.name || item.itemName || ''),
                    stock: 0, // Start with 0 - will be updated from staff inventory
                    unit: item.unit || 'piece',
                    vatable: true,
                    _id: item._id || `temp_${Date.now()}_${(item.name || item.itemName).replace(/\s+/g, '_')}`,
                    inventoryItemId: item.inventoryItemId || null,
                    minStock: item.minStock || 10,
                    maxStock: item.maxStock || 100,
                    isActive: item.isActive !== false,
                    status: 'out_of_stock',
                    source: 'admin_menu'
                };
                
                productCatalog.push(product);
                
                // Add to outOfStockItems initially
                if (!outOfStockItems.includes(product.name)) {
                    outOfStockItems.push(product.name);
                }
            });
            
            console.log(`✅ Loaded ${productCatalog.length} products from admin menu`);
            localStorage.setItem('outOfStockItems', JSON.stringify(outOfStockItems));
            
            // Now merge with staff inventory to get actual stock levels
            await loadStaffInventory();
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

function loadFromLocalMenuDatabase() {
    console.log('⚠️ Loading from local menu database (fallback mode)');
    productCatalog = [];
    
    outOfStockItems = [];
    
    for (const [categoryKey, items] of Object.entries(menuDatabase)) {
        const displayCategory = categoryDisplayNames[categoryKey] || categoryKey;
        
        for (const menuItem of items) {
            const product = {
                name: menuItem.name,
                price: menuItem.defaultPrice,
                category: displayCategory,
                image: getProductImage(menuItem.name),
                stock: 0,
                unit: menuItem.unit,
                vatable: true,
                _id: `temp_${Date.now()}_${menuItem.name.replace(/\s+/g, '_')}`,
                inventoryItemId: null,
                minStock: 10,
                maxStock: 100,
                isActive: true,
                status: 'out_of_stock',
                missingIngredients: [],
                availableIngredients: []
            };
            
            productCatalog.push(product);
            
            if (!outOfStockItems.includes(product.name)) {
                outOfStockItems.push(product.name);
            }
        }
    }
    
    localStorage.setItem('outOfStockItems', JSON.stringify(outOfStockItems));
    
    console.log(`✅ Loaded ${productCatalog.length} products from local database`);
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
        hasPaymentAmount = inputPayment && inputPayment.value.trim() !== '' && parseFloat(inputPayment.value) > 0;
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

// ==================== 🔴 FIXED: CREATE PRODUCT CARD WITH REAL STOCK STATUS ====================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'compact-product-card';
    
    const isActive = product.isActive !== false;
    const hasStock = product.stock > 0;
    const isOutOfStock = !hasStock;
    
    card.dataset.productName = product.name;
    card.dataset.productId = product._id;
    card.dataset.productCategory = product.category;
    card.dataset.productPrice = product.price;
    card.dataset.productUnit = product.unit;
    card.dataset.isActive = isActive;
    card.dataset.stock = product.stock || 0;
    
    if (hasStock) {
        card.classList.remove('out-of-stock');
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.onclick = (e) => {
            e.preventDefault();
            addItemToOrder(product.name, product.price, product);
        };
    } else {
        card.classList.add('out-of-stock');
        card.style.opacity = '0.6';
        card.style.pointerEvents = 'auto';
        card.onclick = (e) => {
            e.preventDefault();
            showRequestStockModal(product);
        };
    }
    
    // Determine stock status display
    let stockStatus = '';
    let stockClass = '';
    let statusColor = '';
    
    if (hasStock) {
        stockStatus = `In Stock: ${product.stock} ${product.unit || ''}`;
        stockClass = 'in-stock';
        statusColor = '#28a745';
    } else {
        stockStatus = `Out of Stock 🔒`;
        stockClass = 'out-stock';
        statusColor = '#dc3545';
    }
    
    // Check if there's a pending request for this product
    const hasPendingRequest = pendingStockRequests.includes(product.name);
    
    let pendingRequestIndicator = '';
    if (hasPendingRequest) {
        pendingRequestIndicator = `
            <div style="font-size: 10px; color: #ff9800; margin-top: 3px; font-weight: bold;">
                ⏳ Request Pending
            </div>
        `;
    }
    
    let missingIngredientsHTML = '';
    if (product.missingIngredients && product.missingIngredients.length > 0) {
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
             style="opacity: ${hasStock ? '1' : '0.5'};" />
        <div class="compact-product-name">${product.name}</div>
        <div class="compact-product-category">${product.category}</div>
        <div class="compact-product-price">₱${product.price}</div>
        <div class="compact-product-stock ${stockClass}" style="color: ${statusColor}; font-weight: bold;">
            ${stockStatus}
        </div>
        ${pendingRequestIndicator}
        ${missingIngredientsHTML}
        ${!hasStock && !hasPendingRequest ? `
            <div style="font-size: 10px; color: #dc3545; margin-top: 5px; font-weight: bold;">
                ⚠️ OUT OF STOCK - Click to request
            </div>
        ` : ''}
        ${!hasStock && hasPendingRequest ? `
            <div style="font-size: 10px; color: #ff9800; margin-top: 5px; font-weight: bold;">
                ⏳ Request pending - Click to view
            </div>
        ` : ''}
    `;
    
    return card;
}

// ==================== ADD ITEM TO ORDER ====================
function addItemToOrder(name, price, product = null) {
    // Check if product has stock
    if (!product) {
        product = productCatalog.find(p => p.name === name);
    }
    
    if (!product || product.stock <= 0) {
        alert(`Sorry, ${name} is out of stock. Please request stock from the manager.`);
        if (product) showRequestStockModal(product);
        return;
    }
    
    const existingItem = currentOrder.find(item => item.name === name);
    
    if (existingItem) {
        // Check if we have enough stock
        if (existingItem.quantity + 1 > product.stock) {
            alert(`Not enough stock! Only ${product.stock} ${product.unit} available.`);
            return;
        }
        existingItem.quantity++;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
        currentOrder.push({
            name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: product.price,
            unit: product.unit,
            vatable: true,
            _id: product._id
        });
    }
    
    renderOrder();
    updateInputPaymentField();
    updatePayButtonState();
}

// ==================== REMOVE ITEM FROM ORDER ====================
function removeItemFromOrder(index) {
    const item = currentOrder[index];
    
    if (item.quantity > 1) {
        item.quantity--;
        item.subtotal = item.quantity * item.price;
    } else {
        currentOrder.splice(index, 1);
    }
    
    renderOrder();
    updateInputPaymentField();
    updatePayButtonState();
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

        // Find current stock for this item
        const product = productCatalog.find(p => p.name === item.name);
        const currentStock = product ? product.stock : 0;
        
        list.innerHTML += `
            <li>
                <div class="order-item-info">
                    <span class="order-item-name">${item.name}</span>
                    <span class="order-item-stock" style="color: ${currentStock > 0 ? '#28a745' : '#dc3545'};">
                        Stock: ${currentStock} ${item.unit || ''}
                    </span>
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

// ==================== STOCK REQUEST FUNCTIONS ====================
function canRequestStock(productName) {
    // Check if there's already a pending request
    if (pendingStockRequests.includes(productName)) {
        return {
            allowed: false,
            reason: 'pending',
            message: `A stock request for ${productName} is already pending. Please wait for it to be processed.`
        };
    }
    
    // Check if user has requested recently (within last 5 minutes)
    const lastRequestTime = stockRequestTimestamps[productName];
    if (lastRequestTime) {
        const timeSinceLastRequest = Date.now() - lastRequestTime;
        const fiveMinutes = 5 * 60 * 1000;
        
        if (timeSinceLastRequest < fiveMinutes) {
            const secondsRemaining = Math.ceil((fiveMinutes - timeSinceLastRequest) / 1000);
            return {
                allowed: false,
                reason: 'rate_limit',
                message: `Please wait ${secondsRemaining} seconds before requesting ${productName} again.`
            };
        }
    }
    
    return { allowed: true };
}

function closeStockRequestModal() {
    const modal = document.getElementById('stockRequestModal');
    if (modal) {
        const productName = modal.dataset.productName;
        if (productName) {
            activeStockRequestModals.delete(productName);
        }
        modal.remove();
    }
}

function showRequestStockModal(product) {
    if (!product) {
        console.error('Cannot show stock request modal: product is null');
        return;
    }
    
    // PREVENT DUPLICATE MODALS
    if (activeStockRequestModals.has(product.name)) {
        console.log(`🚫 Stock request modal already open for ${product.name} - preventing duplicate`);
        const existingModal = document.getElementById('stockRequestModal');
        if (existingModal && existingModal.dataset.productName === product.name) {
            existingModal.style.zIndex = '10001';
            setTimeout(() => { existingModal.style.zIndex = '10000'; }, 100);
        }
        return;
    }
    
    // CHECK IF REQUEST IS ALLOWED
    const requestCheck = canRequestStock(product.name);
    if (!requestCheck.allowed) {
        if (requestCheck.reason === 'pending') {
            showPendingRequestNotification(product.name);
        } else if (requestCheck.reason === 'rate_limit') {
            alert(requestCheck.message);
        }
        return;
    }
    
    const hasPendingRequest = pendingStockRequests.includes(product.name);
    
    const modalHTML = `
        <div id="stockRequestModal" data-product-name="${product.name}" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="margin-top: 0; color: #333;">Request Stock</h2>
                <p style="color: #666; font-size: 16px;">Product: <strong>${product.name}</strong></p>
                <p style="color: #666; font-size: 14px;">Category: ${product.category}</p>
                <p style="color: #666; font-size: 14px;">Price: ₱${product.price}</p>
                <p style="color: ${product.stock > 0 ? '#28a745' : '#dc3545'}; font-size: 14px;">
                    Current Stock: ${product.stock || 0} ${product.unit || ''}
                </p>
                
                ${hasPendingRequest ? `
                    <div style="background: #fff3cd; border: 1px solid #ffc107; padding: 12px; border-radius: 5px; margin: 15px 0; color: #856404;">
                        <p style="margin: 0; font-weight: bold;">⏳ Stock Request Already Pending</p>
                        <p style="margin: 5px 0 0 0; font-size: 13px;">A stock request for this item has already been submitted.</p>
                    </div>
                ` : ''}
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">Quantity Requested:</label>
                    <input type="number" id="requestQty" min="1" value="10" max="500" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                    <div style="font-size: 12px; color: #666; margin-top: 5px;">
                        <i class="fas fa-info-circle"></i> Maximum: 500 units
                    </div>
                </div>
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">Priority Level:</label>
                    <select id="requestPriority" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                
                <div style="background: #f8f9fa; padding: 12px; border-radius: 5px; margin: 15px 0;">
                    <p style="margin: 0; font-size: 13px; color: #666;">
                        <i class="fas fa-clock"></i> You can submit another request for this item after 5 minutes.
                    </p>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="closeStockRequestModal()" style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; background: #f0f0f0; color: #333;">Cancel</button>
                    <button onclick="submitStockRequest('${product._id}', '${product.name}', '${product.unit}')" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; background: #4CAF50; color: white;" ${hasPendingRequest ? 'disabled' : ''}>Request Stock</button>
                </div>
            </div>
        </div>
    `;
    
    const existingModal = document.getElementById('stockRequestModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    activeStockRequestModals.add(product.name);
    
    const modal = document.getElementById('stockRequestModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeStockRequestModal();
        }
    });
}

function showPendingRequestNotification(productName) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff9800;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10002;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideInRight 0.3s ease-in-out;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-clock"></i>
            <span>Stock request for ${productName} is already pending. Please wait for processing.</span>
            <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: 10px;">×</button>
        </div>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

async function submitStockRequest(productId, productName, unit) {
    const modal = document.getElementById('stockRequestModal');
    
    const requestCheck = canRequestStock(productName);
    if (!requestCheck.allowed) {
        closeStockRequestModal();
        alert(requestCheck.message);
        return;
    }
    
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
    
    const submitBtn = modal.querySelector('button[onclick*="submitStockRequest"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'not-allowed';
    }
    
    try {
        console.log(`📤 Submitting stock request for ${productName}: ${quantity} ${unit} (${priority} priority)`);
        
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
            
            stockRequestTimestamps[productName] = Date.now();
            localStorage.setItem('stockRequestTimestamps', JSON.stringify(stockRequestTimestamps));
            
            closeStockRequestModal();
            showStockRequestSuccess(productName, quantity, unit);
            renderMenu();
        } else {
            const errorData = await response.json();
            
            if (response.status === 409 || 
                (errorData.message && errorData.message.includes('already exists'))) {
                alert(`A stock request for ${productName} has already been submitted.`);
                
                if (!pendingStockRequests.includes(productName)) {
                    pendingStockRequests.push(productName);
                    localStorage.setItem('pendingStockRequests', JSON.stringify(pendingStockRequests));
                }
            } else {
                alert(`Failed to submit stock request:\n${errorData.message || 'Please try again.'}`);
            }
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
        }
    } catch (error) {
        console.error('Error submitting stock request:', error);
        alert('Error submitting stock request. Please check your connection and try again.');
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    }
}

function showStockRequestSuccess(productName, quantity, unit) {
    const successHTML = `
        <div id="successModal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10001; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <div style="width: 80px; height: 80px; background: #4CAF50; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-check" style="color: white; font-size: 40px;"></i>
                </div>
                <h2 style="color: #4CAF50; margin-top: 0;">✓ Stock Request Submitted</h2>
                <p style="color: #666; font-size: 16px; margin: 15px 0;">Your request for <strong>${quantity} ${unit}</strong> of <strong>${productName}</strong> has been submitted successfully.</p>
                <p style="color: #666; font-size: 14px; margin: 10px 0;">You can submit another request for this item after 5 minutes.</p>
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

// ==================== ORDER MANAGEMENT ====================
function clearCurrentOrder() {
    if (currentOrder.length === 0) {
        alert("No items to clear");
        return;
    }
    
    if (confirm(`Clear current order with ${currentOrder.length} item(s)?`)) {
        currentOrder = [];
        renderOrder();
        
        const inputPayment = document.getElementById('inputPayment');
        if (inputPayment) inputPayment.value = '';
        
        const changeSection = document.getElementById('changeSection');
        if (changeSection) changeSection.style.display = 'none';
        
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

// ==================== GLOBAL FUNCTIONS ====================
function markBackInStock(productName) {
    if (outOfStockItems.includes(productName)) {
        outOfStockItems = outOfStockItems.filter(name => name !== productName);
        localStorage.setItem('outOfStockItems', JSON.stringify(outOfStockItems));
        console.log(`✅ ${productName} marked as back in stock`);
        renderMenu();
    }
}

function clearAllOutOfStockItems() {
    outOfStockItems = [];
    localStorage.removeItem('outOfStockItems');
    console.log('✅ All out-of-stock items cleared');
    renderMenu();
}

function getOutOfStockCount() {
    return outOfStockItems.length;
}

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        document.querySelector('[id^="orderPopup_"]')?.remove();
        document.getElementById('successMessage')?.remove();
        closeStockRequestModal();
    }
});

// ==================== CLICK OUTSIDE TO CLOSE ====================
document.addEventListener('click', function(event) {
    const orderPopup = document.querySelector('[id^="orderPopup_"]');
    const successMsg = document.getElementById('successMessage');
    const stockRequestModal = document.getElementById('stockRequestModal');
    
    if (orderPopup && event.target === orderPopup) orderPopup.remove();
    if (successMsg && event.target === successMsg) successMsg.remove();
    if (stockRequestModal && event.target === stockRequestModal) closeStockRequestModal();
});

// ==================== EXPORT FUNCTIONS ====================
window.setDineIn = setDineIn;
window.setTakeout = setTakeout;
window.selectPaymentMethod = selectPaymentMethod;
window.Payment = Payment;
window.clearCurrentOrder = clearCurrentOrder;
window.removeItemFromOrder = removeItemFromOrder;
window.closeStockRequestModal = closeStockRequestModal;
window.closeSuccessModal = closeSuccessModal;
window.showRequestStockModal = showRequestStockModal;
window.submitStockRequest = submitStockRequest;
window.markBackInStock = markBackInStock;
window.clearAllOutOfStockItems = clearAllOutOfStockItems;
window.getOutOfStockCount = getOutOfStockCount;