let currentOrder = [];
let orderType = null;
let currentCategory = 'all';
let selectedPaymentMethod = null;
let productCatalog = [];

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
    
    console.log('✅ POS System loaded - ALL PRODUCTS ARE OUT OF STOCK');
    
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

function setupStaffInventoryListener() {
    try {
        console.log('📡 Setting up real-time inventory notifications...');
        
        const eventSource = new EventSource('/api/staff/events');
        
        eventSource.addEventListener('message', function(event) {
            try {
                const data = JSON.parse(event.data);
                
                if (data.type === 'inventory_update' && data.action === 'stock_changed') {
                    console.log('🔔 Stock status changed:', data);
                    
                    if (data.isOutOfStock) {
                        // Item is out of stock
                        showStockNotification({
                            itemName: data.itemName,
                            status: 'out_of_stock',
                            message: `🚨 OUT OF STOCK: ${data.itemName}`,
                            severity: 'critical'
                        });
                        outOfStockNotificationCount++;
                    } else if (data.isLowStock) {
                        // Item is low on stock
                        showStockNotification({
                            itemName: data.itemName,
                            status: 'low_stock',
                            message: `⚠️ LOW STOCK: ${data.itemName} (${data.currentStock} remaining)`,
                            severity: 'warning'
                        });
                    }
                } else if (data.type === 'connected') {
                    console.log('✅ Connected to real-time updates');
                }
            } catch (e) {
                console.error('Error parsing event:', e);
            }
        });
        
        eventSource.onerror = function(error) {
            console.error('❌ EventSource error:', error);
            eventSource.close();
            // Attempt to reconnect after 5 seconds
            setTimeout(() => {
                setupStaffInventoryListener();
            }, 5000);
        };
    } catch (error) {
        console.error('❌ Error setting up inventory listener:', error);
    }
}

// Show stock notification badge in staff UI
function showStockNotification(notification) {
    console.log('📢 Stock Notification:', notification.message);
    
    // Find or create notification badge
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
    
    // Set style based on severity
    if (notification.severity === 'critical') {
        badge.style.backgroundColor = '#dc3545'; // Red
        badge.style.color = 'white';
    } else if (notification.severity === 'warning') {
        badge.style.backgroundColor = '#ffc107'; // Yellow
        badge.style.color = '#333';
    }
    
    badge.textContent = notification.message;
    badge.style.display = 'block';
    
    // Auto-hide after 8 seconds
    setTimeout(() => {
        badge.style.display = 'none';
    }, 8000);
    
    // Also update the notification count badge if it exists
    const notificationCount = document.getElementById('inventoryNotificationCount');
    if (notificationCount) {
        notificationCount.textContent = outOfStockNotificationCount;
        notificationCount.style.display = outOfStockNotificationCount > 0 ? 'inline-block' : 'none';
    }
}

// Set order type to "None"
function setOrderTypeNone() {
    orderType = null;
    
    const display = document.getElementById("orderTypeDisplay");
    if (display) display.textContent = "None";
    
    // Remove active class from both buttons
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

// In staff POS system
async function checkIfMenuItemCanBeOrdered(menuItemName, quantity) {
    try {
        const response = await fetch('/api/inventory/check-availability', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ menuItemName, quantity })
        });
        
        const data = await response.json();
        
        if (data.success && data.available) {
            return true;
        } else {
            alert(`Cannot order ${menuItemName}: ${data.message}`);
            return false;
        }
    } catch (error) {
        console.error('Error checking availability:', error);
        return false;
    }
}

// When processing order
async function processOrder(orderData) {
    // Check all items first
    for (const item of orderData.items) {
        const canOrder = await checkIfMenuItemCanBeOrdered(item.name, item.quantity);
        if (!canOrder) {
            return { success: false, message: 'Some items cannot be ordered' };
        }
    }
    
    // Process order and deduct inventory
    const response = await fetch('/api/inventory/process-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    return data;
}

// Load ALL menu items - FROM ACTUAL DATABASE
async function loadAllMenuItems() {
    try {
        console.log('📡 Fetching ALL menu items from backend...');
        
        // First, try to get from database
        const response = await fetch(`${BACKEND_URL}/api/products/actual-menu`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
            
            if (result.success && result.data) {
                // Process the data from backend
                productCatalog = [];
                
                // Go through each category in the actual menu database
                for (const [categoryKey, items] of Object.entries(menuDatabase)) {
                    const displayCategory = categoryDisplayNames[categoryKey] || categoryKey;
                    
                    for (const menuItem of items) {
                        // Try to find this item in the database response
                        let dbItem = null;
                        
                        if (result.data.categories) {
                            for (const categoryData of result.data.categories) {
                                if (categoryData.category === displayCategory) {
                                    const found = categoryData.items.find(item => 
                                        item.name.toLowerCase() === menuItem.name.toLowerCase()
                                    );
                                    if (found) {
                                        dbItem = found;
                                        break;
                                    }
                                }
                            }
                        }
                        
                        // Create product object - SET ALL STOCK TO 0
                        productCatalog.push({
                            name: menuItem.name,
                            price: dbItem?.productStatus === 'not_in_database' ? menuItem.defaultPrice : (dbItem?.defaultPrice || menuItem.defaultPrice),
                            category: displayCategory,
                            image: getProductImage(menuItem.name),
                            stock: 0, // ALL ITEMS HAVE 0 STOCK
                            unit: menuItem.unit,
                            vatable: true,
                            _id: dbItem?.productId || `temp_${Date.now()}_${menuItem.name.replace(/\s+/g, '_')}`,
                            inventoryItemId: dbItem?.inventoryItemId || null,
                            minStock: 10,
                            status: 'out_of_stock' // ALL ITEMS ARE OUT OF STOCK
                        });
                    }
                }
                
                console.log(`✅ Loaded ${productCatalog.length} products (ALL OUT OF STOCK)`);
                renderMenu();
                return;
            }
        }
        
        // If API fails, load from local menu database
        console.log('⚠️ Using local menu database (backend not responding)');
        loadFromLocalMenuDatabase();
        
    } catch (error) {
        console.error('❌ Error loading menu items:', error);
        loadFromLocalMenuDatabase();
    }
}

// Load from local menu database
function loadFromLocalMenuDatabase() {
    productCatalog = [];
    
    // Convert menuDatabase to productCatalog format - SET ALL STOCK TO 0
    for (const [categoryKey, items] of Object.entries(menuDatabase)) {
        const displayCategory = categoryDisplayNames[categoryKey] || categoryKey;
        
        for (const menuItem of items) {
            productCatalog.push({
                name: menuItem.name,
                price: menuItem.defaultPrice,
                category: displayCategory,
                image: getProductImage(menuItem.name),
                stock: 0, // ALL ITEMS HAVE 0 STOCK
                unit: menuItem.unit,
                vatable: true,
                _id: `temp_${Date.now()}_${menuItem.name.replace(/\s+/g, '_')}`,
                inventoryItemId: null,
                minStock: 10,
                status: 'out_of_stock' // ALL ITEMS ARE OUT OF STOCK
            });
        }
    }
    
    console.log(`✅ Loaded ${productCatalog.length} products from local menu database (ALL OUT OF STOCK)`);
    renderMenu();
}

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

// ==================== MODIFIED: ALL PRODUCTS OUT OF STOCK ====================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'compact-product-card';
    
    // FORCE ALL PRODUCTS TO BE OUT OF STOCK
    const isOutOfStock = true; // All items are out of stock
    
    // Store product data for stock request modal
    card.dataset.productName = product.name;
    card.dataset.productId = product._id;
    card.dataset.productCategory = product.category;
    card.dataset.productPrice = product.price;
    card.dataset.productUnit = product.unit;
    
    // ALL ITEMS ARE OUT OF STOCK - MAKE THEM NOT CLICKABLE FOR ORDERING
    // BUT CLICKABLE FOR STOCK REQUESTS
    card.classList.add('out-of-stock');
    card.style.cursor = 'pointer';
    card.style.opacity = '0.8';
    card.style.pointerEvents = 'auto';
    card.onclick = () => showRequestStockModal(product);

    // Stock status for ALL items: "Out of Stock"
    const stockStatus = 'Out of Stock';
    const stockClass = 'out-stock';

    card.innerHTML = `
        <img src="/images/${product.image}" 
             onerror="this.onerror=null; this.src='/images/default_food.jpg';" 
             alt="${product.name}" />
        <div class="compact-product-name">${product.name}</div>
        <div class="compact-product-category">${product.category}</div>
        <div class="compact-product-price">₱${product.price}</div>
        <div class="compact-product-stock ${stockClass}" style="color: #dc3545; font-weight: bold;">
            ${stockStatus}
        </div>
    `;
    
    return card;
}

// ==================== MODIFIED: PREVENT ORDERING ====================
// Add item to order - PREVENT FOR ALL ITEMS
async function addItemToOrder(name, price) {
    alert(`Sorry, ${name} is out of stock and cannot be ordered!`);
    return;
}

// Get real-time stock from server
async function getRealTimeStock(productName) {
    try {
        const response = await fetch(`${BACKEND_URL}/api/inventory/stock/${encodeURIComponent(productName)}`, {
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            return null;
        }

        const result = await response.json();
        
        if (result.success && result.data) {
            return result.data.stock || result.data.inventoryStock || 0;
        }
        return null;
    } catch (error) {
        return null;
    }
}

function closeStockRequestModal() {
    const modal = document.getElementById('stockRequestModal');
    if (modal) {
        modal.remove();
    }
}

// Show request stock modal for out of stock items
function showRequestStockModal(product) {
    // Create modal HTML
    const modalHTML = `
        <div id="stockRequestModal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="margin-top: 0; color: #333;">Request Stock</h2>
                <p style="color: #666; font-size: 16px;">Product: <strong>${product.name}</strong></p>
                <p style="color: #666; font-size: 14px;">Category: ${product.category}</p>
                <p style="color: #666; font-size: 14px;">Price: ₱${product.price}</p>
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">Quantity Requested:</label>
                    <input type="number" id="requestQty" min="1" value="1" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                </div>
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">Priority Level:</label>
                    <select id="requestPriority" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="asap">ASAP</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end;">
                    <button onclick="closeStockRequestModal()" style="padding: 10px 20px; border: 1px solid #ddd; border-radius: 5px; cursor: pointer; background: #f0f0f0; color: #333;">Cancel</button>
                    <button onclick="submitStockRequest('${product._id}', '${product.name}', '${product.unit}')" style="padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; background: #4CAF50; color: white;">Request Stock</button>
                </div>
            </div>
        </div>
    `;
    
    // Remove any existing modal
    const existingModal = document.getElementById('stockRequestModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Submit stock request
async function submitStockRequest(productId, productName, unit) {
    const quantity = parseInt(document.getElementById('requestQty').value);
    const priority = document.getElementById('requestPriority').value;
    
    if (!quantity || quantity <= 0) {
        alert('Please enter a valid quantity');
        return;
    }
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/stock-requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
            closeStockRequestModal();
            showStockRequestSuccess(productName, quantity, unit);
        } else {
            alert('Failed to submit stock request. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting stock request:', error);
        alert('Error submitting stock request. Please try again.');
    }
}

// Show success message
function showStockRequestSuccess(productName, quantity, unit) {
    const successHTML = `
        <div id="successModal" style="display: block; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 10001; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 30px; border-radius: 10px; max-width: 500px; width: 90%; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                <h2 style="color: #4CAF50; margin-top: 0;">✓ Stock Request Submitted</h2>
                <p style="color: #666; font-size: 16px; margin: 15px 0;">Your request for <strong>${quantity} ${unit}</strong> of <strong>${productName}</strong> has been submitted successfully.</p>
                <div style="background: #e8f5e9; border-left: 4px solid #4CAF50; padding: 12px; margin: 15px 0; border-radius: 4px; text-align: left;">
                    <p style="color: #2e7d32; margin: 0; font-size: 14px;">
                        <i class="fas fa-bell" style="margin-right: 8px;"></i>
                        <strong>Menu Management has been notified!</strong> They will review your request and process it shortly.
                    </p>
                </div>
                <p style="color: #999; font-size: 14px;">Check the "Send Stocks" section in Menu Management to see your pending request.</p>
                <button onclick="closeSuccessModal()" style="padding: 10px 30px; border: none; border-radius: 5px; cursor: pointer; background: #4CAF50; color: white; font-size: 16px; margin-top: 20px;">OK</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.remove();
    }
}

function removeItemFromOrder(index) {
    const item = currentOrder[index];
    
    if (item.quantity > 1) {
        item.quantity--;
        // Update stock permanently
        const product = productCatalog.find(p => p.name === item.name);
        if (product) {
            product.stock++;
            updateStockDisplay(item.name, product.stock);
        }
    } else {
        // Update stock permanently for all items being removed
        const product = productCatalog.find(p => p.name === item.name);
        if (product) {
            product.stock += item.quantity;
            updateStockDisplay(item.name, product.stock);
        }
        currentOrder.splice(index, 1);
    }
    
    renderOrder();
    updateInputPaymentField();
    updatePayButtonState();
}

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
                    <span class="order-item-stock">Available: ${remainingStock} ${item.unit || 'left'}</span>
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

// Update stock display - NO ANIMATIONS
function updateStockDisplay(productName, newStock) {
    const product = productCatalog.find(p => p.name === productName);
    if (!product) return;
    
    product.stock = newStock;
    
    // Update all instances of this product in the menu
    const menuContainer = document.getElementById('menuContainer');
    if (menuContainer) {
        const productCards = menuContainer.querySelectorAll('.compact-product-card');
        
        productCards.forEach(card => {
            const nameElement = card.querySelector('.compact-product-name');
            if (nameElement && nameElement.textContent === productName) {
                const stockElement = card.querySelector('.compact-product-stock');
                if (stockElement) {
                    // Update stock status
                    let stockStatus = '';
                    let stockClass = '';
                    
                    if (newStock <= 0) {
                        stockStatus = 'Out of Stock';
                        stockClass = 'out-stock';
                        
                        // Make card look disabled
                        card.classList.add('out-of-stock');
                        card.style.cursor = 'default';
                        card.style.opacity = '0.8';
                        card.style.pointerEvents = 'auto';
                    } else if (newStock <= (product.minStock || 10)) {
                        stockStatus = `${newStock} ${product.unit} left`;
                        stockClass = 'low-stock';
                        
                        // Enable the card for ordering
                        card.classList.remove('out-of-stock');
                        card.style.cursor = 'pointer';
                        card.style.opacity = '1';
                        card.style.pointerEvents = 'auto';
                        card.onclick = () => addItemToOrder(productName, product.price);
                        
                        // Remove request badge if exists
                        const badge = card.querySelector('.request-stock-badge');
                        if (badge) {
                            badge.remove();
                        }
                    } else if (newStock <= 30) {
                        stockStatus = `${newStock} ${product.unit}`;
                        stockClass = 'medium-stock';
                        
                        // Enable the card for ordering
                        card.classList.remove('out-of-stock');
                        card.style.cursor = 'pointer';
                        card.style.opacity = '1';
                        card.style.pointerEvents = 'auto';
                        card.onclick = () => addItemToOrder(productName, product.price);
                        
                        // Remove request badge if exists
                        const badge = card.querySelector('.request-stock-badge');
                        if (badge) {
                            badge.remove();
                        }
                    } else {
                        stockStatus = `${newStock} ${product.unit} available`;
                        stockClass = 'high-stock';
                        
                        // Enable the card for ordering
                        card.classList.remove('out-of-stock');
                        card.style.cursor = 'pointer';
                        card.style.opacity = '1';
                        card.style.pointerEvents = 'auto';
                        card.onclick = () => addItemToOrder(productName, product.price);
                        
                        // Remove request badge if exists
                        const badge = card.querySelector('.request-stock-badge');
                        if (badge) {
                            badge.remove();
                        }
                    }
                    
                    stockElement.textContent = stockStatus;
                    stockElement.className = `compact-product-stock ${stockClass}`;
                }
            }
        });
    }
    
    // Update order list
    updateOrderStockDisplay(productName, newStock);
}

// Update stock in order list
function updateOrderStockDisplay(productName, newStock) {
    const orderItems = document.querySelectorAll('.order-item-info');
    orderItems.forEach(item => {
        const nameElement = item.querySelector('.order-item-name');
        if (nameElement && nameElement.textContent === productName) {
            const stockElement = item.querySelector('.order-item-stock');
            if (stockElement) {
                const product = productCatalog.find(p => p.name === productName);
                if (product) {
                    stockElement.textContent = `Available: ${newStock} ${product.unit}`;
                }
            }
        }
    });
}

async function updateStockAfterPayment() {
    console.log('📦 Updating stock permanently after payment...');
    
    try {
        // Update stock on server for each sold item
        for (const orderItem of currentOrder) {
            const product = productCatalog.find(p => p.name === orderItem.name);
            
            if (!product || !product._id) {
                console.log(`Product not found or no ID: ${orderItem.name}`);
                continue;
            }
            
            // Update inventory stock on backend
            try {
                const response = await fetch(`${BACKEND_URL}/api/inventory/update-stock`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        productName: product.name,
                        quantitySold: orderItem.quantity,
                        action: 'subtract'
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        console.log(`✅ Stock updated for "${product.name}": Sold ${orderItem.quantity}`);
                    }
                } else {
                    console.warn(`⚠️ Failed to update stock for ${product.name}`);
                }
            } catch (syncError) {
                console.error(`Error updating stock for ${product.name}:`, syncError);
            }
        }
        
        console.log('✅ Stock updates completed');
        
    } catch (error) {
        console.error('Error updating stock:', error);
    }
}

function setDineIn() {
    orderType = "Dine In";
    
    const display = document.getElementById("orderTypeDisplay");
    if (display) display.textContent = orderType;
    
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
    
    const display = document.getElementById("orderTypeDisplay");
    if (display) display.textContent = orderType;
    
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
    
    if (displayElement) {
        let displayText = "None";
        
        switch(selectedPaymentMethod) {
            case 'cash':
                displayText = 'Cash';
                break;
            case 'gcash':
                displayText = 'GCash';
                break;
            default:
                if (selectedPaymentMethod) {
                    displayText = selectedPaymentMethod.charAt(0).toUpperCase() + selectedPaymentMethod.slice(1);
                }
        }
        
        displayElement.textContent = displayText;
    }
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
        
        setTimeout(() => {
            inputPayment.focus();
        }, 100);
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
        const change = paid - total;
        changeAmount.textContent = change.toFixed(2);
        changeSection.style.display = 'block';
    } else {
        changeSection.style.display = 'none';
    }
    
    updatePayButtonState();
}

// Save order to MongoDB - REAL BACKEND
async function saveOrderToMongoDB(orderData) {
    try {
        console.log('💾 Saving order to real database...');
        
        const response = await fetch(`${BACKEND_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData),
            credentials: 'include'
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response error:', response.status, errorText);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Order saved to real database:', result);
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
        console.error('❌ Error saving order to database:', error.message);
        throw error;
    }
}

async function completePayment(paymentMethod, total, paid, change, tableNumber) {
    console.log('💰 Processing payment with real backend...');
    
    // Calculate subtotal
    const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Prepare order data
    const orderData = {
        items: currentOrder.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: "Regular",
            image: item.image || 'default_food.jpg',
            id: item._id || null,
            vatable: item.vatable !== undefined ? item.vatable : true
        })),
        subtotal: subtotal,
        tax: 0,
        total: total,
        type: orderType || "Dine In",
        notes: "",
        payment: {
            method: paymentMethod,
            amountPaid: paid,
            change: change
        },
        tableNumber: tableNumber
    };
    
    console.log('📦 Order data:', orderData);
    
    try {
        // 1. Save to real database
        const saved = await saveOrderToMongoDB(orderData);
        
        if (saved.success) {
            // 2. PERMANENTLY update stock on server
            await updateStockAfterPayment();
            
            // 3. Print receipt
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
            
            // 4. Show success message
            showSuccessMessage(saved.orderNumber, total);
            
            // 5. Reset UI
            resetOrderUI();
            
        } else {
            throw new Error('Failed to save order');
        }
    } catch (error) {
        console.error('❌ Error in completePayment:', error.message);
        alert(`❌ Payment failed: ${error.message}\n\nPlease check:\n1. Backend server is running\n2. You are logged in\n3. Database connection is working`);
    }
}

// Show success message
function showSuccessMessage(orderNumber, total) {
    const successHTML = `
    <div id="successMessage" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    ">
        <div style="
            background: white;
            padding: 30px;
            border-radius: 15px;
            width: 90%;
            max-width: 400px;
            text-align: center;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            animation: fadeIn 0.5s;
        ">
            <div style="
                width: 80px;
                height: 80px;
                background: #28a745;
                border-radius: 50%;
                margin: 0 auto 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <i class="fas fa-check" style="color: white; font-size: 40px;"></i>
            </div>
            
            <h2 style="color: #28a745; margin-bottom: 10px;">Payment Successful!</h2>
            <p style="color: #666; margin-bottom: 20px;">Order has been completed successfully.</p>
            
            <div style="
                background: #f8f9fa;
                padding: 15px;
                border-radius: 10px;
                margin-bottom: 25px;
            ">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">Order #:</span>
                    <span style="font-weight: bold; color: #333;">${orderNumber}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #666;">Total Amount:</span>
                    <span style="font-weight: bold; color: #333; font-size: 18px;">₱${total.toFixed(2)}</span>
                </div>
            </div>
            
            <button onclick="closeSuccessMessage()" style="
                width: 100%;
                padding: 12px;
                background: #28a745;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.3s;
            " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
                OK
            </button>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

function closeSuccessMessage() {
    const successMsg = document.getElementById('successMessage');
    if (successMsg) {
        successMsg.remove();
    }
}

// MAIN PAYMENT FUNCTION
function Payment() {
    console.log('=== PAYMENT PROCESS STARTED ===');
    
    if (!Array.isArray(currentOrder) || currentOrder.length === 0) {
        alert("Please Add Product First");
        return;
    }
    
    if (!orderType || orderType.trim() === '' || orderType === "None") {
        alert("Please Choose if Dine or Take Out");
        return;
    }
    
    if (!selectedPaymentMethod || selectedPaymentMethod.trim() === '') {
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
    
    // Show confirmation modal
    showOrderConfirmation();
}

function resetOrderUI() {
    // Clear current order
    currentOrder = [];
    
    renderOrder();
    
    // Refresh menu to get fresh stock data from server
    loadAllMenuItems();
    
    // Set order type back to "None"
    setOrderTypeNone();
    
    const paymentMethodDisplayEl = document.getElementById("paymentMethodDisplay");
    if (paymentMethodDisplayEl) {
        paymentMethodDisplayEl.textContent = "None";
    }
    
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
    
    console.log('UI reset successfully');
}

function printReceipt(orderData) {
    return new Promise((resolve) => {
        const now = new Date();
        const dateString = now.toLocaleDateString('en-PH', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
        const timeString = now.toLocaleTimeString('en-PH', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const companyName = "GRAY COUNTRYSIDE CAFE";
        const storeLocation = "JD Building, Crossing, Norzagaray, Bulacan, Norzagaray, Philippines, 3013";
        const tinNumber = "XXX-XXX-XXX-XXX";
        const posSerial = "POS001";
        const minNumber = now.getTime().toString().slice(-15);
        const cashier = "CASHIER001";
        
        const invoiceNumber = `SI-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}-${Math.floor(Math.random()*10000).toString().padStart(4,'0')}`;
        const transactionNumber = `TRX-${now.getTime().toString().slice(-8)}`;
        
        const totalQuantity = orderData.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = orderData.subtotal;
        const totalDue = orderData.total;
        
        let itemsHTML = '';
        currentOrder.forEach(item => {
            const itemTotal = item.price * item.quantity;
            itemsHTML += `
                <div class="item-row">
                    <div class="item-left">
                        <span class="item-name">${item.name}</span>
                    </div>
                    <div class="item-right">
                        <span class="item-price">${itemTotal.toFixed(2)}</span>
                    </div>
                </div>
            `;
        });
        
        itemsHTML += `
            <div class="divider">---</div>
            
            <div class="subtotal-row">
                <span>SUB-TOTAL</span>
                <span>PHP ${subtotal.toFixed(2)}</span>
            </div>
            
            <div class="divider">---</div>
            
            <div class="total-due-row">
                <span>TOTAL DUE</span>
                <span>PHP ${totalDue.toFixed(2)}</span>
            </div>
        `;
        
        // Calculate VAT
        const vatableSales = orderData.vatableAmount || subtotal;
        const vatAmount = vatableSales > 0 ? vatableSales * 0.12 : 0.00;
        
        // VAT breakdown
        let vatHTML = '';
        if (vatableSales > 0) {
            vatHTML = `
                <div class="vat-breakdown">
                    <div class="vat-row">
                        <span>VATable Sales</span>
                        <span>${vatableSales.toFixed(2)}</span>
                    </div>
                    <div class="vat-row">
                        <span>VAT Amount (12%)</span>
                        <span>${vatAmount.toFixed(2)}</span>
                    </div>
                </div>
            `;
        } else {
            vatHTML = `
                <div class="vat-breakdown">
                    <div class="vat-row">
                        <span>VATable Sales</span>
                        <span>0.00</span>
                    </div>
                    <div class="vat-row">
                        <span>VAT Amount (12%)</span>
                        <span>0.00</span>
                    </div>
                </div>
            `;
        }

        const receiptContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>POS RECEIPT</title>
        <meta charset="UTF-8">
        <style>
            @media print {
                @page {
                    size: 80mm auto;
                    margin: 0;
                    padding: 0;
                }
                
                body {
                    width: 76mm;
                    margin: 0 auto;
                    padding: 1mm;
                    font-family: 'Courier New', monospace;
                    font-size: 9px;
                    line-height: 1.2;
                    background: white;
                    letter-spacing: -0.5px;
                }
                
                .no-print {
                    display: none !important;
                }
            }
            
            @media screen {
                body {
                    font-family: 'Courier New', monospace;
                    font-size: 9px;
                    line-height: 1.2;
                    width: 76mm;
                    margin: 20px auto;
                    padding: 5mm;
                    border: 1px solid #ccc;
                    background: white;
                    letter-spacing: -0.5px;
                }
            }
            
            .receipt {
                width: 100%;
                max-width: 76mm;
            }
            
            .header {
                text-align: center;
                margin-bottom: 2px;
            }
            
            .company-name {
                font-weight: bold;
                font-size: 10px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 1px;
            }
            
            .store-location {
                font-size: 8px;
                line-height: 1;
                margin: 1px 0;
            }
            
            .tin-info {
                font-size: 8px;
                margin: 2px 0;
                text-align: center;
                line-height: 1;
            }
            
            .receipt-title {
                text-align: center;
                font-size: 9px;
                font-weight: bold;
                margin: 3px 0;
            }
            
            .invoice-info {
                font-size: 8px;
                margin: 2px 0;
                text-align: center;
                line-height: 1;
            }
            
            .date-time {
                text-align: center;
                font-size: 8px;
                margin: 2px 0;
                line-height: 1;
            }
            
            .divider {
                text-align: center;
                margin: 2px 0;
                border-top: 1px dashed #000;
                border-bottom: 1px dashed #000;
                padding: 1px 0;
            }
            
            .order-type {
                text-align: center;
                font-size: 8px;
                margin: 2px 0;
                line-height: 1;
            }
            
            .items-list {
                margin: 3px 0;
            }
            
            .item-row {
                margin: 1px 0;
                line-height: 1.1;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
            }
            
            .item-left {
                flex: 1;
                display: flex;
                align-items: flex-start;
            }
            
            .item-right {
                flex-shrink: 0;
                text-align: right;
            }
            
            .item-name {
                display: inline-block;
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .item-price {
                display: inline-block;
                min-width: 25px;
                text-align: right;
            }
            
            .subtotal-row {
                margin-top: 3px;
                padding-top: 2px;
                font-size: 8px;
                line-height: 1.1;
                display: flex;
                justify-content: space-between;
            }
            
            .total-due-row {
                margin-top: 2px;
                font-size: 9px;
                font-weight: bold;
                line-height: 1.1;
                display: flex;
                justify-content: space-between;
            }
            
            .payment-method {
                font-size: 8px;
                margin: 2px 0;
                text-align: center;
                line-height: 1;
            }
            
            .vat-breakdown {
                font-size: 8px;
                margin: 3px 0;
                padding-top: 2px;
                border-top: 1px dashed #000;
            }
            
            .vat-row {
                margin: 1px 0;
                display: flex;
                justify-content: space-between;
            }
            
            .footer {
                text-align: center;
                font-size: 7px;
                margin-top: 5px;
                padding-top: 3px;
                border-top: 1px solid #000;
                line-height: 1;
            }
            
            .thank-you {
                text-align: center;
                font-size: 8px;
                font-weight: bold;
                margin: 3px 0;
                line-height: 1;
            }
            
            .print-btn {
                display: block;
                width: 100%;
                padding: 8px;
                margin-top: 10px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 11px;
            }
            
            .print-btn:hover {
                background: #0056b3;
            }
            
            .close-btn {
                display: block;
                width: 100%;
                padding: 8px;
                margin-top: 5px;
                background: #6c757d;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
                font-size: 11px;
            }
        </style>
    </head>
    <body>
        <div class="receipt">
            <div class="header">
                <div class="company-name">${companyName}</div>
                <div class="store-location">${storeLocation}</div>
            </div>
            
            <div class="tin-info">
                TIN: ${tinNumber}<br>
                POS: ${posSerial}<br>
                MIN#: ${minNumber}
            </div>
            
            <div class="receipt-title">RECEIPT</div>
            
            <div class="invoice-info">
                Trans# ${transactionNumber}<br>
                Cashier: ${cashier}
            </div>
            
            <div class="date-time">
                ${dateString} ${timeString} #02
            </div>
            
            <div class="divider">
                ---
            </div>
            
            <div class="order-type">
                ${orderData.type || 'DINE-IN'} ${orderData.tableNumber ? `(Table: ${orderData.tableNumber})` : ''}
            </div>
            
            <div class="items-list">
                ${itemsHTML}
            </div>
            
            <div class="payment-method">
                ${orderData.paymentMethod.toUpperCase()} ${orderData.amountPaid.toFixed(2)}
            </div>
            
            ${orderData.change > 0 ? `
                <div class="subtotal-row">
                    <span>CHANGE</span>
                    <span>PHP ${orderData.change.toFixed(2)}</span>
                </div>
            ` : ''}
            
            ${vatHTML}
            
            <div class="thank-you">
                THANK YOU. PLEASE COME AGAIN.
            </div>
            
            <div class="footer">
                ${dateString.replace(/\//g, '').replace(/(\d{2})(\d{2})(\d{4})/, '$3$1$2')}-${timeString}-00000<br>
            </div>
            
            <button class="print-btn no-print" onclick="window.print()">Print Receipt</button>
            <button class="close-btn no-print" onclick="window.close()">Close Window</button>
        </div>
        
        <script>
            setTimeout(function() {
                try {
                    window.print();
                } catch(e) {
                    console.log('Print failed:', e);
                }
            }, 500);
        </script>
    </body>
    </html>
    `;
        
        try {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            iframe.name = 'receiptFrame';
            document.body.appendChild(iframe);
            
            const iframeDoc = iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(receiptContent);
            iframeDoc.close();
            
            setTimeout(() => {
                try {
                    iframe.contentWindow.focus();
                    iframe.contentWindow.print();
                } catch (printError) {
                    console.log('Iframe print failed:', printError);
                }
                
                setTimeout(() => {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                    resolve();
                }, 1000);
            }, 500);
            
        } catch (error) {
            console.log('Print failed:', error);
            resolve();
        }
    });
}

function clearCurrentOrder() {
    if (currentOrder.length === 0) {
        alert("No items to clear");
        return;
    }
    
    if (confirm(`Clear current order with ${currentOrder.length} item(s)?`)) {
        // Restore stock for all items in the current order
        currentOrder.forEach(orderItem => {
            const product = productCatalog.find(p => p.name === orderItem.name);
            if (product) {
                product.stock += orderItem.quantity;
                updateStockDisplay(product.name, product.stock);
            }
        });
        
        currentOrder = [];
        renderOrder();
        
        const inputPayment = document.getElementById('inputPayment');
        if (inputPayment) {
            inputPayment.value = '';
        }
        
        const changeSection = document.getElementById('changeSection');
        if (changeSection) {
            changeSection.style.display = 'none';
        }
        
        alert("Order cleared successfully");
        updatePayButtonState();
    }
}

function filterCategory(category) {
    const categoryMapping = {
        'all': 'all',
        'Rice Bowl Meals': 'Rice Bowl Meals',
        'Hot Sizzlers': 'Hot Sizzlers',
        'Party Tray': 'Party Tray',
        'Drinks': 'Drinks',
        'Coffee': 'Coffee',
        'Milk Tea': 'Milk Tea',
        'Frappe': 'Frappe',
        'Snacks & Appetizer': 'Snacks & Appetizer',
        'Budget Meals Served with Rice': 'Budget Meals Served with Rice',
        'Specialties': 'Specialties'
    };
    
    const actualCategory = categoryMapping[category] || category;
    currentCategory = actualCategory;
    console.log(`Filtering category: ${category} -> ${actualCategory}`);
    renderMenu();
    
    document.querySelectorAll('.category-btn').forEach(btn => {
        const btnCategory = btn.getAttribute('data-category');
        if (btnCategory === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function showOrderConfirmation() {
    const orderTypeText = document.getElementById('orderTypeDisplay').textContent;
    const paymentMethodText = document.getElementById('paymentMethodDisplay').textContent;
    const total = parseFloat(document.getElementById('totals').textContent) || 0;
    const tableInput = document.getElementById('tableNumber');
    const tableNumber = tableInput ? tableInput.value : 'N/A';
    
    const subtotal = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Get payment amount if cash
    let cashAmount = 0;
    let change = 0;
    if (paymentMethodText === 'Cash') {
        const inputPayment = document.getElementById('inputPayment');
        cashAmount = inputPayment ? parseFloat(inputPayment.value) || 0 : 0;
        change = cashAmount - total;
    }
    
    // Generate a unique ID for this modal instance
    const modalId = 'simpleOrderPopup_' + Date.now();
    
    const popupHTML = `
    <div id="${modalId}" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    ">
        <div style="
            background: white;
            padding: 25px;
            border-radius: 10px;
            width: 90%;
            max-width: 450px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        ">
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
                border-bottom: 2px solid #374151;
                padding-bottom: 10px;
            ">
                <h2 style="margin: 0; color: #374151;">Order Confirmation</h2>
                <button onclick="closeSimplePopup('${modalId}')" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                ">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                    <div>
                        <small style="color: #666;">Order Type</small>
                        <div style="font-weight: bold;">${orderTypeText}</div>
                    </div>
                    <div>
                        <small style="color: #666;">Payment Method</small>
                        <div style="font-weight: bold;">${paymentMethodText}</div>
                    </div>
                </div>
                
                ${tableNumber !== 'N/A' && tableNumber !== '' && tableNumber !== 'Takeout' ? `
                <div style="margin-bottom: 10px;">
                    <small style="color: #666;">Table Number</small>
                    <div style="font-weight: bold;">${tableNumber}</div>
                </div>
                ` : ''}
                
                <div style="
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 15px 0;
                    max-height: 200px;
                    overflow-y: auto;
                ">
                    <h4 style="margin: 0 0 10px 0; color: #374151;">Order Items</h4>
                    ${currentOrder.map(item => `
                        <div style="display: flex; justify-content: space-between; margin: 5px 0; padding-bottom: 5px; border-bottom: 1px solid #eee;">
                            <span>${item.name} x${item.quantity}</span>
                            <span>₱${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                    
                    <div style="margin-top: 15px; padding-top: 10px; border-top: 2px solid #ddd;">
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                            <span>Subtotal:</span>
                            <span>₱${subtotal.toFixed(2)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                            <span>Tax:</span>
                            <span>₱0.12</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                            <span>Total Amount:</span>
                            <span style="font-weight: bold; font-size: 18px;">₱${total.toFixed(2)}</span>
                        </div>
                        
                        ${paymentMethodText === 'Cash' ? `
                            <div style="display: flex; justify-content: space-between; margin: 5px 0;">
                                <span>Amount Paid:</span>
                                <span>₱${cashAmount.toFixed(2)}</span>
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
                <button onclick="closeSimplePopup('${modalId}')" style="
                    flex: 1;
                    padding: 12px;
                    background: #f8f9fa;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    color: #666;
                ">Cancel</button>
                <button onclick="processConfirmedOrder('${modalId}')" style="
                    flex: 1;
                    padding: 12px;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">Confirm & Process</button>
            </div>
            
            <div style="
                margin-top: 20px;
                padding-top: 15px;
                border-top: 1px solid #eee;
                text-align: center;
                color: #888;
                font-size: 12px;
            ">
                © 2026 Complete Menu POS System - ALL PRODUCTS DISPLAYED
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function closeSimplePopup(modalId) {
    const popup = document.getElementById(modalId);
    if (popup) {
        popup.remove();
    }
}

function processConfirmedOrder(modalId) {
    const orderTypeDisplay = document.getElementById('orderTypeDisplay').textContent;
    const paymentMethodDisplay = document.getElementById('paymentMethodDisplay').textContent;
    const total = parseFloat(document.getElementById('totals').textContent) || 0;
    const tableInput = document.getElementById('tableNumber');
    const tableNumber = tableInput ? tableInput.value : 'N/A';
    
    // Close popup first
    closeSimplePopup(modalId);
    
    if (paymentMethodDisplay === 'Cash') {
        const inputPayment = document.getElementById('inputPayment');
        const cashAmount = inputPayment ? parseFloat(inputPayment.value) || 0 : 0;
        
        if (cashAmount < total) {
            alert(`Insufficient payment. Total: ₱${total.toFixed(2)} | Paid: ₱${cashAmount.toFixed(2)}`);
            return;
        }
        
        const change = cashAmount - total;
        
        // Process cash payment
        completePayment('cash', total, cashAmount, change, tableNumber);
        
    } else if (paymentMethodDisplay === 'GCash') {
        // Process GCash payment
        completePayment('gcash', total, total, 0, tableNumber);
        
    } else {
        alert(`Unsupported payment method: ${paymentMethodDisplay}`);
    }
}

// Setup category button listeners
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

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key closes modals
    if (event.key === 'Escape') {
        const simplePopup = document.querySelector('[id^="simpleOrderPopup_"]');
        if (simplePopup) simplePopup.remove();
        closeSuccessMessage();
    }
    
    // F5 to refresh data
    if (event.key === 'F5') {
        event.preventDefault();
        loadAllMenuItems();
    }
});

// Close modals when clicking outside
document.addEventListener('click', function(event) {
    const orderPopup = document.querySelector('[id^="simpleOrderPopup_"]');
    const successMsg = document.getElementById('successMessage');
    
    if (orderPopup && event.target === orderPopup) {
        orderPopup.remove();
    }
    
    if (successMsg && event.target === successMsg) {
        closeSuccessMessage();
    }
});