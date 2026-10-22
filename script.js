// ========================
// CALCULATOR CLASS
// ========================

class Calculator {
    constructor(displayElement, historyElement) {
        this.display = displayElement;
        this.historyElement = historyElement;
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.history = this.loadHistory();
        this.decimalAdded = false;
    }

    // Update display
    updateDisplay() {
        this.display.value = this.currentValue;
        this.updateHistoryDisplay();
    }

    // Update history display
    updateHistoryDisplay() {
        const historyDisplay = document.getElementById('history');
        if (this.previousValue && this.operator) {
            historyDisplay.textContent = `${this.previousValue} ${this.getOperatorSymbol(this.operator)}`;
        } else {
            historyDisplay.textContent = '';
        }
    }

    // Get operator symbol for display
    getOperatorSymbol(op) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷'
        };
        return symbols[op] || op;
    }

    // Append number
    appendNumber(num) {
        if (this.shouldResetDisplay) {
            this.currentValue = String(num);
            this.shouldResetDisplay = false;
        } else {
            if (this.currentValue === '0' && num !== '0') {
                this.currentValue = String(num);
            } else if (this.currentValue !== '0' || num === '0') {
                this.currentValue += String(num);
            }
        }
        this.updateDisplay();
    }

    // Add decimal point
    appendDecimal() {
        if (this.shouldResetDisplay) {
            this.currentValue = '0.';
            this.shouldResetDisplay = false;
            this.decimalAdded = true;
        } else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
            this.decimalAdded = true;
        }
        this.updateDisplay();
    }

    // Set operator
    setOperator(nextOperator) {
        if (this.currentValue === '') return;

        if (this.previousValue !== '' && this.operator && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operator = nextOperator;
        this.shouldResetDisplay = true;
        this.decimalAdded = false;
        this.updateDisplay();
    }

    // Calculate result
    calculate() {
        if (!this.operator || this.previousValue === '' || this.currentValue === '') {
            return;
        }

        let result;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    this.clear();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Round to avoid floating point errors
        result = Math.round(result * 100000000) / 100000000;

        // Add to history
        this.addToHistory(`${prev} ${this.getOperatorSymbol(this.operator)} ${current} = ${result}`);

        this.currentValue = String(result);
        this.operator = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.decimalAdded = false;
        this.updateDisplay();
    }

    // Clear all
    clear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operator = null;
        this.shouldResetDisplay = false;
        this.decimalAdded = false;
        this.updateDisplay();
    }

    // Delete last character
    deleteLast() {
        if (this.shouldResetDisplay) return;

        if (this.currentValue.length === 1) {
            this.currentValue = '0';
        } else {
            if (this.currentValue.endsWith('.')) {
                this.decimalAdded = false;
            }
            this.currentValue = this.currentValue.slice(0, -1);
        }
        this.updateDisplay();
    }

    // Percentage
    percentage() {
        const current = parseFloat(this.currentValue);
        
        if (this.operator && this.previousValue !== '') {
            const previous = parseFloat(this.previousValue);
            const percentValue = (previous * current) / 100;
            this.currentValue = String(percentValue);
        } else {
            this.currentValue = String(current / 100);
        }
        
        this.updateDisplay();
    }

    // Square
    square() {
        const current = parseFloat(this.currentValue);
        const result = current * current;
        this.currentValue = String(result);
        this.operator = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.decimalAdded = false;
        this.updateDisplay();
    }

    // Square root
    squareRoot() {
        const current = parseFloat(this.currentValue);
        
        if (current < 0) {
            alert('Cannot calculate square root of negative number!');
            return;
        }
        
        const result = Math.sqrt(current);
        this.currentValue = String(result);
        this.operator = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.decimalAdded = false;
        this.updateDisplay();
    }

    // Reciprocal (1/x)
    reciprocal() {
        const current = parseFloat(this.currentValue);
        
        if (current === 0) {
            alert('Cannot divide by zero!');
            return;
        }
        
        const result = 1 / current;
        this.currentValue = String(result);
        this.operator = null;
        this.previousValue = '';
        this.shouldResetDisplay = true;
        this.decimalAdded = false;
        this.updateDisplay();
    }

    // Negate (±)
    negate() {
        const current = parseFloat(this.currentValue);
        this.currentValue = String(-current);
        this.updateDisplay();
    }

    // ========================
    // HISTORY MANAGEMENT
    // ========================

    // Add to history
    addToHistory(expression) {
        this.history.unshift(expression);
        if (this.history.length > 10) {
            this.history.pop();
        }
        this.saveHistory();
        this.renderHistory();
    }

    // Render history
    renderHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<p class="empty-history">No history yet</p>';
            return;
        }

        historyList.innerHTML = this.history.map((item, index) => {
            const [expression, result] = item.split(' = ');
            return `
                <div class="history-item" data-index="${index}">
                    <span class="history-expression">${expression}</span>
                    <span class="history-result">${result}</span>
                </div>
            `;
        }).join('');

        // Add click listeners to history items
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                const expression = this.history[index];
                const result = expression.split(' = ')[1];
                this.currentValue = result;
                this.shouldResetDisplay = true;
                this.updateDisplay();
            });
        });
    }

    // Clear history
    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
    }

    // Save history to localStorage
    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    // Load history from localStorage
    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        return saved ? JSON.parse(saved) : [];
    }
}

// ========================
// DOM ELEMENTS
// ========================

const display = document.getElementById('display');
const calculator = new Calculator(display, document.getElementById('history'));

const numberButtons = document.querySelectorAll('.btn-number');
const operatorButtons = document.querySelectorAll('.btn-operator');
const btnEquals = document.getElementById('btnEquals');
const btnClear = document.getElementById('btnClear');
const btnDelete = document.getElementById('btnDelete');
const btnDecimal = document.getElementById('btnDecimal');
const btnPercent = document.getElementById('btnPercent');
const btnSquare = document.getElementById('btnSquare');
const btnSqrt = document.getElementById('btnSqrt');
const btnReciprocal = document.getElementById('btnReciprocal');
const btnNegate = document.getElementById('btnNegate');
const btnClearHistory = document.getElementById('btnClearHistory');
const themeBtn = document.getElementById('themeBtn');

// ========================
// EVENT LISTENERS
// ========================

// Number buttons
numberButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        calculator.appendNumber(btn.dataset.number);
    });
});

// Operator buttons
operatorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        calculator.setOperator(btn.dataset.operator);
    });
});

// Equals button
btnEquals.addEventListener('click', () => {
    calculator.calculate();
});

// Clear button
btnClear.addEventListener('click', () => {
    calculator.clear();
});

// Delete button
btnDelete.addEventListener('click', () => {
    calculator.deleteLast();
});

// Decimal button
btnDecimal.addEventListener('click', () => {
    calculator.appendDecimal();
});

// Percent button
btnPercent.addEventListener('click', () => {
    calculator.percentage();
});

// Square button
btnSquare.addEventListener('click', () => {
    calculator.square();
});

// Square root button
btnSqrt.addEventListener('click', () => {
    calculator.squareRoot();
});

// Reciprocal button
btnReciprocal.addEventListener('click', () => {
    calculator.reciprocal();
});

// Negate button
btnNegate.addEventListener('click', () => {
    calculator.negate();
});

// Clear history button
btnClearHistory.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the history?')) {
        calculator.clearHistory();
    }
});

// ========================
// KEYBOARD SUPPORT
// ========================

document.addEventListener('keydown', (e) => {
    // Prevent default behavior for keys we're handling
    if (['/', '*', '-', '+', '.', 'Enter', 'Backspace', 'Escape'].includes(e.key)) {
        e.preventDefault();
    }

    // Numbers (0-9)
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
    }

    // Operators
    switch (e.key) {
        case '+':
            calculator.setOperator('+');
            break;
        case '-':
            calculator.setOperator('-');
            break;
        case '*':
            calculator.setOperator('*');
            break;
        case '/':
            calculator.setOperator('/');
            break;
        case '.':
            calculator.appendDecimal();
            break;
        case 'Enter':
        case '=':
            calculator.calculate();
            break;
        case 'Backspace':
            calculator.deleteLast();
            break;
        case 'Escape':
            calculator.clear();
            break;
        case '%':
            calculator.percentage();
            break;
    }

    // Update button visual feedback
    const key = e.key.toLowerCase();
    const btn = document.querySelector(`[data-number="${key}"], [data-operator="${key}"]`);
    if (btn) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 100);
    }
});

// ========================
// THEME SWITCHER
// ========================

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('calculatorTheme') || 'light';
    document.body.className = `${savedTheme}-theme`;
    updateThemeIcon(savedTheme);
}

// Update theme icon
function updateThemeIcon(theme) {
    const icon = themeBtn.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Toggle theme
themeBtn.addEventListener('click', () => {
    const currentTheme = document.body.className.includes('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.body.className = `${newTheme}-theme`;
    localStorage.setItem('calculatorTheme', newTheme);
    updateThemeIcon(newTheme);
});

// ========================
// INITIALIZATION
// ========================

document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    calculator.renderHistory();
    calculator.updateDisplay();

    // Add visual feedback for button clicks
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousedown', (e) => {
            btn.style.transform = 'scale(0.95)';
        });

        btn.addEventListener('mouseup', (e) => {
            btn.style.transform = '';
        });

        btn.addEventListener('mouseleave', (e) => {
            btn.style.transform = '';
        });
    });
});

// ========================
// PREVENT COPY/PASTE ISSUES
// ========================

display.addEventListener('paste', (e) => {
    e.preventDefault();
    const pastedText = (e.clipboardData || window.clipboardData).getData('text');
    
    // Only allow numbers and operators
    if (/^[\d+\-*/,.]*$/.test(pastedText)) {
        calculator.currentValue = pastedText.replace(/[,]/g, '');
        calculator.updateDisplay();
    }
});

// Prevent copying
display.addEventListener('copy', (e) => {
    e.clipboardData.setData('text/plain', calculator.currentValue);
    e.preventDefault();
});