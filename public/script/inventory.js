// ==================== UI ELEMENTS ====================
let elements = {}; // Will be initialized after DOM loads

function initializeElements() {
    elements = {
        // Modal elements
        itemModal: document.getElementById('itemModal'),
        modalTitle: document.getElementById('modalTitle'),
        itemForm: document.getElementById('itemForm'),
        closeModal: document.getElementById('closeModal'),
        
        // Form fields
        itemId: document.getElementById('itemId'),
        itemName: document.getElementById('itemName'),
        itemType: document.getElementById('itemTypes'),
        itemCategory: document.getElementById('itemCategories'),
        itemUnit: document.getElementById('itemUnit'),
        currentStock: document.getElementById('currentStock'),
        minStock: document.getElementById('minStock'),
        maxStock: document.getElementById('maxStock'),
        description: document.getElementById('description'),
        
        // Buttons
        addNewItem: document.getElementById('addNewItem'),
        saveItemBtn: document.getElementById('saveItemBtn'),
        cancelBtn: document.getElementById('cancelBtn'),
        refreshDashboard: document.getElementById('refreshDashboard'),
        bulkOrder: document.getElementById('bulkOrder'),
        syncAllBtn: document.getElementById('syncAllBtn'),
        showMappingsBtn: document.getElementById('showMappingsBtn'),
        clearAllDataBtn: document.getElementById('clearAllDataBtn'),
        
        // Grid containers
        inventoryGrid: document.getElementById('inventoryGrid'),
        dashboardGrid: document.getElementById('dashboardGrid'),
        
        // Dashboard stats
        totalItems: document.getElementById('totalItems'),
        lowStock: document.getElementById('lowStock'),
        outOfStock: document.getElementById('outOfStock'),
        totalProducts: document.getElementById('totalProducts'),
        inventoryValue: document.getElementById('inventoryValue'),
        
        // Navigation
        navLinks: document.querySelectorAll('.nav-link[data-section]'),
        categoryItems: document.querySelectorAll('.category-item[data-category]'),
        
        // Info displays
        rawIngredientsList: document.getElementById('rawIngredientsList'),
        mappingStatus: document.getElementById('mappingStatus'),
        recipeInfo: document.getElementById('recipeInfo'),
        
        // Search
        searchInput: document.getElementById('searchInventory')
    };
    
    // Log which elements were found
    console.log('✅ itemModal:', elements.itemModal);
    console.log('✅ Dashboard Grid:', elements.dashboardGrid);
    console.log('✅ Inventory Grid:', elements.inventoryGrid);
    console.log('✅ Nav Links:', elements.navLinks?.length || 0);
}

// ==================== GLOBAL VARIABLES ====================
let allInventoryItems = [];
let currentSection = 'dashboard';
let currentCategory = '';
let isModalOpen = false;

const categoryUnitsMapping = {
    'meat': ['g', 'kg', 'pieces'],
    'seafood': ['g', 'kg', 'pieces'],
    'produce': ['g', 'kg', 'pieces', 'bundles'],
    'dairy': ['ml', 'liters', 'pieces'],
    'dry': ['g', 'kg', 'ml', 'liters', 'pieces'],
    'beverage': ['ml', 'liters', 'pieces'],
    'packaging': ['pieces', 'boxes']
};

const validRawIngredients = {
    // Meat & Poultry
    'Pork slices': 'meat',
    'Pork belly': 'meat',
    'Chicken': 'meat',
    'Ground pork': 'meat',
    'Beef shanks': 'meat',
    'Pork ribs': 'meat',
    'Bacon': 'meat',
    'Ham': 'meat',
    
    // Seafood
    'Cream dory fillet': 'seafood',
    'Shrimp': 'seafood',
    'Smoked fish': 'seafood',
    
    // Dairy
    'Butter': 'dairy',
    'Eggs': 'dairy',
    'Milk': 'dairy',
    'Cheese': 'dairy',
    
    // Produce
    'Garlic': 'produce',
    'Onion': 'produce',
    'Carrots': 'produce',
    'Cabbage': 'produce',
    'Tomato': 'produce',
    'Lettuce': 'produce',
    'Ginger': 'produce',
    'Calamansi': 'produce',
    
    // Dry Goods
    'Soy sauce': 'dry',
    'Brown sugar': 'dry',
    'Salt': 'dry',
    'Black pepper': 'dry',
    'Cooking oil': 'dry',
    'Flour': 'dry',
    'Vinegar': 'dry',
    'Sugar': 'dry',
    'Ice': 'dry',
    'Water': 'dry',
    
    // Beverages
    'Sprite': 'beverage',
    'Coke': 'beverage',
    
    // Packaging
    'Paper cups': 'packaging',
    'Straws': 'packaging',
    'Napkins': 'packaging'
};

const recipeMapping = {
    'Chicken': ['Fried Chicken', 'Buttered Chicken'],
    'Pork slices': ['Pork Adobo', 'Sizzling Pork'],
    'Eggs': ['Fried Rice', 'Omelette'],
    'Garlic': ['Most Dishes'],
    'Onion': ['Most Dishes'],
    'Soy sauce': ['Adobo', 'Stir Fry']
};

// ==================== IN STOCK FUNCTIONS ====================

function getInStockCount() {
    return allInventoryItems.filter(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const minStock = parseFloat(item.minStock) || 10;
        return currentStock > minStock; // Stock is above minimum threshold
    }).length;
}

function getInStockItems() {
    return allInventoryItems.filter(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const minStock = parseFloat(item.minStock) || 10;
        return currentStock > minStock; // Stock is above minimum threshold
    });
}

function updateInStockIndicator(inStockCount, totalCount) {
    const inStockEl = document.getElementById('inStock');
    const statCard = inStockEl ? inStockEl.closest('.stat-card') : null;
    
    if (!statCard) return;
    
    // Calculate percentage
    const percentage = totalCount > 0 ? Math.round((inStockCount / totalCount) * 100) : 0;
    
    // Update the text with percentage
    const statChangeEl = statCard.querySelector('.stat-change');
    if (statChangeEl) {
        statChangeEl.textContent = `${percentage}% stocked`;
        
        // Color code based on percentage
        if (percentage >= 70) {
            statChangeEl.className = 'stat-change positive';
        } else if (percentage >= 50) {
            statChangeEl.className = 'stat-change warning';
        } else {
            statChangeEl.className = 'stat-change negative';
        }
    }
    
    // Update card color based on status
    if (percentage >= 70) {
        statCard.classList.remove('warning', 'critical');
        statCard.classList.add('in-stock-stat');
    } else if (percentage >= 50) {
        statCard.classList.remove('in-stock-stat', 'critical');
        statCard.classList.add('warning');
    } else {
        statCard.classList.remove('in-stock-stat', 'warning');
        statCard.classList.add('critical');
    }
}

// ==================== UPDATED DASHBOARD STATS FUNCTION ====================

function updateDashboardStats() {
    console.log('📊 Updating dashboard stats...');
    console.log('Total items:', allInventoryItems.length);
    
    // Get the correct element IDs from HTML
    const totalItemsEl = document.getElementById('allInventoryItems');
    const lowStockEl = document.getElementById('lowStock');
    const outOfStockEl = document.getElementById('outOfStock');
    const inStockEl = document.getElementById('inStock'); // Added for In Stock
    
    if (!totalItemsEl || !lowStockEl || !outOfStockEl || !inStockEl) {
        console.warn('⚠️ Some dashboard stat elements not found');
        return;
    }
    
    // Calculate stats
    const totalItems = allInventoryItems.length;
    const lowStockItems = allInventoryItems.filter(item => isLowStock(item)).length;
    const outOfStockItems = allInventoryItems.filter(item => isOutOfStock(item)).length;
    const inStockItems = getInStockCount(); // Get In Stock count
    
    // Update UI
    totalItemsEl.textContent = totalItems;
    lowStockEl.textContent = lowStockItems;
    outOfStockEl.textContent = outOfStockItems;
    inStockEl.textContent = inStockItems; // Update In Stock count
    
    // Update In Stock indicator with percentage
    updateInStockIndicator(inStockItems, totalItems);
    
    console.log('✅ Dashboard stats updated:', { 
        totalItems, 
        inStockItems,
        lowStockItems, 
        outOfStockItems 
    });
}

// ==================== FIXED MISSING FUNCTIONS ====================

function updateCategoryOptions() {
    if (!elements.itemCategory) return;
    
    // Clear existing options
    elements.itemCategory.innerHTML = '<option value="">Select Category</option>';
    
    // Add category options
    const categories = {
        'meat': 'Meat & Poultry',
        'seafood': 'Seafood',
        'produce': 'Vegetables & Fruits',
        'dairy': 'Dairy & Eggs',
        'dry': 'Dry Goods',
        'beverage': 'Beverages',
        'packaging': 'Packaging'
    };
    
    Object.entries(categories).forEach(([value, label]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = label;
        elements.itemCategory.appendChild(option);
    });
}

function updateItemNameOptions() {
    if (!elements.itemName) return;
    
    // Store current value
    const currentValue = elements.itemName.value;
    
    // Clear existing options
    elements.itemName.innerHTML = '<option value="">Select Item</option>';
    
    // Add valid raw ingredients as options
    Object.keys(validRawIngredients).forEach(itemName => {
        const option = document.createElement('option');
        option.value = itemName;
        option.textContent = itemName;
        elements.itemName.appendChild(option);
    });
    
    // Restore current value
    elements.itemName.value = currentValue;
}

function updateUnitOptions(category) {
    if (!elements.itemUnit) return;
    
    // Clear existing options
    elements.itemUnit.innerHTML = '<option value="">Select Unit</option>';
    
    const units = categoryUnitsMapping[category] || ['pieces', 'g', 'kg', 'ml', 'liters'];
    
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        elements.itemUnit.appendChild(option);
    });
}

function openEditModal(itemId) {
    const item = allInventoryItems.find(item => item._id === itemId);
    if (!item) {
        showToast('Item not found', 'error');
        return;
    }
    
    if (elements.modalTitle) elements.modalTitle.textContent = 'Edit Item';
    if (elements.itemId) elements.itemId.value = item._id;
    if (elements.itemName) elements.itemName.value = item.itemName;
    if (elements.itemType) elements.itemType.value = item.itemType || 'raw';
    if (elements.itemCategory) elements.itemCategory.value = item.category || getCategoryFromName(item.itemName);
    if (elements.itemUnit) elements.itemUnit.value = item.unit || getUnitFromItem(item.itemName, item.category);
    if (elements.currentStock) elements.currentStock.value = item.currentStock || 0;
    if (elements.minStock) elements.minStock.value = item.minStock || 10;
    if (elements.maxStock) elements.maxStock.value = item.maxStock || 50;
    if (elements.description) elements.description.value = item.description || '';
    
    // Update unit options based on category
    updateUnitOptions(item.category);
    
    // Show recipe info if applicable
    showRecipeInfo(item.itemName);
    
    // Open modal
    elements.itemModal.style.display = 'flex';
    isModalOpen = true;
    
    setTimeout(() => {
        elements.itemModal.classList.add('show');
    }, 10);
}

function openRestockModal(itemId) {
    const item = allInventoryItems.find(item => item._id === itemId);
    if (!item) {
        showToast('Item not found', 'error');
        return;
    }
    
    const currentStock = parseFloat(item.currentStock) || 0;
    const minStock = parseFloat(item.minStock) || 10;
    const maxStock = parseFloat(item.maxStock) || 50;
    const unit = item.unit || 'pieces';
    const neededQuantity = Math.max(0, minStock - currentStock);
    const suggestedRestock = Math.min(maxStock - currentStock, Math.max(neededQuantity, 10));
    
    // Create restock modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.5); display: flex; justify-content: center; 
        align-items: center; z-index: 10000;
    `;
    
    let html = `
        <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; width: 90%;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3>🔄 Restock ${item.itemName}</h3>
                <button onclick="this.closest('.modal').remove()" style="background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div><strong>Current Stock:</strong> ${currentStock} ${unit}</div>
                <div><strong>Minimum Required:</strong> ${minStock} ${unit}</div>
                <div><strong>Maximum Capacity:</strong> ${maxStock} ${unit}</div>
                <div><strong>Needed to Reach Minimum:</strong> ${neededQuantity} ${unit}</div>
            </div>
            
            <form id="restockForm" style="margin-bottom: 20px;">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Amount to Add:</label>
                    <input type="number" id="restockAmount" value="${suggestedRestock}" 
                           min="1" max="${maxStock - currentStock}" step="0.1" 
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <small style="color: #666;">Suggested: ${suggestedRestock} ${unit}</small>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Supplier (Optional):</label>
                    <input type="text" id="restockSupplier" 
                           placeholder="e.g., Local Market, Supplier Name" 
                           style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Notes (Optional):</label>
                    <textarea id="restockNotes" rows="3" 
                              placeholder="Any notes about this restock..." 
                              style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
                </div>
            </form>
            
            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <button onclick="this.closest('.modal').remove()" 
                        style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Cancel
                </button>
                <button onclick="submitRestock('${item._id}')" 
                        style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Restock
                </button>
            </div>
        </div>
    `;
    
    modal.innerHTML = html;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

async function submitRestock(itemId) {
    const modal = document.querySelector('.modal');
    if (!modal) return;
    
    const amountInput = modal.querySelector('#restockAmount');
    const supplierInput = modal.querySelector('#restockSupplier');
    const notesInput = modal.querySelector('#restockNotes');
    
    if (!amountInput) {
        showToast('Restock amount is required', 'error');
        return;
    }
    
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount) || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    const item = allInventoryItems.find(item => item._id === itemId);
    if (!item) {
        showToast('Item not found', 'error');
        return;
    }
    
    const maxStock = parseFloat(item.maxStock) || 50;
    const currentStock = parseFloat(item.currentStock) || 0;
    
    if (currentStock + amount > maxStock) {
        showToast(`Cannot exceed maximum stock of ${maxStock}`, 'error');
        return;
    }
    
    try {
        showLoading('Processing restock...');
        
        // Call API to update stock
        const response = await fetch(`/api/inventory/${itemId}/restock`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount: amount,
                supplier: supplierInput?.value || '',
                notes: notesInput?.value || '',
                previousStock: currentStock,
                newStock: currentStock + amount
            }),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(`Restocked ${amount} ${item.unit} of ${item.itemName}`, 'success');
            
            // Update local data
            item.currentStock = currentStock + amount;
            
            // Update UI
            renderInventoryGrid();
            renderRestockGrid();
            renderDashboardGrid();
            updateDashboardStats(); // This will update In Stock count
            
            // Update menu availability
            await updateMenuAvailability();
            
            // Close modal
            modal.remove();
        } else {
            throw new Error(data.message || 'Failed to restock');
        }
    } catch (error) {
        console.error('Error restocking item:', error);
        showToast(`Failed to restock: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

function renderDashboardGrid() {
    if (!elements.dashboardGrid) return;
    
    // Sort items by stock status (out of stock first, then low stock)
    const sortedItems = [...allInventoryItems].sort((a, b) => {
        const aStock = parseFloat(a.currentStock) || 0;
        const bStock = parseFloat(b.currentStock) || 0;
        const aMin = parseFloat(a.minStock) || 10;
        const bMin = parseFloat(b.minStock) || 10;
        
        if (aStock === 0 && bStock > 0) return -1;
        if (aStock > 0 && bStock === 0) return 1;
        if (aStock <= aMin && bStock > bMin) return -1;
        if (aStock > aMin && bStock <= bMin) return 1;
        return 0;
    });
    
    // Take only top 12 items for dashboard
    const displayItems = sortedItems.slice(0, 12);
    
    if (displayItems.length === 0) {
        elements.dashboardGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <h3>No inventory data</h3>
                <p>Add items to see dashboard statistics</p>
                <button onclick="openAddModal()" class="btn btn-primary mt-3">➕ Add Items</button>
            </div>
        `;
        return;
    }
    
    const gridHTML = displayItems.map(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const maxStock = parseFloat(item.maxStock) || 50;
        const minStock = parseFloat(item.minStock) || 10;
        const unit = item.unit || 'pieces';
        const isOutOfStock = currentStock === 0;
        const isLowStock = currentStock > 0 && currentStock <= minStock;
        const isInStock = currentStock > minStock; // Check if item is in stock
        const percentage = maxStock > 0 ? Math.min(100, (currentStock / maxStock) * 100) : 0;
        
        // Get affected dishes count
        const affectedDishes = recipeMapping[item.itemName] ? recipeMapping[item.itemName].length : 0;
        
        return `
        <div class="dashboard-card ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : isInStock ? 'in-stock' : ''}">
            <div class="card-header">
                <h4>${item.itemName}</h4>
                <span class="card-badge ${isOutOfStock ? 'badge-danger' : isLowStock ? 'badge-warning' : 'badge-success'}">
                    ${isOutOfStock ? 'Out' : isLowStock ? 'Low' : 'Good'}
                </span>
            </div>
            <div class="card-body">
                <div class="stock-info">
                    <div class="stock-bar">
                        <div class="stock-bar-fill" style="width: ${percentage}%; 
                            background-color: ${isOutOfStock ? '#dc3545' : isLowStock ? '#ffc107' : '#28a745'};">
                        </div>
                    </div>
                    <div class="stock-numbers">
                        <span>${currentStock}${unit}</span>
                        <span>/ ${maxStock}${unit}</span>
                    </div>
                </div>
                <div class="card-details">
                    <div class="detail">
                        <span class="label">Min:</span>
                        <span class="value">${minStock}${unit}</span>
                    </div>
                    <div class="detail">
                        <span class="label">Status:</span>
                        <span class="value">${isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}</span>
                    </div>
                    ${affectedDishes > 0 ? `
                    <div class="detail">
                        <span class="label">Used in:</span>
                        <span class="value">${affectedDishes} dish${affectedDishes !== 1 ? 'es' : ''}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            <div class="card-footer">
                <button class="btn btn-sm ${isOutOfStock ? 'btn-danger' : isLowStock ? 'btn-warning' : 'btn-secondary'}" 
                        onclick="openRestockModal('${item._id}')">
                    ${isOutOfStock ? '🔄 Restock' : isLowStock ? '⚠️ Restock' : '📝 Edit'}
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    elements.dashboardGrid.innerHTML = gridHTML;
}

// ==================== FIXED HELPER FUNCTIONS ====================

function filterByCategory(category) {
    currentCategory = category;
    
    // Update active category in UI
    elements.categoryItems.forEach(item => {
        if (item.getAttribute('data-category') === category) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update UI based on current section
    if (currentSection === 'inventory') {
        renderInventoryGrid();
    } else if (currentSection === 'dashboard') {
        renderDashboardGrid();
    } else if (currentSection === 'restock') {
        renderRestockGrid();
    }
}

function showSection(section) {
    currentSection = section;
    
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(sec => {
        sec.classList.remove('active-section');
        sec.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active-section');
        targetSection.style.display = 'block';
    }
    
    // Update active nav - fix for nav links
    if (elements.navLinks && elements.navLinks.length > 0) {
        elements.navLinks.forEach(link => {
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Render appropriate grid
    if (section === 'dashboard') {
        renderDashboardGrid();
        updateDashboardStats(); // This will update In Stock count
    } else if (section === 'inventory') {
        renderInventoryGrid();
    } else if (section === 'restock') {
        renderRestockGrid();
    }
}

function debounceSearch(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        if (currentSection === 'inventory') {
            renderInventoryGrid();
        } else if (currentSection === 'dashboard') {
            renderDashboardGrid();
        }
        return;
    }
    
    const filteredItems = allInventoryItems.filter(item => {
        const searchLower = searchTerm.toLowerCase();
        return item.itemName.toLowerCase().includes(searchLower) ||
               (item.category && item.category.toLowerCase().includes(searchLower)) ||
               (item.description && item.description.toLowerCase().includes(searchLower));
    });
    
    if (currentSection === 'inventory') {
        renderFilteredInventoryGrid(filteredItems);
    } else if (currentSection === 'dashboard') {
        renderFilteredDashboardGrid(filteredItems);
    }
}

function renderFilteredInventoryGrid(filteredItems) {
    if (!elements.inventoryGrid) return;
    
    if (filteredItems.length === 0) {
        elements.inventoryGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>No items found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
        return;
    }
    
    const gridHTML = filteredItems.map(item => {
        // Same rendering logic as renderInventoryGrid
        const currentStock = parseFloat(item.currentStock) || 0;
        const maxStock = parseFloat(item.maxStock) || 50;
        const minStock = parseFloat(item.minStock) || 10;
        const unit = item.unit || 'pieces';
        const isOutOfStock = currentStock === 0;
        const isLowStock = currentStock > 0 && currentStock <= minStock;
        const isInStock = currentStock > minStock;
        
        let recipeInfo = '';
        if (recipeMapping[item.itemName]) {
            const dishes = recipeMapping[item.itemName];
            const dishList = dishes.slice(0, 2).join(', ');
            
            recipeInfo = `
                <div class="recipe-tooltip">
                    <small><strong>Can make ${dishes.length} dishes:</strong> ${dishList}${dishes.length > 2 ? '...' : ''}</small>
                </div>
            `;
        }
        
        return `
        <div class="inventory-card ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : isInStock ? 'in-stock' : ''}">
            <div class="card-header">
                <h4>${item.itemName}</h4>
                <div class="card-actions">
                    <button class="btn-icon" onclick="openEditModal('${item._id}')">Edit</button>
                </div>
            </div>
            <div class="card-body">
                <div class="card-info">
                    <span class="label">Category:</span> ${getCategoryLabel(item.category)}
                </div>
                <div class="card-info">
                    <span class="label">Current Stock:</span> ${currentStock} ${unit}
                </div>
                <div class="card-info">
                    <span class="label">Min Stock:</span> ${minStock} ${unit}
                </div>
                <div class="card-info">
                    <span class="label">Max Stock:</span> ${maxStock} ${unit}
                </div>
                <div class="card-info">
                    <span class="label">Status:</span> 
                    <span class="status ${isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'}">
                        ${isOutOfStock ? 'Out of Stock' : isLowStock ? 'Low Stock' : 'In Stock'}
                    </span>
                </div>
                ${recipeInfo}
            </div>
        </div>
        `;
    }).join('');
    
    elements.inventoryGrid.innerHTML = gridHTML;
}

// ==================== HELPER FUNCTIONS ====================

function getCategoryFromName(itemName) {
    return validRawIngredients[itemName] || 'dry';
}

function getUnitFromItem(itemName, category) {
    return categoryUnitsMapping[category]?.[0] || 'pieces';
}

function getItemTypeFromName(itemName) {
    return validRawIngredients[itemName] ? 'raw' : 'finished';
}

function getCategoryLabel(category) {
    const labels = {
        'meat': 'Meat & Poultry',
        'seafood': 'Seafood',
        'produce': 'Vegetables & Fruits',
        'dairy': 'Dairy & Eggs',
        'dry': 'Dry Goods',
        'beverage': 'Beverages',
        'packaging': 'Packaging',
        'all': 'All Raw Ingredients'
    };
    return labels[category] || category;
}

function showRecipeInfo(itemName) {
    if (!elements.recipeInfo) return;
    
    const recipes = recipeMapping[itemName] || [];
    if (recipes.length > 0) {
        elements.recipeInfo.innerHTML = `
            <strong>Used in:</strong><br>
            ${recipes.join('<br>')}
        `;
        elements.recipeInfo.style.display = 'block';
    } else {
        elements.recipeInfo.style.display = 'none';
    }
}

function isLowStock(item) {
    if (!item) return false;
    const currentStock = parseFloat(item.currentStock) || 0;
    const minStock = parseFloat(item.minStock) || 10;
    return currentStock > 0 && currentStock <= minStock;
}

function isOutOfStock(item) {
    if (!item) return false;
    const currentStock = parseFloat(item.currentStock) || 0;
    return currentStock === 0;
}

// ==================== LOADING & NOTIFICATION FUNCTIONS ====================

function showLoading(message = 'Loading...') {
    hideLoading();
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column;
        justify-content: center; align-items: center; z-index: 9999;
        color: white; font-size: 18px;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px; height: 50px; border: 5px solid rgba(255,255,255,0.3);
        border-radius: 50%; border-top-color: white;
        animation: spin 1s ease-in-out infinite; margin-bottom: 20px;
    `;
    
    const loadingText = document.createElement('div');
    loadingText.textContent = message;
    loadingText.style.cssText = `margin-top: 10px; font-size: 16px;`;
    
    if (!document.getElementById('loadingSpinnerStyles')) {
        const style = document.createElement('style');
        style.id = 'loadingSpinnerStyles';
        style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
    
    loadingOverlay.appendChild(spinner);
    loadingOverlay.appendChild(loadingText);
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: relative; padding: 15px 20px; border-radius: 4px;
        color: white; margin-bottom: 10px; animation: slideIn 0.3s ease-in;
    `;
    
    const bgColors = {
        'success': '#28a745',
        'error': '#dc3545',
        'info': '#17a2b8',
        'warning': '#ffc107'
    };
    toast.style.backgroundColor = bgColors[type] || bgColors['success'];
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        display: flex; flex-direction: column; gap: 10px;
    `;
    document.body.appendChild(container);
    return container;
}

// ==================== MODAL FUNCTIONS ====================

function openAddModal() {
    if (elements.modalTitle) elements.modalTitle.textContent = 'Add New Item';
    if (elements.itemId) elements.itemId.value = '';
    if (elements.itemForm) elements.itemForm.reset();
    updateCategoryOptions();
    updateItemNameOptions();
    updateUnitOptions('dry');
    if (elements.itemModal) {
        elements.itemModal.style.display = 'flex';
        isModalOpen = true;
    }
}

function closeModal() {
    if (elements.itemModal) {
        elements.itemModal.style.display = 'none';
        isModalOpen = false;
    }
    if (elements.itemForm) elements.itemForm.reset();
}

// ==================== AUTO-FILL FROM CATEGORY ====================

function autoFillItemFromCategory(category) {
    if (!elements.itemName || !elements.itemCategory) return;
    
    console.log(`🔄 Auto-filling from category: ${category}`);
    
    // Set the category dropdown
    elements.itemCategory.value = category;
    
    // Update unit options based on category
    updateUnitOptions(category);
    
    // Get items in this category
    const categoryItems = Object.entries(validRawIngredients)
        .filter(([itemName, itemCategory]) => itemCategory === category)
        .map(([itemName]) => itemName);
    
    if (categoryItems.length > 0) {
        // Clear current options and add category-specific ones
        elements.itemName.innerHTML = '<option value="">Select Item</option>';
        
        categoryItems.forEach(itemName => {
            const option = document.createElement('option');
            option.value = itemName;
            option.textContent = itemName;
            elements.itemName.appendChild(option);
        });
        
        // Auto-select the first item
        const firstItem = categoryItems[0];
        elements.itemName.value = firstItem;
        
        // Auto-fill other fields
        const unit = getUnitFromItem(firstItem, category);
        if (elements.itemUnit) {
            elements.itemUnit.value = unit;
        }
        
        // Set item type
        if (elements.itemType) {
            elements.itemType.value = getItemTypeFromName(firstItem);
        }
        
        // Set default stock values
        if (elements.currentStock) elements.currentStock.value = 0;
        if (elements.minStock) elements.minStock.value = 10;
        if (elements.maxStock) elements.maxStock.value = 50;
        
        // Show recipe info if applicable
        showRecipeInfo(firstItem);
        
        console.log(`✅ Auto-filled: ${firstItem}`);
        showToast(`Auto-filled with "${firstItem}" from ${getCategoryLabel(category)}`, 'info');
    } else {
        // Show message if category is empty
        console.log(`ℹ️ No items found in ${category} category`);
        showToast(`No items found in ${getCategoryLabel(category)} category`, 'warning');
    }
}

async function handleSaveItem() {
    const itemId = elements.itemId ? elements.itemId.value : '';
    const isEdit = itemId && itemId.trim() !== '';
    
    const itemData = {
        _id: isEdit ? itemId : undefined,
        itemId: itemId,
        itemName: elements.itemName ? elements.itemName.value : '',
        itemType: elements.itemType ? elements.itemType.value : 'raw',
        category: elements.itemCategory ? elements.itemCategory.value : '',
        unit: elements.itemUnit ? elements.itemUnit.value : '',
        currentStock: elements.currentStock ? parseFloat(elements.currentStock.value) || 0 : 0,
        minStock: elements.minStock ? parseFloat(elements.minStock.value) || 10 : 10,
        maxStock: elements.maxStock ? parseFloat(elements.maxStock.value) || 50 : 50,
        description: elements.description ? elements.description.value : ''
    };
    
    if (!itemData.itemName || !itemData.itemType || !itemData.category) {
        showToast('Please fill in all required fields', 'error');
        return;
    }
    
    try {
        showLoading(isEdit ? 'Updating item...' : 'Adding item...');
        
        const url = isEdit ? `/api/inventory/${itemData._id}` : '/api/inventory';
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(itemData),
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            showToast(isEdit ? 'Item updated successfully!' : 'Item added successfully!', 'success');
            await fetchInventoryItems();
            renderInventoryGrid();
            updateDashboardStats(); // This will update In Stock count
            updateCategoryCounts();
            closeModal();
        } else {
            throw new Error(data.message || 'Failed to save item');
        }
    } catch (error) {
        console.error('Error saving item:', error);
        showToast(`Failed to save item: ${error.message}`, 'error');
    } finally {
        hideLoading();
    }
}

function updateFromItemName() {
    const itemName = elements.itemName?.value;
    if (!itemName) return;
    
    const category = getCategoryFromName(itemName);
    const unit = getUnitFromItem(itemName, category);
    
    if (elements.itemType) elements.itemType.value = 'raw';
    if (elements.itemCategory) elements.itemCategory.value = category;
    if (elements.itemUnit) {
        elements.itemUnit.value = unit;
        updateUnitOptions(category);
    }
}

async function fetchInventoryItems() {
    try {
        const response = await fetch('/api/inventory', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.message || 'Failed to fetch inventory items');
        
        if (data.success) {
            allInventoryItems = (data.data || []).map(item => ({
                ...item,
                maxStock: parseFloat(item.maxStock) || 50,
                minStock: parseFloat(item.minStock) || 10,
                currentStock: parseFloat(item.currentStock) || 0,
                unit: item.unit || 'pieces',
                category: item.category || getCategoryFromName(item.itemName),
                itemType: item.itemType || 'raw'
            }));
        }
    } catch (error) {
        console.error('Error fetching inventory:', error);
        showToast(`Failed to load inventory: ${error.message}`, 'error');
    }
}

function renderInventoryGrid() {
    if (!elements.inventoryGrid) return;
    
    if (allInventoryItems.length === 0) {
        elements.inventoryGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📦</div>
                <h3>No inventory items</h3>
                <p>Add items to get started</p>
                <button onclick="openAddModal()" class="btn btn-primary mt-3">➕ Add Items</button>
            </div>
        `;
        return;
    }
    
    const gridHTML = allInventoryItems.map(item => {
        const currentStock = parseFloat(item.currentStock) || 0;
        const minStock = parseFloat(item.minStock) || 10;
        const unit = item.unit || 'pieces';
        const isOutOfStockItem = isOutOfStock(item);
        const isLowStockItem = isLowStock(item);
        const isInStockItem = currentStock > minStock;
        
        return `
        <div class="inventory-card ${isOutOfStockItem ? 'out-of-stock' : isLowStockItem ? 'low-stock' : isInStockItem ? 'in-stock' : ''}">
            <div class="card-header">
                <h4>${item.itemName}</h4>
                <button class="btn-icon" onclick="openEditModal('${item._id}')">✏️ Edit</button>
            </div>
            <div class="card-body">
                <div class="card-info"><span class="label">Category:</span> ${getCategoryLabel(item.category)}</div>
                <div class="card-info"><span class="label">Stock:</span> ${currentStock} ${unit}</div>
                <div class="card-info"><span class="label">Min:</span> ${minStock} ${unit}</div>
                <div class="card-info">
                    <span class="label">Status:</span> 
                    <span class="status ${isOutOfStockItem ? 'out-of-stock' : isLowStockItem ? 'low-stock' : 'in-stock'}">
                        ${isOutOfStockItem ? 'Out of Stock' : isLowStockItem ? 'Low Stock' : 'In Stock'}
                    </span>
                </div>
            </div>
        </div>
        `;
    }).join('');
    
    elements.inventoryGrid.innerHTML = gridHTML;
}

// ==================== FIXED EVENT LISTENER INITIALIZATION ====================

function initializeEventListeners() {
    console.log('Initializing event listeners...');
    
    // Button event listeners
    if (elements.addNewItem) {
        elements.addNewItem.addEventListener('click', openAddModal);
        console.log('Add new item button listener added');
    }
    
    if (elements.saveItemBtn) {
        elements.saveItemBtn.addEventListener('click', handleSaveItem);
    }
    
    if (elements.cancelBtn) {
        elements.cancelBtn.addEventListener('click', closeModal);
    }
    
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', closeModal);
    }
    
    if (elements.refreshDashboard) {
        elements.refreshDashboard.addEventListener('click', () => {
            fetchInventoryItems();
            updateDashboardStats(); // This will update In Stock count
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
    }
    
    // Form field changes
    if (elements.itemName) {
        elements.itemName.addEventListener('change', updateFromItemName);
    }
    
    if (elements.itemCategory) {
        elements.itemCategory.addEventListener('change', function() {
            updateUnitOptions(this.value);
        });
    }
    
    // Category items click listeners - open modal and auto-fill
    if (elements.categoryItems && elements.categoryItems.length > 0) {
        elements.categoryItems.forEach(categoryItem => {
            categoryItem.addEventListener('click', (e) => {
                const category = categoryItem.getAttribute('data-category');
                
                // Skip the "all" category
                if (category !== 'all') {
                    // Open the modal first
                    openAddModal();
                    
                    // Then auto-fill from the category
                    setTimeout(() => {
                        autoFillItemFromCategory(category);
                    }, 100);
                }
            });
        });
        console.log(`✅ Category item listeners added: ${elements.categoryItems.length}`);
    } else {
        console.warn('⚠️ No category items found for event listeners');
    }
}

// ==================== ADD THESE STYLES TO YOUR CSS ====================

// Add this to your CSS file or in a <style> tag
const inventoryStyles = `
.toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 15px 20px;
    border-radius: 4px;
    color: white;
    z-index: 10000;
    animation: slideIn 0.3s ease-in;
}

.toast-success { background-color: #28a745; }
.toast-error { background-color: #dc3545; }
.toast-info { background-color: #17a2b8; }

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

.inventory-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    transition: all 0.3s ease;
}

.inventory-card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transform: translateY(-2px);
}

.inventory-card.out-of-stock {
    border-left: 4px solid #dc3545;
    background-color: #fff8f8;
}

.inventory-card.low-stock {
    border-left: 4px solid #ffc107;
    background-color: #fffdf6;
}

.inventory-card.in-stock {
    border-left: 4px solid #28a745;
    background-color: #f8fff8;
}

.status {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
}

.status.in-stock { background-color: #d4edda; color: #155724; }
.status.low-stock { background-color: #fff3cd; color: #856404; }
.status.out-of-stock { background-color: #f8d7da; color: #721c24; }

.loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    display: none;
}

.loader-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

.empty-state-icon {
    font-size: 48px;
    margin-bottom: 20px;
    opacity: 0.5;
}

.notification-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #dc3545;
    color: white;
    border-radius: 10px;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: bold;
    min-width: 20px;
    text-align: center;
}

/* In Stock Stat Card Styles */
.stat-card.in-stock-stat {
    border-left: 4px solid #28a745;
    background: linear-gradient(135deg, #f8fff8 0%, #f0f9f0 100%);
}

.stat-card.in-stock-stat .stat-value {
    color: #28a745;
    font-size: 2.2rem;
    font-weight: bold;
}

.stat-card.in-stock-stat .stat-icon {
    background-color: #28a745;
    color: white;
}

.stat-change.positive {
    color: #28a745;
    font-weight: bold;
}

.stat-change.warning {
    color: #ffc107;
    font-weight: bold;
}

.stat-change.negative {
    color: #dc3545;
    font-weight: bold;
}

/* Make sure other stat cards have appropriate colors */
.stat-card.warning {
    border-left: 4px solid #ffc107;
    background: linear-gradient(135deg, #fffdf6 0%, #fff8e1 100%);
}

.stat-card.warning .stat-value {
    color: #ffc107;
}

.stat-card.critical {
    border-left: 4px solid #dc3545;
    background: linear-gradient(135deg, #fff8f8 0%, #ffe6e6 100%);
}

.stat-card.critical .stat-value {
    color: #dc3545;
}

/* Stat card hover effects */
.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

/* Stat dashboard grid layout */
.stats-dashboard {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.stat-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 15px;
    background-color: #007bff;
    color: white;
}

.stat-value {
    font-size: 2rem;
    font-weight: bold;
    margin: 10px 0;
}

.stat-change {
    font-size: 0.9rem;
    color: #666;
}
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = inventoryStyles;
document.head.appendChild(styleSheet);

// ==================== CATEGORY COUNT UPDATES ====================

function updateCategoryCounts() {
    console.log('📊 Updating category counts...');
    
    if (!elements.categoryItems || elements.categoryItems.length === 0) {
        console.warn('⚠️ Category items not found');
        return;
    }
    
    elements.categoryItems.forEach(categoryItem => {
        const category = categoryItem.getAttribute('data-category');
        
        let count = 0;
        if (category === 'all') {
            count = allInventoryItems.length;
        } else if (category === 'in-stock') {
            count = getInStockCount();
        } else if (category === 'low-stock') {
            count = allInventoryItems.filter(item => isLowStock(item)).length;
        } else if (category === 'out-of-stock') {
            count = allInventoryItems.filter(item => isOutOfStock(item)).length;
        } else {
            count = allInventoryItems.filter(item => item.category === category).length;
        }
        
        const countElement = categoryItem.querySelector('.category-count');
        if (countElement) {
            countElement.textContent = count;
            console.log(`✅ ${category}: ${count} items`);
        }
    });
}

// ==================== INITIALIZE THE SYSTEM ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inventory Management System initializing...');
    
    // Initialize DOM elements first
    initializeElements();
    
    // Initialize all components
    initializeEventListeners();
    updateCategoryOptions();
    updateItemNameOptions();
    
    // Load initial data BEFORE showing sections
    fetchInventoryItems().then(() => {
        console.log('📦 Inventory items loaded:', allInventoryItems.length);
        
        // Update all UI components
        updateCategoryCounts();
        updateDashboardStats(); // This will update In Stock count
        
        // Show default section AFTER data is loaded
        showSection('dashboard');
        renderDashboardGrid();
        
        console.log('✅ Inventory system initialized successfully');
        
        // Log stats for debugging
        console.log(`📊 In Stock items: ${getInStockCount()} out of ${allInventoryItems.length}`);
    }).catch(error => {
        console.error('❌ Error during initialization:', error);
        showToast('Failed to load inventory', 'error');
    });
    
    // Set up periodic refresh
    setInterval(fetchInventoryItems, 30000); // Every 30 seconds
});

// ==================== EXPORT FUNCTIONS TO GLOBAL SCOPE ====================

window.updateDashboardStats = updateDashboardStats;
window.openEditModal = openEditModal;
window.openRestockModal = openRestockModal;
window.submitRestock = submitRestock;
window.filterByCategory = filterByCategory;
window.showSection = showSection;
window.debounceSearch = debounceSearch;
window.closeModal = closeModal;
window.handleSaveItem = handleSaveItem;
window.updateFromItemName = updateFromItemName;
window.openAddModal = openAddModal;
window.fetchInventoryItems = fetchInventoryItems;
window.renderInventoryGrid = renderInventoryGrid;
window.renderRestockGrid = renderRestockGrid;
window.updateCategoryCounts = updateCategoryCounts;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.initializeEventListeners = initializeEventListeners;
window.getInStockCount = getInStockCount;
window.getInStockItems = getInStockItems;