class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadTheme();
    }

    initializeElements() {
        this.resultElement = document.getElementById('result');
        this.operationElement = document.getElementById('operation');
        this.themeToggle = document.getElementById('themeToggle');
        this.buttons = document.querySelectorAll('.btn');
    }

    attachEventListeners() {
        // Number buttons
        document.querySelectorAll('.btn[data-value]').forEach(button => {
            button.addEventListener('click', () => {
                this.handleNumber(button.dataset.value);
            });
        });

        // Operator buttons
        document.querySelectorAll('.btn[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                this.handleAction(button.dataset.action);
            });
        });

        // Theme toggle
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboard(e);
        });
    }

    handleNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentInput = '';
            this.shouldResetDisplay = false;
        }

        if (this.currentInput === '0' && number !== '.') {
            this.currentInput = number;
        } else if (number === '.' && this.currentInput.includes('.')) {
            return; // Prevent multiple decimal points
        } else {
            this.currentInput += number;
        }

        this.updateDisplay();
    }

    handleAction(action) {
        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'toggle':
                this.toggleSign();
                break;
            case 'percent':
                this.percentage();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.setOperation(action);
                break;
            case 'equals':
                this.calculate();
                break;
            case 'decimal':
                this.handleNumber('.');
                break;
        }
    }

    setOperation(op) {
        if (this.previousInput !== '' && this.operation !== null) {
            this.calculate();
        }

        this.operation = op;
        this.previousInput = this.currentInput;
        this.shouldResetDisplay = true;
        this.updateOperationDisplay();
    }

    calculate() {
        if (this.previousInput === '' || this.operation === null) {
            return;
        }

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;

        switch (this.operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.currentInput = 'Error';
                    this.updateDisplay();
                    setTimeout(() => this.clear(), 2000);
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }

        // Format the operation for display
        const operationSymbol = this.getOperationSymbol(this.operation);
        this.operationElement.textContent = `${this.formatNumber(prev)} ${operationSymbol} ${this.formatNumber(current)}`;
        
        this.currentInput = result.toString();
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    getOperationSymbol(op) {
        const symbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        return symbols[op] || '';
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.operationElement.textContent = '';
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentInput !== '0' && this.currentInput !== 'Error') {
            this.currentInput = this.currentInput.startsWith('-') 
                ? this.currentInput.slice(1) 
                : '-' + this.currentInput;
            this.updateDisplay();
        }
    }

    percentage() {
        if (this.currentInput !== '0' && this.currentInput !== 'Error') {
            this.currentInput = (parseFloat(this.currentInput) / 100).toString();
            this.updateDisplay();
        }
    }

    formatNumber(num) {
        const number = parseFloat(num);
        if (isNaN(number)) return num;
        
        // Format with commas for thousands
        return number.toLocaleString('en-US', {
            maximumFractionDigits: 10,
            useGrouping: true
        });
    }

    updateDisplay() {
        if (this.currentInput === 'Error') {
            this.resultElement.textContent = 'Error';
            return;
        }

        const formatted = this.formatNumber(this.currentInput);
        this.resultElement.textContent = formatted;
    }

    updateOperationDisplay() {
        if (this.previousInput !== '' && this.operation !== null) {
            const operationSymbol = this.getOperationSymbol(this.operation);
            this.operationElement.textContent = `${this.formatNumber(this.previousInput)} ${operationSymbol}`;
        }
    }

    handleKeyboard(e) {
        // Prevent default for calculator keys
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '+', '-', '*', '/', 'Enter', 'Escape', '%'].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key >= '0' && e.key <= '9') {
            this.handleNumber(e.key);
        } else if (e.key === '.') {
            this.handleNumber('.');
        } else if (e.key === '+') {
            this.setOperation('add');
        } else if (e.key === '-') {
            this.setOperation('subtract');
        } else if (e.key === '*') {
            this.setOperation('multiply');
        } else if (e.key === '/') {
            this.setOperation('divide');
        } else if (e.key === 'Enter' || e.key === '=') {
            this.calculate();
        } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
            this.clear();
        } else if (e.key === '%') {
            this.percentage();
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-theme');
        const isLightTheme = document.body.classList.contains('light-theme');
        localStorage.setItem('calculatorTheme', isLightTheme ? 'light' : 'dark');
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('calculatorTheme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
