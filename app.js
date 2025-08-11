// Australian Student Wealth Builder App JavaScript

// Global state
let appState = {
    selectedCity: 'Brisbane',
    expenses: {
        accommodation: 350,
        food: 95,
        transport: 32,
        presetExpenses: {},
        customExpenses: []
    },
    totalWeeklyExpenses: 477,
    monthlyIncome: 0,
    annualIncome: 0,
    startingEmergencyFund: 0,
    bigGoal: {
        enabled: false,
        name: '',
        amount: 0,
        date: '',
        monthlyRequired: 0
    },
    allocationSettings: {
        emergency: 30,
        core: 10,
        satellite: 3,
        bigGoal: 0
    },
    allocations: {
        fixed: 0,
        emergency: 0,
        bigGoal: 0,
        core: 0,
        satellite: 0,
        flexible: 0
    }
};

// City data
const cityData = {
    "Sydney": {
        "suggestions": {
            "accommodation": 450,
            "food": 115,
            "transport": 42
        }
    },
    "Melbourne": {
        "suggestions": {
            "accommodation": 400,
            "food": 110,
            "transport": 40
        }
    },
    "Brisbane": {
        "suggestions": {
            "accommodation": 350,
            "food": 95,
            "transport": 32
        }
    },
    "Perth": {
        "suggestions": {
            "accommodation": 310,
            "food": 85,
            "transport": 28
        }
    },
    "Adelaide": {
        "suggestions": {
            "accommodation": 275,
            "food": 80,
            "transport": 18
        }
    },
    "Regional Areas": {
        "suggestions": {
            "accommodation": 240,
            "food": 70,
            "transport": 24
        }
    }
};

// Preset expenses data
const presetExpenses = [
    {"name": "Mobile Phone", "min": 1, "max": 40, "default": 25},
    {"name": "Internet Share", "min": 1, "max": 20, "default": 15},
    {"name": "Electricity/Gas Share", "min": 1, "max": 35, "default": 25},
    {"name": "Water Share", "min": 1, "max": 15, "default": 10},
    {"name": "Clothing", "min": 1, "max": 50, "default": 25},
    {"name": "Entertainment", "min": 1, "max": 80, "default": 40},
    {"name": "Health/Personal Care", "min": 1, "max": 40, "default": 25},
    {"name": "Gym/Sports", "min": 1, "max": 30, "default": 20},
    {"name": "Study Materials", "min": 1, "max": 25, "default": 15},
    {"name": "Insurance (OSHC)", "min": 1, "max": 25, "default": 18},
    {"name": "Subscriptions", "min": 1, "max": 20, "default": 12},
    {"name": "Emergency Buffer", "min": 1, "max": 40, "default": 25}
];

// Definitions data
const definitions = {
    "Remaining Income": "Your income after fixed everyday expenses. This is what you allocate between savings, investments, and flexible spending.",
    "Emergency Fund": "Money saved for unexpected expenses, job loss, or emergencies. Should cover 3-6 months of your living expenses.",
    "Core Investments": "Stable, low-cost ETFs (VAS + VGS) forming the foundation of your investment portfolio with steady long-term growth.",
    "Satellite Investments": "Higher-risk, growth-focused investments (Bitcoin ETF) for diversification and potential higher returns.",
    "VAS": "Vanguard Australian Shares ETF - tracks ASX 200 largest Australian companies with very low fees (0.07% per year).",
    "VGS": "Vanguard Global Shares ETF - provides exposure to international markets including US, Europe, and Japan.",
    "Bitcoin ETF": "Regulated way to invest in Bitcoin through your brokerage account without managing cryptocurrency directly.",
    "Dollar Cost Averaging": "Investing the same amount regularly regardless of market conditions to reduce timing risk.",
    "LISTO": "Low Income Super Tax Offset - Government refund of up to $500 for super contributions if earning under $37,000.",
    "Franking Credits": "Tax credits from Australian companies that provide tax refunds for low-income earners.",
    "Superannuation": "Australia's retirement system where employers contribute 12% of salary, with government bonuses available.",
    "Big Goal Savings": "Dedicated savings for specific large purchases like travel, car, or house deposit with target timeline."
};

// Chart instance
let wealthChart = null;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Australian Student Wealth Builder...');
    
    // Initialize all components
    initializeTabs();
    initializeCitySelection();
    initializeMainExpenses();
    initializePresetExpenses();
    initializeCustomExpenses();
    initializeIncomeSection();
    initializeEmergencyFund();
    initializeBigGoal();
    initializeAllocationSettings();
    initializeDefinitions();
    
    // Load saved data and update displays
    loadFromLocalStorage();
    updateExpenseSummary();
    updateEmergencyFundProgress();
    
    console.log('App initialized successfully');
});

// Tab Management
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTab = this.dataset.tab;
            switchToTab(targetTab);
        });
    });
    
    console.log('Tab navigation initialized');
}

function switchToTab(tabName) {
    console.log('Switching to tab:', tabName);
    
    // Update button states
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabName}-tab`) {
            content.classList.add('active');
        }
    });
    
    // Update wealth strategy when switching to wealth tab
    if (tabName === 'wealth') {
        console.log('Updating wealth tab data...');
        updateFixedExpensesDisplay();
        updateWealthStrategy();
        
        // Small delay to ensure DOM is ready for chart
        setTimeout(() => {
            initializeWealthChart();
        }, 100);
    }
    
    // Update allocation summary when switching to allocation tab
    if (tabName === 'allocation') {
        console.log('Updating allocation tab data...');
        updateAllocationSummary();
    }
    
    saveToLocalStorage();
    console.log('Tab switch completed to:', tabName);
}

// City Selection
function initializeCitySelection() {
    const cityInputs = document.querySelectorAll('input[name="city"]');
    
    cityInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.checked) {
                appState.selectedCity = this.value;
                console.log('City changed to:', appState.selectedCity);
                applyCitySuggestions();
                updateExpenseSummary();
                saveToLocalStorage();
            }
        });
    });
    
    console.log('City selection initialized');
}

function applyCitySuggestions() {
    const cityName = appState.selectedCity;
    const suggestions = cityData[cityName]?.suggestions;
    
    console.log('Applying suggestions for', cityName, suggestions);
    
    if (suggestions) {
        // Update main expense sliders with suggestions
        const accommodationSlider = document.getElementById('accommodationSlider');
        const foodSlider = document.getElementById('foodSlider');
        const transportSlider = document.getElementById('transportSlider');
        
        if (accommodationSlider) {
            accommodationSlider.value = suggestions.accommodation;
            appState.expenses.accommodation = suggestions.accommodation;
            updateSliderValue('accommodation');
            console.log('Updated accommodation to:', suggestions.accommodation);
        }
        
        if (foodSlider) {
            foodSlider.value = suggestions.food;
            appState.expenses.food = suggestions.food;
            updateSliderValue('food');
            console.log('Updated food to:', suggestions.food);
        }
        
        if (transportSlider) {
            transportSlider.value = suggestions.transport;
            appState.expenses.transport = suggestions.transport;
            updateSliderValue('transport');
            console.log('Updated transport to:', suggestions.transport);
        }
        
        console.log('City suggestions applied successfully');
    }
}

// Main Expense Sliders
function initializeMainExpenses() {
    const sliders = ['accommodation', 'food', 'transport'];
    
    sliders.forEach(category => {
        const slider = document.getElementById(`${category}Slider`);
        
        if (slider) {
            // Set initial value
            slider.value = appState.expenses[category];
            updateSliderValue(category);
            
            slider.addEventListener('input', function() {
                const value = parseInt(this.value);
                appState.expenses[category] = value;
                updateSliderValue(category);
                updateExpenseSummary();
                saveToLocalStorage();
                console.log(`${category} updated to:`, value);
            });
        }
    });
    
    console.log('Main expense sliders initialized');
}

function updateSliderValue(category) {
    const valueElement = document.getElementById(`${category}Value`);
    if (valueElement) {
        valueElement.textContent = `$${appState.expenses[category]}/week`;
    }
}

// Preset Expenses
function initializePresetExpenses() {
    const container = document.querySelector('.preset-expenses');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    presetExpenses.forEach((expense, index) => {
        const expenseElement = createPresetExpenseElement(expense, index);
        container.appendChild(expenseElement);
    });
    
    console.log('Preset expenses initialized');
}

function createPresetExpenseElement(expense, index) {
    const div = document.createElement('div');
    div.className = 'preset-expense';
    div.innerHTML = `
        <div class="expense-toggle">
            <span class="expense-name">${expense.name}</span>
            <label class="toggle-switch">
                <input type="checkbox" data-expense-id="${index}">
                <span class="toggle-slider"></span>
            </label>
        </div>
        <div class="expense-slider-container">
            <input type="range" class="preset-expense-slider" 
                min="${expense.min}" max="${expense.max}" value="${expense.default}">
            <span class="expense-amount">$${expense.default}/week</span>
        </div>
    `;
    
    const checkbox = div.querySelector('input[type="checkbox"]');
    const slider = div.querySelector('.preset-expense-slider');
    const amountSpan = div.querySelector('.expense-amount');
    
    checkbox.addEventListener('change', function() {
        const isChecked = this.checked;
        
        if (isChecked) {
            div.classList.add('active');
            appState.expenses.presetExpenses[expense.name] = parseInt(slider.value);
            console.log('Enabled preset expense:', expense.name);
        } else {
            div.classList.remove('active');
            delete appState.expenses.presetExpenses[expense.name];
            console.log('Disabled preset expense:', expense.name);
        }
        
        updateExpenseSummary();
        saveToLocalStorage();
    });
    
    slider.addEventListener('input', function() {
        const value = parseInt(this.value);
        amountSpan.textContent = `$${value}/week`;
        
        if (checkbox.checked) {
            appState.expenses.presetExpenses[expense.name] = value;
            updateExpenseSummary();
            saveToLocalStorage();
        }
    });
    
    return div;
}

// Custom Expenses
function initializeCustomExpenses() {
    const addButton = document.getElementById('addCustomExpense');
    
    if (addButton) {
        addButton.addEventListener('click', function(e) {
            e.preventDefault();
            addCustomExpense();
        });
    }
    
    console.log('Custom expenses initialized');
}

function addCustomExpense() {
    console.log('Adding custom expense...');
    
    const customExpense = {
        name: '',
        amount: 0
    };
    
    appState.expenses.customExpenses.push(customExpense);
    renderCustomExpenses();
    saveToLocalStorage();
    
    console.log('Custom expense added');
}

function renderCustomExpenses() {
    const container = document.querySelector('.custom-expense-list');
    if (!container) return;
    
    container.innerHTML = '';
    
    appState.expenses.customExpenses.forEach((expense, index) => {
        const div = document.createElement('div');
        div.className = 'custom-expense-item';
        div.innerHTML = `
            <input type="text" placeholder="Expense name" value="${expense.name || ''}">
            <input type="number" placeholder="0" min="0" step="5" value="${expense.amount || ''}">
            <span>$/week</span>
            <button class="delete-custom-btn" data-index="${index}">×</button>
        `;
        
        const nameInput = div.querySelector('input[type="text"]');
        const amountInput = div.querySelector('input[type="number"]');
        const deleteBtn = div.querySelector('.delete-custom-btn');
        
        nameInput.addEventListener('input', function() {
            appState.expenses.customExpenses[index].name = this.value;
            saveToLocalStorage();
        });
        
        amountInput.addEventListener('input', function() {
            const value = parseFloat(this.value) || 0;
            appState.expenses.customExpenses[index].amount = value;
            updateExpenseSummary();
            saveToLocalStorage();
        });
        
        deleteBtn.addEventListener('click', function() {
            appState.expenses.customExpenses.splice(index, 1);
            renderCustomExpenses();
            updateExpenseSummary();
            saveToLocalStorage();
        });
        
        container.appendChild(div);
    });
    
    console.log('Custom expenses rendered:', appState.expenses.customExpenses.length);
}

// Expense Summary Updates
function updateExpenseSummary() {
    let weeklyTotal = 0;
    
    // Add main expenses
    weeklyTotal += appState.expenses.accommodation || 0;
    weeklyTotal += appState.expenses.food || 0;
    weeklyTotal += appState.expenses.transport || 0;
    
    // Add preset expenses
    Object.values(appState.expenses.presetExpenses).forEach(amount => {
        weeklyTotal += amount;
    });
    
    // Add custom expenses
    appState.expenses.customExpenses.forEach(expense => {
        weeklyTotal += expense.amount || 0;
    });
    
    const monthlyTotal = Math.round(weeklyTotal * 52 / 12);
    const annualTotal = weeklyTotal * 52;
    
    appState.totalWeeklyExpenses = weeklyTotal;
    
    // Update display elements
    const weeklyEl = document.getElementById('weeklyTotal');
    const monthlyEl = document.getElementById('monthlyTotal');
    const annualEl = document.getElementById('annualTotal');
    
    if (weeklyEl) weeklyEl.textContent = `$${Math.round(weeklyTotal).toLocaleString()}`;
    if (monthlyEl) monthlyEl.textContent = `$${monthlyTotal.toLocaleString()}`;
    if (annualEl) annualEl.textContent = `$${annualTotal.toLocaleString()}`;
    
    console.log('Expense summary updated - Weekly:', weeklyTotal);
    
    // Update wealth strategy if on wealth tab
    const wealthTab = document.getElementById('wealth-tab');
    if (wealthTab && wealthTab.classList.contains('active')) {
        updateFixedExpensesDisplay();
        updateWealthStrategy();
        updateWealthChart();
    }
}

// Income Section
function initializeIncomeSection() {
    const incomeInput = document.getElementById('incomeAmount');
    const frequencySelect = document.getElementById('incomeFreq');
    
    if (incomeInput) {
        incomeInput.addEventListener('input', updateIncomeCalculations);
    }
    
    if (frequencySelect) {
        frequencySelect.addEventListener('change', updateIncomeCalculations);
    }
    
    console.log('Income section initialized');
}

function updateIncomeCalculations() {
    const incomeInput = document.getElementById('incomeAmount');
    const frequencySelect = document.getElementById('incomeFreq');
    
    if (!incomeInput || !frequencySelect) return;
    
    const amount = parseFloat(incomeInput.value) || 0;
    const frequency = frequencySelect.value;
    
    let monthlyIncome = 0;
    
    switch (frequency) {
        case 'weekly':
            monthlyIncome = Math.round(amount * 52 / 12);
            break;
        case 'fortnightly':
            monthlyIncome = Math.round(amount * 26 / 12);
            break;
        case 'monthly':
            monthlyIncome = amount;
            break;
        case 'annual':
            monthlyIncome = Math.round(amount / 12);
            break;
    }
    
    const annualIncome = monthlyIncome * 12;
    
    appState.monthlyIncome = monthlyIncome;
    appState.annualIncome = annualIncome;
    
    // Update display
    const monthlyEl = document.getElementById('monthlyIncome');
    const annualEl = document.getElementById('annualIncome');
    
    if (monthlyEl) monthlyEl.textContent = `$${monthlyIncome.toLocaleString()}`;
    if (annualEl) annualEl.textContent = `$${annualIncome.toLocaleString()}`;
    
    // Update wealth strategy
    updateEmergencyFundProgress();
    updateBigGoalCalculation();
    updateWealthStrategy();
    updateWealthChart();
    saveToLocalStorage();
    
    console.log('Income calculations updated - Monthly:', monthlyIncome);
}

// Emergency Fund
function initializeEmergencyFund() {
    const emergencyInput = document.getElementById('startingEmergencyFund');
    
    if (emergencyInput) {
        emergencyInput.addEventListener('input', function() {
            appState.startingEmergencyFund = parseFloat(this.value) || 0;
            updateEmergencyFundProgress();
            updateWealthStrategy();
            updateWealthChart();
            saveToLocalStorage();
        });
    }
    
    console.log('Emergency fund initialized');
}

function updateEmergencyFundProgress() {
    const monthlyExpenses = Math.round(appState.totalWeeklyExpenses * 52 / 12);
    const targetAmount = monthlyExpenses * 6; // 6 months of expenses
    const currentAmount = appState.startingEmergencyFund;
    const percentage = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;
    
    const progressFill = document.getElementById('emergencyProgress');
    const progressText = document.getElementById('emergencyProgressText');
    const targetText = document.getElementById('emergencyTarget');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${Math.round(percentage)}% of recommended emergency fund`;
    }
    
    if (targetText) {
        targetText.textContent = `Target: $${targetAmount.toLocaleString()} (6 months of expenses)`;
    }
    
    console.log('Emergency fund progress updated:', percentage + '%');
}

// Big Goal
function initializeBigGoal() {
    const bigGoalToggle = document.getElementById('bigGoalToggle');
    const bigGoalContent = document.getElementById('bigGoalContent');
    const goalInputs = ['goalName', 'goalAmount', 'goalDate'];
    
    if (bigGoalToggle) {
        bigGoalToggle.addEventListener('change', function() {
            appState.bigGoal.enabled = this.checked;
            
            if (this.checked) {
                bigGoalContent.classList.add('active');
            } else {
                bigGoalContent.classList.remove('active');
            }
            
            updateBigGoalCalculation();
            updateWealthStrategy();
            updateWealthChart();
            saveToLocalStorage();
        });
    }
    
    goalInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', function() {
                const key = inputId.replace('goal', '').toLowerCase();
                appState.bigGoal[key] = this.value;
                updateBigGoalCalculation();
                updateWealthStrategy();
                updateWealthChart();
                saveToLocalStorage();
            });
        }
    });
    
    console.log('Big goal section initialized');
}

function updateBigGoalCalculation() {
    if (!appState.bigGoal.enabled) return;
    
    const goalAmount = parseFloat(appState.bigGoal.amount) || 0;
    const goalDate = new Date(appState.bigGoal.date);
    const today = new Date();
    
    if (goalAmount > 0 && goalDate > today) {
        const monthsUntilGoal = (goalDate - today) / (1000 * 60 * 60 * 24 * 30.44);
        const monthlyRequired = Math.round(goalAmount / monthsUntilGoal);
        
        appState.bigGoal.monthlyRequired = monthlyRequired;
        
        const monthlyAmountEl = document.getElementById('monthlyGoalAmount');
        const feasibilityEl = document.getElementById('goalFeasibility');
        
        if (monthlyAmountEl) {
            monthlyAmountEl.textContent = `$${monthlyRequired.toLocaleString()}`;
        }
        
        if (feasibilityEl) {
            const monthlyExpenses = Math.round(appState.totalWeeklyExpenses * 52 / 12);
            const remainingIncome = Math.max(0, appState.monthlyIncome - monthlyExpenses);
            
            feasibilityEl.className = 'goal-feasibility';
            
            if (monthlyRequired > remainingIncome * 0.8) {
                feasibilityEl.className += ' error';
                feasibilityEl.textContent = 'Warning: This goal requires most of your remaining income and may not be feasible.';
            } else if (monthlyRequired > remainingIncome * 0.5) {
                feasibilityEl.className += ' warning';
                feasibilityEl.textContent = 'This is ambitious but achievable with careful budgeting.';
            } else {
                feasibilityEl.className += ' success';
                feasibilityEl.textContent = 'This goal looks very achievable!';
            }
        }
        
        console.log('Big goal calculation updated:', monthlyRequired);
    }
}

// Allocation Settings
function initializeAllocationSettings() {
    const sliders = [
        { id: 'emergencyPercentSlider', setting: 'emergency', valueId: 'emergencyPercentValue' },
        { id: 'corePercentSlider', setting: 'core', valueId: 'corePercentValue' },
        { id: 'satellitePercentSlider', setting: 'satellite', valueId: 'satellitePercentValue' },
        { id: 'bigGoalPercentSlider', setting: 'bigGoal', valueId: 'bigGoalPercentValue' }
    ];
    
    sliders.forEach(({ id, setting, valueId }) => {
        const slider = document.getElementById(id);
        const valueElement = document.getElementById(valueId);
        
        if (slider && valueElement) {
            // Set initial value
            slider.value = appState.allocationSettings[setting];
            valueElement.textContent = `${appState.allocationSettings[setting]}%`;
            
            slider.addEventListener('input', function() {
                const value = parseInt(this.value);
                appState.allocationSettings[setting] = value;
                valueElement.textContent = `${value}%`;
                updateAllocationSummary();
                updateWealthStrategy();
                updateWealthChart();
                saveToLocalStorage();
                console.log(`${setting} allocation updated to:`, value);
            });
        }
    });
    
    updateAllocationSummary();
    console.log('Allocation settings initialized');
}

function updateAllocationSummary() {
    const settings = appState.allocationSettings;
    const total = settings.emergency + settings.core + settings.satellite + settings.bigGoal;
    const flexible = 100 - total;
    
    // Update summary display
    const summaryElements = [
        { id: 'summaryEmergency', value: settings.emergency },
        { id: 'summaryCore', value: settings.core },
        { id: 'summarySatellite', value: settings.satellite },
        { id: 'summaryBigGoal', value: settings.bigGoal },
        { id: 'summaryTotal', value: total },
        { id: 'summaryFlexible', value: flexible }
    ];
    
    summaryElements.forEach(({ id, value }) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = `${value}%`;
        }
    });
    
    console.log('Allocation summary updated:', { total, flexible });
}

// Use This Amount Button
function useThisAmount() {
    console.log('useThisAmount button clicked');
    switchToTab('wealth');
    // After switching, scroll to Emergency Fund section for next step
    setTimeout(() => {
        const emergencySection = document.getElementById('emergency-fund');
        if (emergencySection) {
            emergencySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 200);
}

function updateFixedExpensesDisplay() {
    const monthlyExpenses = Math.round(appState.totalWeeklyExpenses * 52 / 12);
    const displayEl = document.getElementById('fixedExpensesDisplay');
    
    if (displayEl) {
        displayEl.textContent = `$${monthlyExpenses.toLocaleString()}`;
    }
    
    console.log('Fixed expenses display updated:', monthlyExpenses);
}

// Wealth Strategy Calculations
function updateWealthStrategy() {
    const monthlyIncome = appState.monthlyIncome;
    const monthlyExpenses = Math.round(appState.totalWeeklyExpenses * 52 / 12);
    
    if (monthlyIncome === 0) {
        console.log('No income set, skipping wealth strategy update');
        return;
    }
    
    const remainingIncome = Math.max(0, monthlyIncome - monthlyExpenses);
    
    // Check if emergency fund is fully funded
    const emergencyTarget = monthlyExpenses * 6;
    const emergencyFunded = appState.startingEmergencyFund >= emergencyTarget;
    
    // Calculate allocations using custom settings
    const settings = appState.allocationSettings;
    
    // Emergency fund allocation (if not fully funded)
    let emergency = 0;
    if (!emergencyFunded) {
        const emergencyTarget = monthlyExpenses * 6;
        const remainingEmergency = emergencyTarget - appState.startingEmergencyFund;
        emergency = Math.min(Math.round(remainingEmergency / 12), Math.round(remainingIncome * settings.emergency / 100));
    }
    
    // Big goal allocation
    let bigGoalAmount = 0;
    if (appState.bigGoal.enabled && appState.bigGoal.monthlyRequired > 0) {
        bigGoalAmount = Math.min(appState.bigGoal.monthlyRequired, Math.round(remainingIncome * settings.bigGoal / 100));
    }
    
    // Core and satellite investments
    const core = Math.round(remainingIncome * settings.core / 100);
    const satellite = Math.round(remainingIncome * settings.satellite / 100);
    
    // Flexible spending (remaining after all allocations)
    const flexible = Math.max(0, remainingIncome - emergency - bigGoalAmount - core - satellite);
    
    appState.allocations = {
        fixed: monthlyExpenses,
        emergency: emergency,
        bigGoal: bigGoalAmount,
        core: core,
        satellite: satellite,
        flexible: flexible
    };
    
    console.log('Wealth strategy updated:', appState.allocations);
    
    updateAllocationDisplay();
    updateExpectedOutcomes();
}

function updateAllocationDisplay() {
    const totalIncome = appState.monthlyIncome;
    
    // Show/hide big goal allocation
    const bigGoalAllocation = document.getElementById('bigGoalAllocation');
    if (bigGoalAllocation) {
        if (appState.bigGoal.enabled && appState.allocations.bigGoal > 0) {
            bigGoalAllocation.style.display = 'block';
        } else {
            bigGoalAllocation.style.display = 'none';
        }
    }
    
    // Update amounts and percentages
    const updates = [
        { id: 'fixedAmount', amount: appState.allocations.fixed, percent: 'fixedPercent' },
        { id: 'emergencyAmount', amount: appState.allocations.emergency, percent: 'emergencyPercent' },
        { id: 'bigGoalAmount', amount: appState.allocations.bigGoal, percent: 'bigGoalPercent' },
        { id: 'coreAmount', amount: appState.allocations.core, percent: 'corePercent' },
        { id: 'satelliteAmount', amount: appState.allocations.satellite, percent: 'satellitePercent' },
        { id: 'flexibleAmount', amount: appState.allocations.flexible, percent: 'flexiblePercent' }
    ];
    
    updates.forEach(update => {
        const amountEl = document.getElementById(update.id);
        const percentEl = document.getElementById(update.percent);
        
        if (amountEl) {
            amountEl.textContent = `$${update.amount.toLocaleString()}`;
        }
        
        if (percentEl && totalIncome > 0) {
            const percentage = Math.round((update.amount / totalIncome) * 100);
            percentEl.textContent = `${percentage}%`;
        }
    });
    
    console.log('Allocation display updated');
}

function updateExpectedOutcomes() {
    const monthly = appState.allocations;
    
    // Year 1 calculations
    const year1Emergency = monthly.emergency * 12;
    const year1Investments = (monthly.core + monthly.satellite) * 12;
    const year1BigGoal = monthly.bigGoal * 12;
    const year1Total = year1Emergency + year1Investments + year1BigGoal;
    
    // Year 3 calculations (assuming 7% growth on investments)
    const year3Emergency = monthly.emergency * 36;
    const year3Investments = ((monthly.core + monthly.satellite) * 36) * 1.225; // ~7.5% compound growth
    const year3BigGoal = monthly.bigGoal * 36;
    const year3Total = year3Emergency + year3Investments + year3BigGoal;
    
    // Update Year 1 display
    const year1TotalEl = document.getElementById('year1Total');
    const year1BreakdownEl = document.getElementById('year1Breakdown');
    
    if (year1TotalEl) {
        year1TotalEl.textContent = `$${Math.round(year1Total).toLocaleString()}`;
    }
    
    if (year1BreakdownEl) {
        let breakdown = `<li>Emergency fund: $${Math.round(year1Emergency).toLocaleString()}</li>`;
        breakdown += `<li>Investments: $${Math.round(year1Investments).toLocaleString()}</li>`;
        if (year1BigGoal > 0) {
            breakdown += `<li>Big goal savings: $${Math.round(year1BigGoal).toLocaleString()}</li>`;
        }
        year1BreakdownEl.innerHTML = breakdown;
    }
    
    // Update Year 3 display
    const year3TotalEl = document.getElementById('year3Total');
    const year3BreakdownEl = document.getElementById('year3Breakdown');
    
    if (year3TotalEl) {
        year3TotalEl.textContent = `$${Math.round(year3Total).toLocaleString()}`;
    }
    
    if (year3BreakdownEl) {
        let breakdown = `<li>Emergency fund: $${Math.round(year3Emergency).toLocaleString()}</li>`;
        breakdown += `<li>Investment portfolio: $${Math.round(year3Investments).toLocaleString()}</li>`;
        if (year3BigGoal > 0) {
            breakdown += `<li>Big goal savings: $${Math.round(year3BigGoal).toLocaleString()}</li>`;
        }
        year3BreakdownEl.innerHTML = breakdown;
    }
    
    console.log('Expected outcomes updated');
}

// Wealth Chart
function initializeWealthChart() {
    if (wealthChart) {
        wealthChart.destroy();
        wealthChart = null;
    }
    
    const ctx = document.getElementById('wealthChart');
    if (!ctx) {
        console.log('Wealth chart canvas not found');
        return;
    }
    
    const allocations = appState.allocations;
    
    // Don't create chart if no meaningful data
    if (!allocations.fixed && !allocations.emergency && !allocations.core) {
        console.log('No allocation data for chart');
        return;
    }
    
    const labels = ['Fixed Expenses', 'Emergency Fund', 'Core Investments', 'Satellite Investment', 'Flexible Spending'];
    const data = [allocations.fixed, allocations.emergency, allocations.core, allocations.satellite, allocations.flexible];
    const colors = ['#B4413C', '#1FB8CD', '#5D878F', '#ECEBD5', '#DB4545'];
    
    // Add big goal if enabled
    if (appState.bigGoal.enabled && allocations.bigGoal > 0) {
        labels.splice(2, 0, 'Big Goal');
        data.splice(2, 0, allocations.bigGoal);
        colors.splice(2, 0, '#FFC185');
    }
    
    const chartData = {
        labels: labels,
        datasets: [{
            data: data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 10
        }]
    };
    
    const config = {
        type: 'pie',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                            const value = context.parsed;
                            return `${context.label}: $${value.toLocaleString()} (${percentage}%)`;
                        }
                    }
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };
    
    wealthChart = new Chart(ctx, config);
    console.log('Wealth chart created successfully');
}

function updateWealthChart() {
    if (!wealthChart) {
        initializeWealthChart();
        return;
    }
    
    const allocations = appState.allocations;
    const labels = ['Fixed Expenses', 'Emergency Fund', 'Core Investments', 'Satellite Investment', 'Flexible Spending'];
    const data = [allocations.fixed, allocations.emergency, allocations.core, allocations.satellite, allocations.flexible];
    const colors = ['#B4413C', '#1FB8CD', '#5D878F', '#ECEBD5', '#DB4545'];
    
    // Add big goal if enabled
    if (appState.bigGoal.enabled && allocations.bigGoal > 0) {
        labels.splice(2, 0, 'Big Goal');
        data.splice(2, 0, allocations.bigGoal);
        colors.splice(2, 0, '#FFC185');
    }
    
    wealthChart.data.labels = labels;
    wealthChart.data.datasets[0].data = data;
    wealthChart.data.datasets[0].backgroundColor = colors;
    
    wealthChart.update();
    console.log('Wealth chart updated');
}

// Definition Cards
function initializeDefinitions() {
    const container = document.querySelector('.definitions-grid');
    if (!container) return;
    
    // Clear existing content
    container.innerHTML = '';
    
    Object.entries(definitions).forEach(([term, definition]) => {
        const card = createDefinitionCard(term, definition);
        container.appendChild(card);
    });
    
    console.log('Definitions initialized');
}

function createDefinitionCard(term, definition) {
    const div = document.createElement('div');
    div.className = 'definition-card';
    div.innerHTML = `
        <div class="definition-header">
            <h4>${term}</h4>
            <span class="definition-toggle">+</span>
        </div>
        <div class="definition-content">
            <p>${definition}</p>
        </div>
    `;
    
    div.addEventListener('click', function(e) {
        e.preventDefault();
        toggleDefinition(this);
    });
    
    div.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleDefinition(this);
        }
    });
    
    div.setAttribute('tabindex', '0');
    
    return div;
}

function toggleDefinition(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Close all other definitions first (accordion behavior)
    const allCards = document.querySelectorAll('.definition-card');
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove('expanded');
        }
    });
    
    // Toggle current card
    if (isExpanded) {
        card.classList.remove('expanded');
    } else {
        card.classList.add('expanded');
    }
}

// Local Storage
function saveToLocalStorage() {
    try {
        const dataToSave = {
            selectedCity: appState.selectedCity,
            expenses: appState.expenses,
            monthlyIncome: appState.monthlyIncome,
            startingEmergencyFund: appState.startingEmergencyFund,
            bigGoal: appState.bigGoal,
            allocationSettings: appState.allocationSettings
        };
        localStorage.setItem('wealthBuilderData', JSON.stringify(dataToSave));
        console.log('Data saved to localStorage');
    } catch (error) {
        console.log('Could not save to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const savedData = localStorage.getItem('wealthBuilderData');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Restore city selection
            if (data.selectedCity) {
                appState.selectedCity = data.selectedCity;
                const cityRadio = document.querySelector(`input[value="${data.selectedCity}"]`);
                if (cityRadio) cityRadio.checked = true;
            }
            
            // Restore expenses
            if (data.expenses) {
                appState.expenses = { ...appState.expenses, ...data.expenses };
                
                // Update sliders
                if (data.expenses.accommodation !== undefined) {
                    const slider = document.getElementById('accommodationSlider');
                    if (slider) slider.value = data.expenses.accommodation;
                    updateSliderValue('accommodation');
                }
                
                if (data.expenses.food !== undefined) {
                    const slider = document.getElementById('foodSlider');
                    if (slider) slider.value = data.expenses.food;
                    updateSliderValue('food');
                }
                
                if (data.expenses.transport !== undefined) {
                    const slider = document.getElementById('transportSlider');
                    if (slider) slider.value = data.expenses.transport;
                    updateSliderValue('transport');
                }
                
                // Restore custom expenses
                if (data.expenses.customExpenses) {
                    renderCustomExpenses();
                }
            }
            
            // Restore income
            if (data.monthlyIncome) {
                appState.monthlyIncome = data.monthlyIncome;
                const incomeInput = document.getElementById('incomeAmount');
                if (incomeInput) incomeInput.value = data.monthlyIncome;
                updateIncomeCalculations();
            }
            
            // Restore emergency fund
            if (data.startingEmergencyFund !== undefined) {
                appState.startingEmergencyFund = data.startingEmergencyFund;
                const emergencyInput = document.getElementById('startingEmergencyFund');
                if (emergencyInput) emergencyInput.value = data.startingEmergencyFund;
            }
            
            // Restore big goal
            if (data.bigGoal) {
                appState.bigGoal = { ...appState.bigGoal, ...data.bigGoal };
                
                const toggle = document.getElementById('bigGoalToggle');
                const content = document.getElementById('bigGoalContent');
                const nameInput = document.getElementById('goalName');
                const amountInput = document.getElementById('goalAmount');
                const dateInput = document.getElementById('goalDate');
                
                if (toggle) toggle.checked = appState.bigGoal.enabled;
                if (content && appState.bigGoal.enabled) content.classList.add('active');
                if (nameInput) nameInput.value = appState.bigGoal.name || '';
                if (amountInput) amountInput.value = appState.bigGoal.amount || '';
                if (dateInput) dateInput.value = appState.bigGoal.date || '';
                
                updateBigGoalCalculation();
            }
            
            // Restore allocation settings
            if (data.allocationSettings) {
                appState.allocationSettings = { ...appState.allocationSettings, ...data.allocationSettings };
                
                // Update sliders and values
                const sliders = [
                    { id: 'emergencyPercentSlider', setting: 'emergency', valueId: 'emergencyPercentValue' },
                    { id: 'corePercentSlider', setting: 'core', valueId: 'corePercentValue' },
                    { id: 'satellitePercentSlider', setting: 'satellite', valueId: 'satellitePercentValue' },
                    { id: 'bigGoalPercentSlider', setting: 'bigGoal', valueId: 'bigGoalPercentValue' }
                ];
                
                sliders.forEach(({ id, setting, valueId }) => {
                    const slider = document.getElementById(id);
                    const valueElement = document.getElementById(valueId);
                    if (slider && valueElement) {
                        slider.value = appState.allocationSettings[setting];
                        valueElement.textContent = `${appState.allocationSettings[setting]}%`;
                    }
                });
                
                updateAllocationSummary();
            }
            
            console.log('Data restored from localStorage');
        }
    } catch (error) {
        console.log('Could not load from localStorage:', error);
    }
}

// Global function exports for HTML onclick handlers
window.useThisAmount = useThisAmount;
window.switchToTab = switchToTab;
window.toggleDefinition = toggleDefinition;

// Export app state for debugging
window.appState = appState;

console.log('Australian Student Wealth Builder JavaScript loaded successfully');