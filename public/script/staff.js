let currentOrder = [];
let orderType = null;
let currentCategory = 'all';
let selectedPaymentMethod = null;
let productCatalog = [];
let staffInventory = [];
let pendingStockRequests = [];
let outOfStockItems = [];

// Track active stock requests
let activeStockRequestModals = new Set();
let stockRequestTimestamps = {};

// Flag to prevent multiple submissions
let isSubmittingStockRequest = false;

// ==================== 🔴 ADMIN NOTIFICATION TRACKING ====================
let outOfStockNotifications = new Set();

// ==================== 🔴 EVENT SOURCE FOR REAL-TIME UPDATES ====================
let stockEventSource = null;

// ==================== 🔴 MAXIMUM STOCK LIMIT ====================
const MAX_STOCK_PER_ITEM = 100;

// ==================== 🍽️ SERVINGWARE INVENTORY ====================
let servingwareInventory = {
    'plate': { name: 'Plate', current: 100, max: 100, unit: 'piece', minThreshold: 20 },
    'tray': { name: 'Party Tray', current: 100, max: 100, unit: 'piece', minThreshold: 15 },
    'glass': { name: 'Glass', current: 100, max: 100, unit: 'piece', minThreshold: 25 },
    'sizzling plate': { name: 'Sizzling Plate', current: 100, max: 100, unit: 'piece', minThreshold: 20 },
    'cup': { name: 'Coffee Cup', current: 100, max: 100, unit: 'piece', minThreshold: 20 },
    'bowl': { name: 'Rice Bowl', current: 100, max: 100, unit: 'piece', minThreshold: 30 },
    'pitcher': { name: 'Pitcher', current: 50, max: 50, unit: 'piece', minThreshold: 10 },
    'bottle': { name: 'Bottle', current: 100, max: 100, unit: 'piece', minThreshold: 20 },
    'serving': { name: 'Serving Plate', current: 80, max: 80, unit: 'piece', minThreshold: 15 },
    'sandwich': { name: 'Sandwich Plate', current: 50, max: 50, unit: 'piece', minThreshold: 10 },
    'meal': { name: 'Meal Tray', current: 100, max: 100, unit: 'piece', minThreshold: 20 },
    'pot': { name: 'Cooking Pot', current: 30, max: 30, unit: 'piece', minThreshold: 5 }
};

// ==================== 🥩 INGREDIENT INVENTORY ====================
let ingredientInventory = {
    'pork': { name: 'Pork', current: 50, max: 500, unit: 'kg', minThreshold: 20 },
    'chicken': { name: 'Chicken', current: 40, max: 300, unit: 'kg', minThreshold: 15 },
    'beef': { name: 'Beef', current: 30, max: 200, unit: 'kg', minThreshold: 10 },
    'shrimp': { name: 'Shrimp', current: 20, max: 100, unit: 'kg', minThreshold: 8 },
    'fish': { name: 'Cream Dory', current: 25, max: 150, unit: 'kg', minThreshold: 10 },
    'pork_belly': { name: 'Pork Belly', current: 30, max: 100, unit: 'kg', minThreshold: 10 },
    'pork_chop': { name: 'Pork Chop', current: 25, max: 80, unit: 'kg', minThreshold: 8 },
    'onion': { name: 'Onion', current: 15, max: 50, unit: 'kg', minThreshold: 5 },
    'garlic': { name: 'Garlic', current: 10, max: 30, unit: 'kg', minThreshold: 3 },
    'cabbage': { name: 'Cabbage', current: 12, max: 40, unit: 'kg', minThreshold: 5 },
    'carrot': { name: 'Carrot', current: 10, max: 30, unit: 'kg', minThreshold: 5 },
    'bell_pepper': { name: 'Bell Pepper', current: 8, max: 20, unit: 'kg', minThreshold: 3 },
    'calamansi': { name: 'Calamansi', current: 8, max: 20, unit: 'kg', minThreshold: 5 },
    'tomato': { name: 'Tomato', current: 10, max: 30, unit: 'kg', minThreshold: 5 },
    'potato': { name: 'Potato', current: 25, max: 100, unit: 'kg', minThreshold: 10 },
    'cucumber': { name: 'Cucumber', current: 10, max: 30, unit: 'kg', minThreshold: 5 },
    'eggplant': { name: 'Eggplant', current: 10, max: 30, unit: 'kg', minThreshold: 5 },
    'green_beans': { name: 'Green Beans', current: 10, max: 30, unit: 'kg', minThreshold: 5 },
    'rice': { name: 'Rice', current: 80, max: 200, unit: 'kg', minThreshold: 30 }
};

// ==================== 🍽️ PRODUCT INGREDIENT MAPPING ====================
const productIngredientMap = {
    'Korean Spicy Bulgogi (Pork)': {
        ingredients: { 
            'pork': 0.2, 
            'onion': 0.05, 
            'garlic': 0.02, 
            'gochujang': 0.03,
            'sesame_oil': 0.01,
            'soy_sauce': 0.03, 
            'cooking_oil': 0.02,
            'salt': 0.01,
            'black_pepper': 0.01,
            'chili': 0.01
        },
        servingware: 'plate'
    },
    'Korean Salt and Pepper (Pork)': {
        ingredients: { 
            'pork': 0.2, 
            'onion': 0.05, 
            'garlic': 0.02, 
            'gochujang': 0.03,
            'sesame_oil': 0.01,
            'soy_sauce': 0.03, 
            'cooking_oil': 0.02,
            'salt': 0.01,
            'black_pepper': 0.01,
            'peppercorn': 0.01
        },
        servingware: 'plate'
    },
    'Crispy Pork Lechon Kawali': {
        ingredients: { 
            'pork_belly': 0.25, 
            'garlic': 0.02, 
            'onion': 0.03,
            'salt': 0.01,
            'cooking_oil': 0.1,
            'cornstarch': 0.02
        },
        servingware: 'plate'
    },
    'Pork Shanghai': {
        ingredients: { 
            'pork': 0.15, 
            'garlic': 0.02, 
            'onion': 0.03,
            'carrots': 0.02,
            'breadcrumbs': 0.03,
            'flour': 0.02,
            'cornstarch': 0.02,
            'cooking_oil': 0.05,
            'egg': 0.02
        },
        servingware: 'plate'
    },
    'Sinigang (Pork)': {
        ingredients: { 
            'pork': 0.25, 
            'onion': 0.05, 
            'garlic': 0.02,
            'tomato': 0.05,
            'calamansi': 0.02,
            'chili': 0.01,
            'shrimp_paste': 0.02,
            'tamarind_mix': 0.03,
            'salt': 0.01,
            'black_pepper': 0.01,
            'bay_leaves': 0.01,
            'water': 0.3
        },
        servingware: 'bowl'
    },
    'Sizzling Pork Sisig': {
        ingredients: { 
            'pork': 0.2, 
            'onion': 0.05, 
            'garlic': 0.02,
            'chili': 0.02,
            'calamansi': 0.02,
            'egg': 0.05,
            'mayonnaise': 0.03,
            'soy_sauce': 0.02,
            'oyster_sauce': 0.02,
            'cooking_oil': 0.02,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'sizzling_plate'
    },
    'Sizzling Liempo': {
        ingredients: { 
            'pork_belly': 0.25, 
            'onion': 0.05, 
            'garlic': 0.02,
            'cooking_oil': 0.02,
            'salt': 0.01
        },
        servingware: 'sizzling_plate'
    },
    'Sizzling Porkchop': {
        ingredients: { 
            'pork': 0.25, 
            'onion': 0.05, 
            'garlic': 0.02,
            'cooking_oil': 0.02,
            'salt': 0.01
        },
        servingware: 'sizzling_plate'
    },
    'Buttered Honey Chicken': {
        ingredients: { 
            'chicken': 0.25, 
            'butter': 0.03,
            'honey': 0.03,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'Buttered Spicy Chicken': {
        ingredients: { 
            'chicken': 0.25, 
            'butter': 0.03,
            'cooking_oil': 0.02,
            'chili': 0.02
        },
        servingware: 'plate'
    },
    'Chicken Adobo': {
        ingredients: { 
            'chicken': 0.25, 
            'onion': 0.05, 
            'garlic': 0.02,
            'tomato': 0.05,
            'soy_sauce': 0.04,
            'bay_leaves': 0.01,
            'salt': 0.01,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'Fried Chicken': {
        ingredients: { 
            'chicken': 0.25, 
            'breadcrumbs': 0.03,
            'flour': 0.03,
            'cooking_oil': 0.1,
            'salt': 0.01
        },
        servingware: 'plate'
    },
    'Sizzling Fried Chicken': {
        ingredients: { 
            'chicken': 0.25, 
            'onion': 0.05, 
            'garlic': 0.02,
            'cooking_oil': 0.1,
            'salt': 0.01
        },
        servingware: 'sizzling_plate'
    },
    'Budget Fried Chicken': {
        ingredients: { 
            'chicken': 0.15, 
            'breadcrumbs': 0.02,
            'flour': 0.02,
            'cooking_oil': 0.08,
            'salt': 0.01
        },
        servingware: 'plate'
    },
    'Clubhouse Sandwich': {
        ingredients: { 
            'chicken': 0.1, 
            'bread': 0.1,
            'mayonnaise': 0.02,
            'gravy': 0.03
        },
        servingware: 'plate'
    },
    'Cream Dory Fish Fillet': {
        ingredients: { 
            'cream_dory': 0.2, 
            'breadcrumbs': 0.02,
            'flour': 0.02,
            'cooking_oil': 0.05,
            'salt': 0.01
        },
        servingware: 'plate'
    },
    'Fish and Fries': {
        ingredients: { 
            'cream_dory': 0.15, 
            'french_fries': 0.15,
            'breadcrumbs': 0.02,
            'flour': 0.02,
            'cooking_oil': 0.08,
            'salt': 0.01
        },
        servingware: 'plate'
    },
    'Sinigang (Shrimp)': {
        ingredients: { 
            'shrimp': 0.2, 
            'onion': 0.05, 
            'garlic': 0.02,
            'tomato': 0.05,
            'calamansi': 0.02,
            'chili': 0.01,
            'shrimp_paste': 0.02,
            'tamarind_mix': 0.03,
            'salt': 0.01,
            'black_pepper': 0.01,
            'bay_leaves': 0.01,
            'water': 0.3
        },
        servingware: 'bowl'
    },
    'Buttered Shrimp': {
        ingredients: { 
            'shrimp': 0.2, 
            'butter': 0.03,
            'calamansi': 0.02,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'plate'
    },
    'Special Bulalo': {
        ingredients: { 
            'shrimp': 0.1,
            'corn': 0.1,
            'potato': 0.1,
            'carrots': 0.1,
            'onion': 0.05,
            'garlic': 0.02,
            'bay_leaves': 0.01,
            'salt': 0.01,
            'water': 0.3,
            'chicken_broth': 0.2
        },
        servingware: 'bowl'
    },
    'Paknet (Pakbet w/ Bagnet)': {
        ingredients: { 
            'bagnet': 0.15,
            'onion': 0.05, 
            'garlic': 0.02,
            'tomato': 0.05,
            'cucumber': 0.05,
            'corn': 0.05,
            'potato': 0.05,
            'carrots': 0.05,
            'salt': 0.01,
            'black_pepper': 0.01
        },
        servingware: 'plate'
    },
    'Pancit Bihon': {
        ingredients: { 
            'rice_noodles': 0.15,
            'onion': 0.03, 
            'garlic': 0.02,
            'carrots': 0.05,
            'soy_sauce': 0.02,
            'oyster_sauce': 0.02,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'Pancit Canton + Bihon (Mixed)': {
        ingredients: { 
            'pancit_canton': 0.1,
            'rice_noodles': 0.1,
            'onion': 0.03, 
            'garlic': 0.02,
            'carrots': 0.05,
            'soy_sauce': 0.02,
            'oyster_sauce': 0.02,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'Spaghetti (Filipino Style)': {
        ingredients: { 
            'spaghetti_pasta': 0.15,
            'onion': 0.03, 
            'garlic': 0.02,
            'tomato': 0.05,
            'soy_sauce': 0.02,
            'sweet_tomato_sauce': 0.05,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'Tinapa Rice': {
        ingredients: { 
            'rice': 0.2,
            'tinapa': 0.05
        },
        servingware: 'plate'
    },
    'Tuyo Pesto': {
        ingredients: { 
            'rice': 0.2,
            'tuyo': 0.03,
            'shrimp_paste': 0.02
        },
        servingware: 'plate'
    },
    'Fried Rice': {
        ingredients: { 
            'rice': 0.2,
            'onion': 0.02, 
            'garlic': 0.02,
            'egg': 0.05,
            'soy_sauce': 0.01,
            'sesame_oil': 0.01,
            'sugar': 0.01,
            'salt': 0.01,
            'water': 0.02,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'Plain Rice': {
        ingredients: { 
            'rice': 0.2,
            'salt': 0.01,
            'water': 0.02
        },
        servingware: 'cup'
    },
    'Cheesy Nachos': {
        ingredients: { 
            'nacho_chips': 0.15,
            'onion': 0.02,
            'cheese_sauce': 0.05,
            'cheese': 0.03,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'Nachos Supreme': {
        ingredients: { 
            'nacho_chips': 0.15,
            'onion': 0.02,
            'cheese_sauce': 0.05,
            'cheese': 0.03,
            'cooking_oil': 0.02
        },
        servingware: 'plate'
    },
    'French Fries': {
        ingredients: { 
            'french_fries': 0.2,
            'flour': 0.02,
            'cooking_oil': 0.08,
            'salt': 0.01
        },
        servingware: 'plate'
    },
    'Cheesy Dynamite Lumpia': {
        ingredients: { 
            'lumpia_wrapper': 0.1,
            'cheese': 0.05,
            'cheese_sauce': 0.03,
            'cornstarch': 0.02,
            'cooking_oil': 0.05
        },
        servingware: 'plate'
    },
    'Lumpiang Shanghai': {
        ingredients: { 
            'lumpia_wrapper': 0.1,
            'pork': 0.1,
            'carrots': 0.03,
            'onion': 0.02,
            'garlic': 0.01,
            'breadcrumbs': 0.02,
            'flour': 0.02,
            'cornstarch': 0.02,
            'cooking_oil': 0.05
        },
        servingware: 'plate'
    },
    'Cucumber Lemonade': {
        ingredients: { 
            'cucumber': 0.05,
            'lemon_juice': 0.03,
            'honey': 0.02,
            'sugar': 0.02,
            'calamansi': 0.02,
            'water': 0.25
        },
        servingware: 'glass'
    },
    'Blue Lemonade': {
        ingredients: { 
            'blue_syrup': 0.03,
            'lemon_juice': 0.03,
            'honey': 0.02,
            'sugar': 0.02,
            'calamansi': 0.02,
            'water': 0.25
        },
        servingware: 'glass'
    },
    'Red Tea': {
        ingredients: { 
            'black_tea': 0.02,
            'honey': 0.02,
            'sugar': 0.02,
            'hot_water': 0.25
        },
        servingware: 'glass'
    },
    'Cafe Americano': {
        ingredients: { 
            'coffee_beans': 0.02,
            'sugar': 0.02,
            'hot_water': 0.25
        },
        servingware: 'cup'
    },
    'Cafe Latte': {
        ingredients: { 
            'espresso': 0.05,
            'milk': 0.15,
            'sugar': 0.02,
            'vanilla_syrup': 0.02,
            'steamed_milk': 0.1
        },
        servingware: 'cup'
    },
    'Caramel Macchiato': {
        ingredients: { 
            'espresso': 0.05,
            'milk': 0.15,
            'sugar': 0.02,
            'caramel_syrup': 0.03,
            'steamed_milk': 0.1,
            'cream': 0.02
        },
        servingware: 'cup'
    },
    'Milk Tea': {
        ingredients: { 
            'milk': 0.15,
            'tea': 0.05,
            'sugar': 0.02,
            'tapioca_pearls': 0.05
        },
        servingware: 'glass'
    },
    'Matcha Green Tea': {
        ingredients: { 
            'matcha_powder': 0.02,
            'milk': 0.15,
            'tea': 0.05,
            'sugar': 0.02,
            'tapioca_pearls': 0.05
        },
        servingware: 'glass'
    },
    'Cookies & Cream': {
        ingredients: { 
            'milk': 0.15,
            'cream': 0.05,
            'sugar': 0.02,
            'tapioca_pearls': 0.05,
            'cookie_crumbs': 0.03
        },
        servingware: 'glass'
    },
    'Strawberry & Cream': {
        ingredients: { 
            'milk': 0.15,
            'cream': 0.05,
            'sugar': 0.02,
            'strawberry_syrup': 0.03,
            'tapioca_pearls': 0.05
        },
        servingware: 'glass'
    },
    'Mango Cheesecake': {
        ingredients: { 
            'milk': 0.15,
            'cream': 0.05,
            'cream_cheese_flavor': 0.03,
            'mango_flavor': 0.03,
            'sugar': 0.02,
            'tapioca_pearls': 0.05
        },
        servingware: 'glass'
    },
    'Soda': {
        ingredients: { 
            'carbonated_soft_drink': 0.33
        },
        servingware: 'can'
    }
};

// ==================== 🍽️ MENU DATABASE BY CATEGORY ====================
const menuDatabase = {
    'Rice': [
        { name: 'Korean Spicy Bulgogi (Pork)', unit: 'plate', defaultPrice: 180 },
        { name: 'Korean Salt and Pepper (Pork)', unit: 'plate', defaultPrice: 180 },
        { name: 'Crispy Pork Lechon Kawali', unit: 'plate', defaultPrice: 180 },
        { name: 'Cream Dory Fish Fillet', unit: 'plate', defaultPrice: 170 },
        { name: 'Buttered Honey Chicken', unit: 'plate', defaultPrice: 170 },
        { name: 'Buttered Spicy Chicken', unit: 'plate', defaultPrice: 170 },
        { name: 'Chicken Adobo', unit: 'plate', defaultPrice: 170 },
        { name: 'Pork Shanghai', unit: 'plate', defaultPrice: 180 },
        { name: 'Sizzling Pork Sisig', unit: 'sizzling plate', defaultPrice: 190 },
        { name: 'Sizzling Liempo', unit: 'sizzling plate', defaultPrice: 190 },
        { name: 'Sizzling Porkchop', unit: 'sizzling plate', defaultPrice: 190 },
        { name: 'Sizzling Fried Chicken', unit: 'sizzling plate', defaultPrice: 180 },
        { name: 'Fried Chicken', unit: 'plate', defaultPrice: 160 },
        { name: 'Budget Fried Chicken', unit: 'plate', defaultPrice: 120 },
        { name: 'Tinapa Rice', unit: 'plate', defaultPrice: 150 },
        { name: 'Tuyo Pesto', unit: 'plate', defaultPrice: 150 },
        { name: 'Fried Rice', unit: 'plate', defaultPrice: 120 },
        { name: 'Plain Rice', unit: 'cup', defaultPrice: 40 },
        { name: 'Sinigang (Pork)', unit: 'bowl', defaultPrice: 220 },
        { name: 'Sinigang (Shrimp)', unit: 'bowl', defaultPrice: 220 },
        { name: 'Paknet (Pakbet w/ Bagnet)', unit: 'plate', defaultPrice: 190 },
        { name: 'Buttered Shrimp', unit: 'plate', defaultPrice: 190 },
        { name: 'Special Bulalo', unit: 'bowl', defaultPrice: 250 }
    ],
    'Sizzling': [
        { name: 'Sizzling Pork Sisig', unit: 'sizzling plate', defaultPrice: 190 },
        { name: 'Sizzling Liempo', unit: 'sizzling plate', defaultPrice: 190 },
        { name: 'Sizzling Porkchop', unit: 'sizzling plate', defaultPrice: 190 },
        { name: 'Sizzling Fried Chicken', unit: 'sizzling plate', defaultPrice: 180 }
    ],
    'Party': [
        { name: 'Pancit Bihon', unit: 'plate', defaultPrice: 160 },
        { name: 'Pancit Canton + Bihon (Mixed)', unit: 'plate', defaultPrice: 170 },
        { name: 'Spaghetti (Filipino Style)', unit: 'plate', defaultPrice: 160 },
        { name: 'Lumpiang Shanghai', unit: 'plate (6 pcs)', defaultPrice: 140 },
        { name: 'Pork Shanghai', unit: 'plate', defaultPrice: 180 }
    ],
    'Snack & Appetizer': [
        { name: 'Cheesy Nachos', unit: 'plate', defaultPrice: 150 },
        { name: 'Nachos Supreme', unit: 'plate', defaultPrice: 180 },
        { name: 'French Fries', unit: 'plate', defaultPrice: 120 },
        { name: 'Cheesy Dynamite Lumpia', unit: 'plate (6 pcs)', defaultPrice: 150 },
        { name: 'Lumpiang Shanghai', unit: 'plate (6 pcs)', defaultPrice: 140 }
    ],
    'Budget Meals Served with Rice': [
        { name: 'Budget Fried Chicken', unit: 'plate', defaultPrice: 120 },
        { name: 'Plain Rice', unit: 'cup', defaultPrice: 40 }
    ],
    'Specialties': [
        { name: 'Special Bulalo', unit: 'bowl', defaultPrice: 250 },
        { name: 'Sinigang (Pork)', unit: 'bowl', defaultPrice: 220 },
        { name: 'Sinigang (Shrimp)', unit: 'bowl', defaultPrice: 220 },
        { name: 'Paknet (Pakbet w/ Bagnet)', unit: 'plate', defaultPrice: 190 },
        { name: 'Tinapa Rice', unit: 'plate', defaultPrice: 150 },
        { name: 'Tuyo Pesto', unit: 'plate', defaultPrice: 150 }
    ],
    'Drink': [
        { name: 'Cucumber Lemonade', unit: 'glass', defaultPrice: 90 },
        { name: 'Blue Lemonade', unit: 'glass', defaultPrice: 90 },
        { name: 'Red Tea', unit: 'glass', defaultPrice: 70 },
        { name: 'Soda', unit: 'can', defaultPrice: 50 }
    ],
    'Cafe': [
        { name: 'Cafe Americano', unit: 'cup', defaultPrice: 80 },
        { name: 'Cafe Latte', unit: 'cup', defaultPrice: 100 },
        { name: 'Caramel Macchiato', unit: 'cup', defaultPrice: 110 }
    ],
    'Milk': [
        { name: 'Milk Tea', unit: 'glass', defaultPrice: 90 },
        { name: 'Matcha Green Tea', unit: 'glass', defaultPrice: 100 },
        { name: 'Cookies & Cream', unit: 'glass', defaultPrice: 100 },
        { name: 'Strawberry & Cream', unit: 'glass', defaultPrice: 100 },
        { name: 'Mango Cheesecake', unit: 'glass', defaultPrice: 100 }
    ]
};

// ==================== 🏷️ CATEGORY DISPLAY NAMES ====================
const categoryDisplayNames = {
    'Rice': 'Rice Bowl Meals',
    'Sizzling': 'Hot Sizzlers',
    'Party': 'Party Tray',
    'Drink': 'Drinks',
    'Cafe': 'Coffee',
    'Milk': 'Milk Tea',
    'Snack & Appetizer': 'Snacks & Appetizer',
    'Budget Meals Served with Rice': 'Budget Meals',
    'Specialties': 'Specialties'
};

// ==================== 🖼️ PRODUCT IMAGE MAPPING ====================
const productImageMap = {
    'Korean Spicy Bulgogi (Pork)': 'rice/korean_spicy_bulgogi.png',
    'Korean Salt and Pepper (Pork)': 'rice/korean_salt_pepper_pork.png',
    'Crispy Pork Lechon Kawali': 'pork/crispy_lechon_kawali.png',
    'Pork Shanghai': 'pork/pork_shanghai.png',
    'Sinigang (Pork)': 'soup/sinigang_pork.png',
    'Sizzling Pork Sisig': 'sizzling/sizzling_pork_sisig.png',
    'Sizzling Liempo': 'sizzling/sizzling_liempo.png',
    'Sizzling Porkchop': 'sizzling/sizzling_porkchop.png',
    'Buttered Honey Chicken': 'chicken/buttered_honey_chicken.png',
    'Buttered Spicy Chicken': 'chicken/buttered_spicy_chicken.png',
    'Chicken Adobo': 'chicken/chicken_adobo.png',
    'Fried Chicken': 'chicken/fried_chicken.png',
    'Sizzling Fried Chicken': 'sizzling/sizzling_fried_chicken.png',
    'Budget Fried Chicken': 'budget/budget_fried_chicken.png',
    'Clubhouse Sandwich': 'snacks/clubhouse_sandwich.png',
    'Cream Dory Fish Fillet': 'seafood/cream_dory_fillet.png',
    'Fish and Fries': 'seafood/fish_and_fries.png',
    'Sinigang (Shrimp)': 'soup/sinigang_shrimp.png',
    'Buttered Shrimp': 'seafood/buttered_shrimp.png',
    'Special Bulalo': 'soup/special_bulalo.png',
    'Paknet (Pakbet w/ Bagnet)': 'vegetables/paknet.png',
    'Pancit Bihon': 'noodles/pancit_bihon.png',
    'Pancit Canton + Bihon (Mixed)': 'noodles/pancit_canton_bihon.png',
    'Spaghetti (Filipino Style)': 'pasta/filipino_spaghetti.png',
    'Tinapa Rice': 'rice/tinapa_rice.png',
    'Tuyo Pesto': 'rice/tuyo_pesto.png',
    'Fried Rice': 'rice/fried_rice.png',
    'Plain Rice': 'rice/plain_rice.png',
    'Cheesy Nachos': 'snacks/cheesy_nachos.png',
    'Nachos Supreme': 'snacks/nachos_supreme.png',
    'French Fries': 'snacks/french_fries.png',
    'Cheesy Dynamite Lumpia': 'snacks/cheesy_dynamite.png',
    'Lumpiang Shanghai': 'snacks/lumpiang_shanghai.png',
    'Cucumber Lemonade': 'drinks/cucumber_lemonade.png',
    'Blue Lemonade': 'drinks/blue_lemonade.png',
    'Red Tea': 'drinks/red_tea.png',
    'Cafe Americano': 'coffee/americano.png',
    'Cafe Latte': 'coffee/latte.png',
    'Caramel Macchiato': 'coffee/caramel_macchiato.png',
    'Milk Tea': 'milktea/milk_tea.png',
    'Matcha Green Tea': 'milktea/matcha.png',
    'Cookies & Cream': 'milktea/cookies_cream.png',
    'Strawberry & Cream': 'milktea/strawberry_cream.png',
    'Mango Cheesecake': 'milktea/mango_cheesecake.png',
    'Soda': 'drinks/soda.png'
};

const BACKEND_URL = window.location.origin;

// ==================== 📸 GET PRODUCT IMAGE ====================
function getProductImage(productName) {
    return productImageMap[productName] || 'default_food.jpg';
}

// ==================== 🎯 TOAST NOTIFICATION ====================
function showToast(message, type = 'success', duration = 3000) {
    // Remove existing toast
    const existingToast = document.getElementById('activeToast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.id = 'activeToast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : type === 'warning' ? '#ff9800' : '#17a2b8'};
        color: white;
        border-radius: 8px;
        z-index: 99999;
        font-weight: bold;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        animation: slideInRight 0.3s ease-in-out;
        max-width: 400px;
        word-wrap: break-word;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    if (duration > 0) {
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, duration);
    }
    
    return toast;
}

// ==================== 📋 LOAD ALL MENU ITEMS ====================
async function loadAllMenuItems() {
    console.log('📋 Loading menu items...');
    
    try {
        const response = await fetch('/api/menu', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.success && result.data && Array.isArray(result.data)) {
            productCatalog = [];
            outOfStockItems = [];
            
            result.data.forEach(item => {
                const currentStock = parseInt(item.currentStock) || 0;
                
                const product = {
                    name: item.name || item.itemName || 'Unknown',
                    price: item.price || 0,
                    category: categoryDisplayNames[item.category] || item.category || 'Uncategorized',
                    image: getProductImage(item.name || item.itemName || ''),
                    stock: currentStock,
                    unit: item.unit || 'piece',
                    _id: item._id || `temp_${Date.now()}_${Math.random()}`,
                    maxStock: item.maxStock || MAX_STOCK_PER_ITEM,
                    status: currentStock > 0 ? 'in_stock' : 'out_of_stock'
                };
                
                productCatalog.push(product);
                
                if (currentStock <= 0) {
                    outOfStockItems.push(product.name);
                }
            });
            
            console.log(`✅ Loaded ${productCatalog.length} products`);
            renderMenu();
            return true;
        }
        
        loadFromLocalMenuDatabase();
        return false;
        
    } catch (error) {
        console.error('❌ Error loading menu:', error);
        loadFromLocalMenuDatabase();
        return false;
    }
}

// ==================== 📋 LOCAL DATABASE FALLBACK ====================
function loadFromLocalMenuDatabase() {
    console.log('📋 Loading from local menu database...');
    
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
                _id: `local_${Date.now()}_${menuItem.name.replace(/\s+/g, '_')}`,
                maxStock: MAX_STOCK_PER_ITEM,
                status: 'out_of_stock'
            };
            
            productCatalog.push(product);
            outOfStockItems.push(product.name);
        }
    }
    
    console.log(`✅ Loaded ${productCatalog.length} products from local database`);
    renderMenu();
}

// ==================== 🎯 RENDER MENU ====================
function renderMenu() {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    
    container.innerHTML = '';

    const items = currentCategory === 'all'
        ? productCatalog
        : productCatalog.filter(p => p.category === currentCategory);

    if (items.length === 0) {
        container.innerHTML = '<div class="no-results">No products found</div>';
        return;
    }

    items.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

// ==================== 🎯 PRODUCT CARD ====================
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'compact-product-card';
    
    card.dataset.productName = product.name;
    card.dataset.productId = product._id;
    card.dataset.stock = product.stock || 0;
    
    card.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (product.stock > 0) {
            addItemToOrder(product.name, product.price, product);
        } else {
            showRequestStockModal(product);
        }
    };
    
    const stockStatus = product.stock > 0 
        ? `✅ In Stock: ${product.stock}`
        : `🚫 OUT OF STOCK`;
    
    const stockColor = product.stock > 0 ? '#28a745' : '#dc3545';
    
    // Check if there's a pending request for this product
    const hasPendingRequest = pendingStockRequests.includes(product.name);
    const pendingIndicator = hasPendingRequest ? '<span style="color: #ff9800; font-size: 12px; display: block;">⏳ Request Pending</span>' : '';
    
    card.innerHTML = `
        <img src="/images/${product.image}" 
             onerror="this.onerror=null; this.src='/images/default_food.jpg';" 
             alt="${product.name}"
             style="opacity: ${product.stock > 0 ? '1' : '0.7'};" />
        <div class="compact-product-name">${product.name}</div>
        <div class="compact-product-category">${product.category}</div>
        <div class="compact-product-price">₱${product.price}</div>
        <div class="compact-product-stock" style="color: ${stockColor}; font-weight: bold;">
            ${stockStatus}
            ${pendingIndicator}
        </div>
    `;
    
    return card;
}

// ==================== 🔴 ADD ITEM TO ORDER ====================
function addItemToOrder(name, price, product = null) {
    if (!product) {
        product = productCatalog.find(p => p.name === name);
    }
    
    if (!product || product.stock <= 0) {
        alert(`❌ ${name} is out of stock`);
        if (product) showRequestStockModal(product);
        return;
    }
    
    const existingItem = currentOrder.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
        existingItem.subtotal = existingItem.quantity * existingItem.price;
        product.stock--;
    } else {
        currentOrder.push({
            name: product.name,
            price: product.price,
            quantity: 1,
            subtotal: product.price,
            unit: product.unit,
            _id: product._id
        });
        product.stock--;
    }
    
    if (product.stock === 0) {
        product.status = 'out_of_stock';
        if (!outOfStockItems.includes(product.name)) {
            outOfStockItems.push(product.name);
        }
    }
    
    renderOrder();
    renderMenu();
    updatePayButtonState();
}

// ==================== 🧾 ORDER FUNCTIONS ====================
function renderOrder() {
    const list = document.getElementById('productlist');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('totals');

    if (!list) return;

    list.innerHTML = '';
    let subtotal = 0;

    currentOrder.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        list.innerHTML += `
            <li style="display: flex; justify-content: space-between; align-items: center; padding: 5px 0;">
                <span>${item.name} x${item.quantity}</span>
                <span>₱${itemTotal.toFixed(2)}</span>
                <button onclick="removeItemFromOrder(${index})" style="background: #dc3545; color: white; border: none; border-radius: 3px; cursor: pointer; padding: 2px 8px;">✕</button>
            </li>`;
    });

    if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `${subtotal.toFixed(2)}`;
}

function removeItemFromOrder(index) {
    const item = currentOrder[index];
    const product = productCatalog.find(p => p.name === item.name);
    
    if (product) {
        product.stock += item.quantity;
        if (product.stock > 0) {
            product.status = 'in_stock';
            outOfStockItems = outOfStockItems.filter(name => name !== product.name);
        }
    }
    
    currentOrder.splice(index, 1);
    renderOrder();
    renderMenu();
    updatePayButtonState();
}

function clearCurrentOrder() {
    if (currentOrder.length === 0) return;
    
    if (!confirm('Clear current order?')) return;
    
    currentOrder.forEach(item => {
        const product = productCatalog.find(p => p.name === item.name);
        if (product) {
            product.stock += item.quantity;
            if (product.stock > 0) {
                product.status = 'in_stock';
                outOfStockItems = outOfStockItems.filter(name => name !== product.name);
            }
        }
    });
    
    currentOrder = [];
    renderOrder();
    renderMenu();
    updatePayButtonState();
}

// ==================== 💰 PAYMENT FUNCTIONS ====================
function setOrderTypeNone() {
    orderType = null;
    const display = document.getElementById("orderTypeDisplay");
    if (display) display.textContent = "None";
    updatePayButtonState();
}

function setDineIn() {
    orderType = "Dine In";
    const display = document.getElementById("orderTypeDisplay");
    if (display) display.textContent = orderType;
    updatePayButtonState();
}

function setTakeout() {
    orderType = "Take Out";
    const display = document.getElementById("orderTypeDisplay");
    if (display) display.textContent = orderType;
    updatePayButtonState();
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method.toLowerCase();
    const display = document.getElementById("paymentMethodDisplay");
    if (display) {
        display.textContent = selectedPaymentMethod === 'cash' ? 'Cash' : 'GCash';
    }
    updatePayButtonState();
}

function updatePayButtonState() {
    const payButton = document.getElementById('payButton');
    if (!payButton) return;
    
    const hasItems = currentOrder.length > 0;
    const hasOrderType = orderType && orderType !== "None";
    const hasPaymentMethod = selectedPaymentMethod;
    
    payButton.disabled = !(hasItems && hasOrderType && hasPaymentMethod);
    payButton.style.opacity = payButton.disabled ? '0.6' : '1';
    payButton.style.backgroundColor = payButton.disabled ? '#6c757d' : '#28a745';
    payButton.style.cursor = payButton.disabled ? 'not-allowed' : 'pointer';
}

function Payment() {
    if (!currentOrder.length) {
        alert("Please add items to order");
        return;
    }
    
    if (!orderType || orderType === "None") {
        alert("Please select order type");
        return;
    }
    
    if (!selectedPaymentMethod) {
        alert("Please select payment method");
        return;
    }
    
    const total = currentOrder.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (confirm(`Process payment of ₱${total.toFixed(2)}?`)) {
        alert("Order processed successfully!");
        clearCurrentOrder();
    }
}

// ==================== 📦 STOCK REQUEST FUNCTIONS ====================

/**
 * Main entry point for stock requests
 */
function requestStock(productIdentifier) {
    console.log('🛒 ========== REQUEST STOCK CALLED ==========');
    console.log('📦 Product Identifier:', productIdentifier);
    
    // Prevent multiple modals
    if (document.getElementById('stockRequestModal')) {
        console.log('⚠️ Modal already open');
        return;
    }
    
    // Show loading toast
    showToast('Processing...', 'info');
    
    if (productCatalog.length === 0) {
        loadAllMenuItems().then(() => {
            setTimeout(() => {
                const product = findProductInCatalog(productIdentifier) || 
                               createFallbackProduct(productIdentifier);
                if (product) {
                    showRequestStockModal(ensureProductFields(product));
                } else {
                    showToast('Product not found', 'error');
                }
            }, 500);
        });
        return;
    }
    
    const product = findProductInCatalog(productIdentifier) || 
                    createFallbackProduct(productIdentifier);
    
    if (!product) {
        showToast('Could not find product', 'error');
        return;
    }
    
    showRequestStockModal(ensureProductFields(product));
}

/**
 * Find product in catalog
 */
function findProductInCatalog(identifier) {
    if (!identifier) return null;
    
    const idStr = String(identifier).trim();
    
    // Try exact matches first
    let product = productCatalog.find(p => p._id === idStr);
    if (product) return product;
    
    product = productCatalog.find(p => p.name === idStr);
    if (product) return product;
    
    // Try case-insensitive
    product = productCatalog.find(p => p.name.toLowerCase() === idStr.toLowerCase());
    if (product) return product;
    
    // Try partial match
    product = productCatalog.find(p => p.name.toLowerCase().includes(idStr.toLowerCase()));
    if (product) return product;
    
    return null;
}

/**
 * Create fallback product
 */
function createFallbackProduct(identifier) {
    const idStr = String(identifier);
    
    // Default values
    let name = idStr;
    let category = 'Rice Bowl Meals';
    let price = 180;
    let unit = 'plate';
    
    // Check for Korean Spicy Bulgogi
    if (idStr.toLowerCase().includes('bulgogi') || 
        idStr.toLowerCase().includes('korean') ||
        idStr.includes('180')) {
        name = 'Korean Spicy Bulgogi (Pork)';
    }
    
    return {
        _id: `fallback_${Date.now()}`,
        name: name,
        category: category,
        price: price,
        stock: 0,
        unit: unit,
        maxStock: MAX_STOCK_PER_ITEM,
        image: getProductImage(name)
    };
}

/**
 * Ensure product has all fields
 */
function ensureProductFields(product) {
    return {
        ...product,
        name: product.name || 'Unknown Product',
        category: product.category || 'Uncategorized',
        price: product.price || 0,
        stock: product.stock || 0,
        unit: product.unit || 'unit',
        maxStock: product.maxStock || MAX_STOCK_PER_ITEM,
        _id: product._id || product.id || `temp_${Date.now()}`,
        image: product.image || getProductImage(product.name)
    };
}

/**
 * Show stock request modal
 */
function showRequestStockModal(product) {
    if (!product) {
        showToast('Product information missing', 'error');
        return;
    }
    
    // Remove any existing modal
    const existingModal = document.getElementById('stockRequestModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    activeStockRequestModals.add(product.name);
    
    const maxRequestable = (product.maxStock || MAX_STOCK_PER_ITEM) - (product.stock || 0);
    const defaultQty = Math.min(10, maxRequestable);
    const hasPendingRequest = pendingStockRequests.includes(product.name);
    
    const modalHTML = `
        <div id="stockRequestModal" data-product-name="${product.name}" style="
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
                <h2 style="margin: 0 0 20px 0; color: #333;">Request Stock</h2>
                
                <p style="margin: 10px 0;"><strong>Product:</strong> ${product.name}</p>
                <p style="margin: 10px 0;"><strong>Category:</strong> ${product.category}</p>
                <p style="margin: 10px 0;"><strong>Price:</strong> ₱${product.price}</p>
                <p style="margin: 10px 0; color: ${product.stock > 0 ? '#28a745' : '#dc3545'};">
                    <strong>Current Stock:</strong> ${product.stock || 0}/${product.maxStock || MAX_STOCK_PER_ITEM} ${product.unit || ''}
                </p>
                <p style="margin: 10px 0; color: #ff9800;">
                    <strong>Available Capacity:</strong> ${maxRequestable} ${product.unit || ''}
                </p>
                
                ${hasPendingRequest ? `
                    <p style="margin: 10px 0; color: #ff9800; font-weight: bold;">
                        ⏳ A request for this product is already pending
                    </p>
                ` : ''}
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                        Quantity Requested:
                    </label>
                    <input type="number" 
                           id="requestQty" 
                           min="1" 
                           max="${maxRequestable}" 
                           value="${defaultQty}" 
                           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                </div>
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                        Priority Level:
                    </label>
                    <select id="requestPriority" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;">
                        <option value="low">Low</option>
                        <option value="medium" selected>Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 30px;">
                    <button onclick="closeStockRequestModal()" style="
                        padding: 10px 20px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        cursor: pointer;
                        background: #f0f0f0;
                        color: #333;
                        font-size: 14px;
                    ">Cancel</button>
                    
                    <button onclick="submitStockRequest('${product._id}', '${product.name}', '${product.unit}')" 
                            id="submitStockRequestBtn"
                            style="
                        padding: 10px 20px;
                        border: none;
                        border-radius: 5px;
                        cursor: ${hasPendingRequest ? 'not-allowed' : 'pointer'};
                        background: ${hasPendingRequest ? '#6c757d' : '#4CAF50'};
                        color: white;
                        font-size: 14px;
                        font-weight: bold;
                    " ${hasPendingRequest ? 'disabled' : ''}>${hasPendingRequest ? 'Request Pending' : 'Request Stock'}</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add click outside to close
    const modal = document.getElementById('stockRequestModal');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeStockRequestModal();
    });
}

/**
 * Close stock request modal
 */
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

/**
 * Submit stock request - ONLY ONCE
 */
async function submitStockRequest(productId, productName, unit) {
    console.log('📤 ========== SUBMIT STOCK REQUEST ==========');
    
    // Prevent multiple submissions
    if (isSubmittingStockRequest) {
        console.log('⚠️ Already submitting a request, please wait');
        showToast('Please wait, processing previous request...', 'warning');
        return;
    }
    
    const submitBtn = document.getElementById('submitStockRequestBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.background = '#6c757d';
        submitBtn.textContent = 'Submitting...';
    }
    
    isSubmittingStockRequest = true;
    
    try {
        const quantity = parseInt(document.getElementById('requestQty').value);
        const priority = document.getElementById('requestPriority').value;
        
        // Validate quantity
        if (!quantity || quantity <= 0) {
            showToast('Please enter a valid quantity', 'error');
            isSubmittingStockRequest = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.background = '#4CAF50';
                submitBtn.textContent = 'Request Stock';
            }
            return;
        }
        
        // Get product
        const product = productCatalog.find(p => p.name === productName) || 
                       productCatalog.find(p => p._id === productId);
        
        if (!product) {
            showToast('Product not found', 'error');
            closeStockRequestModal();
            isSubmittingStockRequest = false;
            return;
        }
        
        // Check if already pending
        if (pendingStockRequests.includes(productName)) {
            showToast('A request for this product is already pending', 'warning');
            closeStockRequestModal();
            isSubmittingStockRequest = false;
            return;
        }
        
        const maxRequestable = (product.maxStock || MAX_STOCK_PER_ITEM) - (product.stock || 0);
        
        if (quantity > maxRequestable) {
            showToast(`Maximum requestable quantity is ${maxRequestable}`, 'error');
            isSubmittingStockRequest = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.style.background = '#4CAF50';
                submitBtn.textContent = 'Request Stock';
            }
            return;
        }
        
        console.log('Submitting request:', { productId, productName, quantity, unit, priority });
        
        // Close modal immediately to prevent double-click
        closeStockRequestModal();
        
        // Show processing toast
        const toast = showToast('⏳ Submitting stock request...', 'info', 0);
        
        try {
            // Simple request format - most likely to work
            const requestData = {
                productId: productId,
                productName: productName,
                quantity: quantity,
                unit: unit,
                priority: priority
            };
            
            console.log('📡 Sending request:', requestData);
            
            const response = await fetch(`${BACKEND_URL}/api/stock-requests`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(requestData)
            });
            
            // Remove processing toast
            if (toast.parentElement) toast.remove();
            
            const responseText = await response.text();
            console.log('📡 Response:', response.status, responseText);
            
            let responseData;
            try {
                responseData = JSON.parse(responseText);
            } catch (e) {
                responseData = { message: responseText };
            }
            
            if (response.ok) {
                // SUCCESS!
                console.log('✅ Stock request successful!');
                
                // Add to pending requests
                if (!pendingStockRequests.includes(productName)) {
                    pendingStockRequests.push(productName);
                    localStorage.setItem('pendingStockRequests', JSON.stringify(pendingStockRequests));
                }
                
                // Save timestamp
                stockRequestTimestamps[productName] = Date.now();
                localStorage.setItem('stockRequestTimestamps', JSON.stringify(stockRequestTimestamps));
                
                // Show success message
                showToast(`✅ Stock request for ${productName} sent to admin!`, 'success');
                
                // Show success modal
                showSuccessModal(productName, quantity, unit);
                
            } else if (response.status === 409) {
                // Already pending
                showToast(`⚠️ A request for ${productName} is already pending`, 'warning');
                
            } else {
                // Other error
                console.error('❌ Server error:', responseData);
                showToast(`❌ Failed: ${responseData.message || 'Server error'}`, 'error');
                
                // Save locally as fallback
                saveLocalRequest(productName, quantity, unit, priority);
                showSuccessModal(productName, quantity, unit, true);
            }
            
        } catch (error) {
            console.error('❌ Network error:', error);
            
            // Remove processing toast
            const processingToast = document.getElementById('activeToast');
            if (processingToast) processingToast.remove();
            
            // Network error - save locally
            showToast('⚠️ Network error - request saved locally', 'warning');
            saveLocalRequest(productName, quantity, unit, priority);
            showSuccessModal(productName, quantity, unit, true);
        }
        
    } catch (error) {
        console.error('❌ Error in submitStockRequest:', error);
        showToast('❌ An error occurred', 'error');
    } finally {
        // Reset submission flag
        isSubmittingStockRequest = false;
    }
}

/**
 * Save request locally
 */
function saveLocalRequest(productName, quantity, unit, priority) {
    const localRequests = JSON.parse(localStorage.getItem('localStockRequests') || '[]');
    
    localRequests.push({
        id: `local_${Date.now()}`,
        productName: productName,
        quantity: quantity,
        unit: unit,
        priority: priority,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });
    
    localStorage.setItem('localStockRequests', JSON.stringify(localRequests));
    
    // Add to pending requests
    if (!pendingStockRequests.includes(productName)) {
        pendingStockRequests.push(productName);
        localStorage.setItem('pendingStockRequests', JSON.stringify(pendingStockRequests));
    }
    
    console.log('✅ Request saved locally');
}

/**
 * Show success modal
 */
function showSuccessModal(productName, quantity, unit, localOnly = false) {
    // Remove any existing success modal
    const existingModal = document.getElementById('successModal');
    if (existingModal) existingModal.remove();
    
    const successHTML = `
        <div id="successModal" style="
            display: flex;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10001;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: ${localOnly ? '#ff9800' : '#4CAF50'};
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <i class="fas ${localOnly ? 'fa-save' : 'fa-check'}" style="color: white; font-size: 40px;"></i>
                </div>
                
                <h2 style="color: ${localOnly ? '#ff9800' : '#4CAF50'}; margin: 0 0 10px 0;">
                    ${localOnly ? 'Request Saved Offline' : 'Request Submitted!'}
                </h2>
                
                <p style="color: #666; font-size: 18px; margin: 15px 0;">
                    ${quantity} ${unit} of <strong>${productName}</strong>
                </p>
                
                <p style="color: #666; font-size: 14px; margin: 10px 0;">
                    ${localOnly 
                        ? 'Your request has been saved locally and will be sent when you\'re back online.'
                        : 'Your request has been sent to admin for approval.'}
                </p>
                
                <button onclick="closeSuccessModal()" style="
                    padding: 10px 30px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    background: ${localOnly ? '#ff9800' : '#4CAF50'};
                    color: white;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 20px;
                ">OK</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', successHTML);
}

/**
 * Close success modal
 */
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.remove();
}

// ==================== 📋 CATEGORY FUNCTIONS ====================
function filterCategory(category) {
    currentCategory = category;
    
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });
    
    renderMenu();
}

function searchFood(searchTerm) {
    const container = document.getElementById('menuContainer');
    if (!container) return;
    
    if (!searchTerm.trim()) {
        renderMenu();
        return;
    }
    
    const term = searchTerm.toLowerCase().trim();
    const filtered = productCatalog.filter(product => {
        if (currentCategory !== 'all' && product.category !== currentCategory) return false;
        return product.name.toLowerCase().includes(term);
    });
    
    container.innerHTML = '';
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-results">No products found</div>';
        return;
    }
    
    filtered.forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

// ==================== 💾 STORAGE FUNCTIONS ====================
function saveInventoryToStorage() {
    localStorage.setItem('servingwareInventory', JSON.stringify(servingwareInventory));
    localStorage.setItem('ingredientInventory', JSON.stringify(ingredientInventory));
}

function loadInventoryFromStorage() {
    const saved = localStorage.getItem('servingwareInventory');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.keys(parsed).forEach(key => {
                if (servingwareInventory[key]) {
                    servingwareInventory[key].current = parsed[key].current;
                }
            });
        } catch (e) {}
    }
}

// ==================== 🚀 INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing POS System...');
    
    // Load saved data
    loadInventoryFromStorage();
    
    // Load pending requests
    const saved = localStorage.getItem('pendingStockRequests');
    if (saved) {
        try {
            pendingStockRequests = JSON.parse(saved);
            console.log(`📦 Loaded ${pendingStockRequests.length} pending requests`);
        } catch (e) {
            pendingStockRequests = [];
        }
    }
    
    // Load timestamps
    const timestamps = localStorage.getItem('stockRequestTimestamps');
    if (timestamps) {
        try {
            stockRequestTimestamps = JSON.parse(timestamps);
        } catch (e) {
            stockRequestTimestamps = {};
        }
    }
    
    // Load local requests
    const localRequests = localStorage.getItem('localStockRequests');
    if (localRequests) {
        try {
            const requests = JSON.parse(localRequests);
            console.log(`📦 Found ${requests.length} local requests pending sync`);
        } catch (e) {}
    }
    
    // Load menu
    loadAllMenuItems();
    
    // Setup search
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => searchFood(e.target.value));
    }
    
    // Setup category buttons
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterCategory(btn.dataset.category);
        });
    });
    
    // Setup order type buttons
    const dineInBtn = document.querySelector('.dineinandtakeout-btn:nth-child(1)');
    const takeoutBtn = document.querySelector('.dineinandtakeout-btn:nth-child(2)');
    
    if (dineInBtn) dineInBtn.addEventListener('click', setDineIn);
    if (takeoutBtn) takeoutBtn.addEventListener('click', setTakeout);
    
    // Setup payment method buttons
    const cashBtn = document.querySelector('.payment-method-btn:nth-child(1)');
    const gcashBtn = document.querySelector('.payment-method-btn:nth-child(2)');
    
    if (cashBtn) cashBtn.addEventListener('click', () => selectPaymentMethod('cash'));
    if (gcashBtn) gcashBtn.addEventListener('click', () => selectPaymentMethod('gcash'));
    
    // Initial render
    renderMenu();
    updatePayButtonState();
    
    console.log('✅ POS System initialized');
});

// Auto-save every 30 seconds
setInterval(saveInventoryToStorage, 30000);

// ==================== 🎯 EXPORT GLOBAL FUNCTIONS ====================
window.requestStock = requestStock;
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
window.filterCategory = filterCategory;
window.searchFood = searchFood;
window.productCatalog = productCatalog;
window.pendingStockRequests = pendingStockRequests;