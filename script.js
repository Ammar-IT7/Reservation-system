    // Track authentication state
    let isAuthenticated = false;
    
    // Track navigation history
    let navigationHistory = ['login'];
    let currentScreen = 'login';
    
    // Toggle drawer menu
    function toggleDrawer() {
        // Only allow toggling drawer if authenticated
        if (!isAuthenticated) return;
        
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawer-overlay');
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
    }
    
    // Navigate to a screen
    function navigateTo(screenId) {
        // If not authenticated and trying to navigate to a screen other than login, prevent navigation
        if (!isAuthenticated && screenId !== 'login') {
            alert('الرجاء تسجيل الدخول أولاً');
            navigateTo('login');
            return;
        }
        
        
        // If drawer is open, close it
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawer-overlay');
        if (drawer.classList.contains('active')) {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        }
        
        // Hide current screen
        document.getElementById(currentScreen).classList.remove('active');
        
        // Show new screen
        document.getElementById(screenId).classList.add('active');
        
        // Update navigation history
        if (screenId !== currentScreen) {
            navigationHistory.push(screenId);
        }
        
        // Update current screen
        currentScreen = screenId;
        
        // Update title
        updateTitle(screenId);
        
        // Update active nav item
        updateActiveNavItem(screenId);
    }
    
    // Go back to previous screen
    function goBack() {
        if (!isAuthenticated) return;
        
        if (navigationHistory.length > 1) {
            navigationHistory.pop(); // Remove current screen
            const previousScreen = navigationHistory[navigationHistory.length - 1];
            
            // Hide current screen
            document.getElementById(currentScreen).classList.remove('active');
            
            // Show previous screen
            document.getElementById(previousScreen).classList.add('active');
            
            // Update current screen
            currentScreen = previousScreen;
            
            // Update title
            updateTitle(previousScreen);
            
            // Update active nav item
            updateActiveNavItem(previousScreen);
        }
    }
    
    // Update page title
    function updateTitle(screenId) {
        const titleElement = document.getElementById('screen-title');
        switch (screenId) {
            case 'login':
                // Login has its own title, no need to update
                break;
            case 'dashboard':
                titleElement.textContent = 'الرئيسية';
                break;
            case 'operations':
                titleElement.textContent = 'العمليات';
                break;
            case 'inventory':
                titleElement.textContent = 'المخزون';
                break;
            case 'setup':
                titleElement.textContent = 'إعدادات النظام';
                break;
            case 'reports':
                titleElement.textContent = 'التقارير';
                break;
            case 'customers':
                titleElement.textContent = 'بيانات العملاء';
                break;
            case 'employees':
                titleElement.textContent = 'بيانات الموظفين';
                break;
            case 'suppliers':
                titleElement.textContent = 'بيانات الموردين';
                break;
            case 'inventory-reports':
                titleElement.textContent = 'تقارير المخزون';
                break;
            case 'new-invoice':
                titleElement.textContent = 'فاتورة حجز جديدة';
                break;
            case 'new-item':
                titleElement.textContent = 'إضافة صنف جديد';
                break;
            case 'new-customer':
                titleElement.textContent = 'إضافة عميل جديد';
                break;
            case 'new-employee':
                titleElement.textContent = 'إضافة موظف جديد';
                break;
            case 'new-supplier':
                titleElement.textContent = 'إضافة مورد جديد';
                break;
            default:
                titleElement.textContent = 'نظام إدارة عمليات الحجز';
        }
    }
    
    // Update active nav item
    function updateActiveNavItem(screenId) {
        if (!isAuthenticated) return;
        
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });
        
        let activeNavId = '';
        switch (screenId) {
            case 'dashboard':
                activeNavId = 'dashboard';
                break;
            case 'operations':
            case 'new-invoice':
                activeNavId = 'operations';
                break;
            case 'inventory':
            case 'new-item':
                activeNavId = 'inventory';
                break;
            case 'reports':
            case 'inventory-reports':
                activeNavId = 'reports';
                break;
            default:
                // For other screens, don't highlight any nav item
                return;
        }
        
        const navLinks = document.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            if (link.getAttribute('onclick').includes(activeNavId)) {
                link.classList.add('active');
            }
        });
    }
    
    // Login function
    function login() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('remember').checked;
        const loginError = document.getElementById('login-error');
        
        // Basic validation
        if (!username || !password) {
            loginError.style.display = 'block';
            return;
        }
        
        // For demo purposes, we'll accept any non-empty username and password
        // In a real application, you would verify these credentials against your server
        
        // Clear any previous error
        loginError.style.display = 'none';
        
        // Store authentication state
        isAuthenticated = true;
        
        // Set user name in drawer
        document.getElementById('user-name').textContent = username;
        
        // Save to localStorage if rememberMe is checked
        if (rememberMe) {
            localStorage.setItem('tailoringSystemUser', username);
        } else {
            localStorage.removeItem('tailoringSystemUser');
        }
        
        // Show app header and hide login header
        document.getElementById('login-header').style.display = 'none';
        document.getElementById('app-header').style.display = 'flex';
        
        // Show bottom navigation
        document.getElementById('bottom-nav').style.display = 'flex';
        
        // Navigate to dashboard
        navigateTo('dashboard');
    }
    
    // Logout function
    function logout() {
        // Clear authentication state
        isAuthenticated = false;
        
        // Clear localStorage
        localStorage.removeItem('tailoringSystemUser');
        
        // Reset navigation history
        navigationHistory = ['login'];
        currentScreen = 'login';
        
        // Hide app header and show login header
        document.getElementById('app-header').style.display = 'none';
        document.getElementById('login-header').style.display = 'flex';
        
        // Hide bottom navigation
        document.getElementById('bottom-nav').style.display = 'none';
        
        // Navigate to login
        navigateTo('login');
    }
    
    // Initialize the system
    window.onload = function() {
        // Check for saved session
        const savedUser = localStorage.getItem('tailoringSystemUser');
        
        if (savedUser) {
            // Auto-login with saved user
            document.getElementById('username').value = savedUser;
            document.getElementById('remember').checked = true;
            
            // We could auto-login here, but for security let's still require password
            // login();
        }
        
        // Add enter key event listener to password field
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
        
        // Make sure we start at login screen
        navigateTo('login');
    };
    
    // Switch tabs
    function switchTab(tabId, tabElement) {
        if (!isAuthenticated) return;
        
        // Update active tab
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        tabElement.classList.add('active');
        
        // Update tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.style.display = 'none';
        });
        document.getElementById(tabId).style.display = 'block';
    }
    

// Current step tracking
let invCurrentStep = 1;
const invTotalSteps = 3;

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
updateProgressBar();
});

// Updated invToggleInvoiceType function
function invToggleInvoiceType() {
    const invoiceType = document.getElementById('inv-invoice-type').value;
    const typeFields = document.querySelectorAll('.inv-type-fields');
    const measurementSections = document.querySelectorAll('.inv-measurements-section');
    
    // Hide all type fields
    typeFields.forEach(field => {
        field.style.display = 'none';
    });
    
    // Hide all measurement sections
    measurementSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Reset kush dimensions display
    if (document.getElementById('kush-dimensions')) {
        document.getElementById('kush-dimensions').style.display = 'none';
    }
    
    // Show selected type fields
    else if (invoiceType === 'womens_dresses') {
        document.getElementById('womens-dresses-fields').style.display = 'block';
        document.getElementById('womens-measurements').style.display = 'block';
    } else if (invoiceType === 'wedding_hall') {
        document.getElementById('wedding-hall-fields').style.display = 'block';
        document.getElementById('wedding-services-measurements').style.display = 'block';
    } else if (invoiceType === 'dj_services') {
        document.getElementById('dj-services-fields').style.display = 'block';
        document.getElementById('wedding-services-measurements').style.display = 'block';
    } else if (invoiceType === 'wedding_kush') {
        document.getElementById('wedding-kush-fields').style.display = 'block';
        document.getElementById('wedding-services-measurements').style.display = 'block';
        document.getElementById('kush-dimensions').style.display = 'block';
    } 

    
    // Update step labels based on invoice type
    updateStepLabels(invoiceType);
    
    // Initialize specific pricing for the selected type
    if (invoiceType === 'wedding_hall') {
        // Set default base price for hall
        document.getElementById('inv-hall-base-price').value = '5000';
        invCalculateHallTotal();
    } else if (invoiceType === 'dj_services') {
        // Set default hourly rate for DJ
        document.getElementById('inv-dj-hourly-rate').value = '300';
        invCalculateDjTotal();
    } else if (invoiceType === 'wedding_kush') {
        // Set default base price for kush
        document.getElementById('inv-kush-base-price').value = '1500';
        invCalculateKushTotal();
    }
}

// Update step labels function
function updateStepLabels(invoiceType) {
    const stepLabels = document.querySelectorAll('.inv-step-label');
    
    if (invoiceType === 'womens_dresses') {
        stepLabels[1].textContent = 'بيانات الفستان';
    } else if (invoiceType === 'wedding_hall') {
        stepLabels[1].textContent = 'بيانات الحجز';
    } else if (invoiceType === 'dj_services') {
        stepLabels[1].textContent = 'بيانات الدي جي';
    } else if (invoiceType === 'wedding_kush') {
        stepLabels[1].textContent = 'بيانات الكوش';
    } else {
        stepLabels[1].textContent = 'بيانات المنتج';
    }
}

// Calculate hall total
function invCalculateHallTotal() {
    const basePrice = parseFloat(document.getElementById('inv-hall-base-price').value) || 0;
    let extrasCost = 0;
    
    // Calculate guests cost
    const guestCount = parseInt(document.getElementById('inv-guest-count').value) || 0;
    let guestsCost = 0;
    if (guestCount > 100) {
        guestsCost = (guestCount - 100) * 20; // 20 per additional guest over 100
    }
    
    // Calculate additional services cost
    const checkboxes = document.querySelectorAll('#wedding-hall-fields .inv-checkbox:checked');
    checkboxes.forEach(checkbox => {
        switch(checkbox.value) {
            case 'decoration':
                extrasCost += 1000;
                break;
            case 'lighting':
                extrasCost += 500;
                break;
            case 'staff':
                extrasCost += 800;
                break;
        }
    });
    
    // Calculate food package cost
    const foodPackage = document.getElementById('inv-food-package').value;
    let foodCost = 0;
    switch(foodPackage) {
        case 'basic':
            foodCost = guestCount * 50;
            break;
        case 'standard':
            foodCost = guestCount * 80;
            break;
        case 'premium':
            foodCost = guestCount * 120;
            break;
        case 'custom':
            foodCost = guestCount * 150;
            break;
    }
    
    // Calculate drinks package cost
    const drinksPackage = document.getElementById('inv-drinks-package').value;
    let drinksCost = 0;
    switch(drinksPackage) {
        case 'basic':
            drinksCost = guestCount * 20;
            break;
        case 'premium':
            drinksCost = guestCount * 40;
            break;
    }
    
    // Calculate total extras cost
    const totalExtrasCost = extrasCost + guestsCost + foodCost + drinksCost;
    
    // Update fields
    document.getElementById('inv-hall-extras-cost').value = totalExtrasCost;
    document.getElementById('inv-hall-total-price').value = basePrice + totalExtrasCost;
}

// Calculate DJ total
function invCalculateDjTotal() {
    const hourlyRate = parseFloat(document.getElementById('inv-dj-hourly-rate').value) || 0;
    const hours = parseInt(document.getElementById('inv-dj-hours').value) || 0;
    let extrasCost = 0;
    
    // Calculate equipment cost
    const equipment = document.getElementById('inv-dj-equipment').value;
    let equipmentCost = 0;
    switch(equipment) {
        case 'basic':
            equipmentCost = 200;
            break;
        case 'standard':
            equipmentCost = 500;
            break;
        case 'premium':
            equipmentCost = 1000;
            break;
    }
    
    // Calculate additional services cost
    const checkboxes = document.querySelectorAll('#dj-services-fields .inv-checkbox:checked');
    checkboxes.forEach(checkbox => {
        switch(checkbox.value) {
            case 'smoke':
                extrasCost += 200;
                break;
            case 'lighting':
                extrasCost += 300;
                break;
            case 'confetti':
                extrasCost += 150;
                break;
        }
    });
    
    // Calculate total
    const totalExtrasCost = extrasCost + equipmentCost;
    const totalPrice = (hourlyRate * hours) + totalExtrasCost;
    
    // Update fields
    document.getElementById('inv-dj-extras-cost').value = totalExtrasCost;
    document.getElementById('inv-dj-total-price').value = totalPrice;
}

// Calculate Kush total
function invCalculateKushTotal() {
    const basePrice = parseFloat(document.getElementById('inv-kush-base-price').value) || 0;
    let extrasCost = 0;
    
    // Calculate type and size costs
    const kushType = document.getElementById('inv-kush-type').value;
    let typeCost = 0;
    switch(kushType) {
        case 'classic':
            typeCost = 0; // included in base price
            break;
        case 'modern':
            typeCost = 300;
            break;
        case 'floral':
            typeCost = 800;
            break;
        case 'crystal':
            typeCost = 1200;
            break;
        case 'custom':
            typeCost = 1500;
            break;
    }
    
    const kushSize = document.getElementById('inv-kush-size').value;
    let sizeCost = 0;
    switch(kushSize) {
        case 'small':
            sizeCost = 0; // included in base price
            break;
        case 'medium':
            sizeCost = 500;
            break;
        case 'large':
            sizeCost = 1000;
            break;
        case 'custom':
            sizeCost = 1500;
            break;
    }
    
    // Calculate additional services cost
    const checkboxes = document.querySelectorAll('#wedding-kush-fields .inv-checkbox:checked');
    checkboxes.forEach(checkbox => {
        switch(checkbox.value) {
            case 'lighting':
                extrasCost += 300;
                break;
            case 'names':
                extrasCost += 200;
                break;
            case 'carpet':
                extrasCost += 250;
                break;
            case 'seating':
                extrasCost += 500;
                break;
        }
    });
    
    // Calculate total
    const totalExtrasCost = extrasCost + typeCost + sizeCost;
    const totalPrice = basePrice + totalExtrasCost;
    
    // Update fields
    document.getElementById('inv-kush-extras-cost').value = totalExtrasCost;
    document.getElementById('inv-kush-total-price').value = totalPrice;
}

// Toggle embroidery type field based on embroidery selection
document.addEventListener('DOMContentLoaded', function() {
    const embroiderySelect = document.getElementById('inv-dress-embroidery');
    const embroideryTypeSelect = document.getElementById('inv-embroidery-type');
    
    if (embroiderySelect && embroideryTypeSelect) {
        embroiderySelect.addEventListener('change', function() {
            if (this.value === 'yes') {
                embroideryTypeSelect.disabled = false;
            } else {
                embroideryTypeSelect.disabled = true;
                embroideryTypeSelect.value = '';
            }
        });
    }
});

// Calculate dress item total
function invCalculateDressTotal() {
    const price = parseFloat(document.getElementById('inv-dress-price').value) || 0;
    document.getElementById('inv-dress-total-price').value = price.toFixed(2);
}

// Update addItem function to handle new types
function invAddItem() {
    const invoiceType = document.getElementById('inv-invoice-type').value;
    const itemsContainer = document.getElementById('inv-items-container');
    
    if (invoiceType === 'wedding_hall') {
        const hallName = document.getElementById('inv-hall-name');
        const hallNameText = hallName.options[hallName.selectedIndex].text;
        const hallDate = document.getElementById('inv-hall-date').value;
        const hallPrice = parseFloat(document.getElementById('inv-hall-total-price').value) || 0;
        
        if (!hallName.value) {
            alert('الرجاء اختيار القاعة');
            return;
        }
        
        if (!hallDate) {
            alert('الرجاء تحديد تاريخ الحجز');
            return;
        }
        
        const newRow = document.createElement('tr');
        const rowCount = itemsContainer.children.length + 1;
        
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>قاعة أفراح</td>
            <td>${hallNameText} - ${hallDate}</td>
            <td>${hallPrice}</td>
            <td>${hallPrice}</td>
            <td>
                <button class="inv-icon-button" style="background-color: #dc3545; width: 30px; height: 30px;" onclick="invRemoveItem(this)">
                    <i class="material-icons" style="font-size: 16px;">delete</i>
                </button>
            </td>
        `;
        
        itemsContainer.appendChild(newRow);
        
    } else if (invoiceType === 'dj_services') {
        const djName = document.getElementById('inv-dj-name');
        const djNameText = djName.options[djName.selectedIndex].text;
        const djDate = document.getElementById('inv-dj-date').value;
        const djPrice = parseFloat(document.getElementById('inv-dj-total-price').value) || 0;
        
        if (!djName.value) {
            alert('الرجاء اختيار الدي جي');
            return;
        }
        
        if (!djDate) {
            alert('الرجاء تحديد تاريخ الحجز');
            return;
        }
        
        const newRow = document.createElement('tr');
        const rowCount = itemsContainer.children.length + 1;
        
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>خدمات دي جي</td>
            <td>${djNameText} - ${djDate}</td>
            <td>${djPrice}</td>
            <td>${djPrice}</td>
            <td>
                <button class="inv-icon-button" style="background-color: #dc3545; width: 30px; height: 30px;" onclick="invRemoveItem(this)">
                    <i class="material-icons" style="font-size: 16px;">delete</i>
                </button>
            </td>
        `;
        
        itemsContainer.appendChild(newRow);
        
    } else if (invoiceType === 'wedding_kush') {
        const kushType = document.getElementById('inv-kush-type');
        const kushTypeText = kushType.options[kushType.selectedIndex].text;
        const kushDate = document.getElementById('inv-kush-date').value;
        const kushPrice = parseFloat(document.getElementById('inv-kush-total-price').value) || 0;
        
        if (!kushType.value) {
            alert('الرجاء اختيار نوع الكوش');
            return;
        }
        
        if (!kushDate) {
            alert('الرجاء تحديد تاريخ المناسبة');
            return;
        }
        
        const newRow = document.createElement('tr');
        const rowCount = itemsContainer.children.length + 1;
        
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>كوش أفراح</td>
            <td>${kushTypeText} - ${kushDate}</td>
            <td>${kushPrice}</td>
            <td>${kushPrice}</td>
            <td>
                <button class="inv-icon-button" style="background-color: #dc3545; width: 30px; height: 30px;" onclick="invRemoveItem(this)">
                    <i class="material-icons" style="font-size: 16px;">delete</i>
                </button>
            </td>
        `;
        
        itemsContainer.appendChild(newRow);
        
    } else if (invoiceType === 'womens_dresses') {
        // Original women's dresses logic from your code
        const dressType = document.getElementById('inv-dress-type');
        const dressTypeText = dressType.options[dressType.selectedIndex].text;
        const dressPrice = parseFloat(document.getElementById('inv-dress-price').value) || 0;
        
        if (!dressType.value) {
            alert('الرجاء اختيار نوع الفستان');
            return;
        }
        
        if (dressPrice <= 0) {
            alert('الرجاء إدخال سعر صحيح للفستان');
            return;
        }
        
        const newRow = document.createElement('tr');
        const rowCount = itemsContainer.children.length + 1;
        
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>فستان نسائي</td>
            <td>${dressTypeText}</td>
            <td>${dressPrice}</td>
            <td>${dressPrice}</td>
            <td>
                <button class="inv-icon-button" style="background-color: #dc3545; width: 30px; height: 30px;" onclick="invRemoveItem(this)">
                    <i class="material-icons" style="font-size: 16px;">delete</i>
                </button>
            </td>
        `;
        
        itemsContainer.appendChild(newRow);
        
        // Clear form fields
        document.getElementById('inv-dress-price').value = '';
        document.getElementById('inv-dress-total-price').value = '';
        
    } else {
        // Original add item logic for other types
        const itemsContainer = document.getElementById('inv-items-container');
        const newRow = document.createElement('tr');
        const rowCount = itemsContainer.children.length + 1;
        
        newRow.innerHTML = `
            <td>${rowCount}</td>
            <td>حجز رجالية</td>
            <td>قماش ياباني</td>
            <td>200</td>
            <td>400</td>
            <td>
                <button class="inv-icon-button" style="background-color: #dc3545; width: 30px; height: 30px;" onclick="invRemoveItem(this)">
                    <i class="material-icons" style="font-size: 16px;">delete</i>
                </button>
            </td>
        `;
        
        itemsContainer.appendChild(newRow);
    }
    
    // Calculate invoice total
    invCalculateTotal();
}

// Remove item from invoice
function invRemoveItem(button) {
    const row = button.closest('tr');
    row.remove();
    
    // Renumber remaining rows
    const rows = document.querySelectorAll('#inv-items-container tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
    
    // Recalculate totals
    invCalculateTotal();
}

// Navigation between steps
function invNextStep() {
if (invCurrentStep < invTotalSteps) {
    // Validate current step (would add real validation in production)
    if (validateCurrentStep()) {
        document.getElementById(`inv-step-${invCurrentStep}`).style.display = 'none';
        invCurrentStep++;
        document.getElementById(`inv-step-${invCurrentStep}`).style.display = 'block';
        
        // Enable or disable navigation buttons
        document.getElementById('inv-prev-btn').disabled = false;
        
        if (invCurrentStep === invTotalSteps) {
            document.getElementById('inv-next-btn').style.display = 'none';
            document.getElementById('inv-save-btn').style.display = 'block';
        }
        
        updateProgressBar();
        updateStepLabels();
    }
}
}

function invPrevStep() {
if (invCurrentStep > 1) {
    document.getElementById(`inv-step-${invCurrentStep}`).style.display = 'none';
    invCurrentStep--;
    document.getElementById(`inv-step-${invCurrentStep}`).style.display = 'block';
    
    // Enable or disable navigation buttons
    document.getElementById('inv-prev-btn').disabled = (invCurrentStep === 1);
    
    if (invCurrentStep < invTotalSteps) {
        document.getElementById('inv-next-btn').style.display = 'block';
        document.getElementById('inv-save-btn').style.display = 'none';
    }
    
    updateProgressBar();
    updateStepLabels();
}
}

function updateProgressBar() {
const progressPercentage = (invCurrentStep / invTotalSteps) * 100;
document.getElementById('inv-step-indicator').style.width = `${progressPercentage}%`;
}

// Basic validation - would be more comprehensive in production
function validateCurrentStep() {
// Just a placeholder for real validation
return true;
}

// Toggle payment fields based on payment method
function invTogglePaymentFields() {
const paymentMethod = document.getElementById('inv-payment-method').value;
const paidAmount = document.getElementById('inv-paid-amount');

if (paymentMethod === 'credit') {
    paidAmount.placeholder = 'دفعة مقدمة (اختياري)';
} else {
    paidAmount.placeholder = 'المبلغ المدفوع';
    paidAmount.value = document.getElementById('inv-grand-total').value || 0;
}

invCalculateRemaining();
}

// Update exchange rate based on selected currency
function invUpdateExchangeRate() {
const currency = document.getElementById('inv-currency').value;
const exchangeRate = document.getElementById('inv-exchange-rate');

// Example exchange rates
switch(currency) {
    case 'usd':
        exchangeRate.value = 3.75;
        break;
    case 'aed':
        exchangeRate.value = 1.02;
        break;
    default:
        exchangeRate.value = 1;
}

// Recalculate totals
invCalculateTotal();
}

// Toggle size fields based on size type
function invToggleSizeFields() {
const sizeType = document.getElementById('inv-size-type').value;
const generalSizes = document.getElementById('inv-general-sizes');

if (sizeType === 'general') {
    generalSizes.style.display = 'block';
} else {
    generalSizes.style.display = 'none';
}
}

// Calculate item total
function invCalculateItemTotal() {
const price = parseFloat(document.getElementById('inv-price').value) || 0;
const count = parseInt(document.getElementById('inv-pieces-count').value) || 0;
document.getElementById('inv-total-price').value = (price * count).toFixed(2);
}

// Calculate invoice totals
function invCalculateTotal() {
// Placeholder for actual calculation logic
const invoiceTotal = 1000; // Example value
const discount = parseFloat(document.getElementById('inv-discount').value) || 0;
const totalAfterDiscount = invoiceTotal - discount;
const taxRate = 0.15; // 15% VAT
const taxTotal = totalAfterDiscount * taxRate;
const grandTotal = totalAfterDiscount + taxTotal;

document.getElementById('inv-invoice-total').value = invoiceTotal.toFixed(2);
document.getElementById('inv-total-after-discount').value = totalAfterDiscount.toFixed(2);
document.getElementById('inv-tax-total').value = taxTotal.toFixed(2);
document.getElementById('inv-grand-total').value = grandTotal.toFixed(2);

invCalculateRemaining();
}

// Calculate remaining amount
function invCalculateRemaining() {
const grandTotal = parseFloat(document.getElementById('inv-grand-total').value) || 0;
const paidAmount = parseFloat(document.getElementById('inv-paid-amount').value) || 0;
const remainingAmount = grandTotal - paidAmount;

document.getElementById('inv-remaining-amount').value = remainingAmount.toFixed(2);
}


// Save invoice
function invSaveInvoice() {
// Placeholder for save logic
alert('تم حفظ الفاتورة بنجاح');
// In a real app, this would validate all data and send to server
}

// Add this to your HTML where the other type fields are defined
function updateOtherFields() {
    const otherFields = document.getElementById('other-fields');
    otherFields.innerHTML = `
        <div class="inv-form-row">
            <div class="inv-form-group">
                <label class="inv-form-label">نوع الخدمة <span class="inv-required">*</span></label>
                <input type="text" class="inv-form-input" id="inv-other-service-type" placeholder="نوع الخدمة أو المنتج">
            </div>
            <div class="inv-form-group">
                <label class="inv-form-label">الكمية <span class="inv-required">*</span></label>
                <input type="number" class="inv-form-input" id="inv-other-quantity" value="1" min="1" onchange="invCalculateOtherTotal()">
            </div>
        </div>
        
        <div class="inv-form-row">
            <div class="inv-form-group">
                <label class="inv-form-label">السعر <span class="inv-required">*</span></label>
                <input type="number" class="inv-form-input" id="inv-other-price" onchange="invCalculateOtherTotal()">
            </div>
            <div class="inv-form-group">
                <label class="inv-form-label">إجمالي السعر</label>
                <input type="number" class="inv-form-input" id="inv-other-total-price" readonly>
            </div>
        </div>
        
        <div class="inv-form-row">
            <div class="inv-form-group">
                <label class="inv-form-label">تاريخ التسليم</label>
                <input type="date" class="inv-form-input" id="inv-other-delivery-date">
            </div>
            <div class="inv-form-group">
                <label class="inv-form-label">وصف تفصيلي</label>
                <textarea class="inv-form-input" id="inv-other-description" rows="2" placeholder="وصف تفصيلي للخدمة أو المنتج"></textarea>
            </div>
        </div>
    `;
}




// Initialize calculations on page load
window.onload = function() {
invCalculateTotal();
invTogglePaymentFields();
invToggleSizeFields();
};