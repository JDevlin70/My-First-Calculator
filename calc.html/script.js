// Variable to keep track of the current expression
let currentExpression = '';

// Update the display
function updateDisplay(value) {
    document.getElementById('display').textContent = value;
}

// Handle number buttons
function appendNumber(number) {
    let display = document.getElementById('display');
    // If the display is currently showing '0' or it's an error, reset it
    if (display.textContent === '0' || display.textContent === 'Error') {
        display.textContent = number;
    } else {
        // Append the number normally
        display.textContent += number;
    }
    currentExpression = display.textContent; // Update the current expression
}

// Handle operator buttons
function appendOperator(operator) {
    let display = document.getElementById('display');
    if (display.textContent === 'Error') {
        // If error is displayed, reset the expression and start over
        display.textContent = '';
    }
    // Only add the operator if the last character is not an operator (to prevent consecutive operators)
    if (!['+', '-', '*', '/'].includes(display.textContent.slice(-1))) {
        currentExpression += operator; // Add operator to the expression
        display.textContent = currentExpression; // Update the display with the expression
    }
}

// Calculate the result when "=" is clicked or Enter is pressed
function calculateResult() {
    try {
        let result = eval(currentExpression); // Use eval to compute the expression
        currentExpression = result.toString(); // Update the expression with the result
        updateDisplay(currentExpression); // Show result on display
    } catch (error) {
        updateDisplay('Error'); // Show error if the expression is invalid
        currentExpression = ''; // Clear the expression after error
    }
}

// Handle the clear button
function clearDisplay() {
    currentExpression = ''; // Reset the current expression
    updateDisplay('0'); // Reset the display to '0'
}

// Backspace functionality: removes last character from the display
function backspace() {
    let display = document.getElementById('display');
    let currentText = display.textContent;

    if (currentText.length > 1) {
        // Remove last character if there is more than one character
        display.textContent = currentText.slice(0, -1);
    } else {
        // If only one character, reset to '0'
        display.textContent = '0';
    }
    currentExpression = display.textContent; // Update the current expression
}

// Convert decimal to fraction
function decimalToFraction(decimal) {
    if (isNaN(decimal)) return decimal; // Return as-is if input is not a number

    let fraction = decimal.toString();
    if (fraction.indexOf('.') === -1) {
        return fraction + "/1"; // If it's already a whole number, return fraction
    } else {
        let length = fraction.split('.')[1].length;
        let denominator = Math.pow(10, length);
        let numerator = parseInt(decimal * denominator);
        let gcd = (a, b) => b === 0 ? a : gcd(b, a % b); // Greatest Common Divisor function
        let divisor = gcd(numerator, denominator);
        numerator /= divisor;
        denominator /= divisor;
        return numerator + '/' + denominator;
    }
}

// Convert fraction to decimal
function fractionToDecimal(fraction) {
    let parts = fraction.split('/');
    if (parts.length === 2) {
        return parseFloat(parts[0]) / parseFloat(parts[1]);
    }
    return fraction; // If it's not a valid fraction, return it as-is
}

// Handle the decimal-to-fraction and fraction-to-decimal conversion
function toggleDecimalFraction() {
    let display = document.getElementById('display');
    let value = display.textContent;

    if (value.includes('/')) {
        // If it's a fraction, convert it to decimal
        let decimalValue = fractionToDecimal(value);
        updateDisplay(decimalValue);
        currentExpression = decimalValue.toString();
    } else if (!isNaN(value)) {
        // If it's a decimal, convert it to fraction
        let fractionValue = decimalToFraction(parseFloat(value));
        updateDisplay(fractionValue);
        currentExpression = fractionValue;
    }
}

// Handle the Enter key for equals
document.addEventListener('keydown', function(event) {
    if (event.repeat) return; // Skip repeated keys to avoid double entry
    // Handle Enter key for calculating result
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default action (e.g., form submission)
        calculateResult();
    }
    // Handle numeric and operator keys
    if (event.key >= '0' && event.key <= '9') {
        appendNumber(event.key); // Add the number to display
    } else if (event.key === '.' || event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendOperator(event.key); // Add the operator to the expression
    } else if (event.key === 'c' || event.key === 'C') {
        clearDisplay(); // Clear the display
    } else if (event.key === 'Backspace') {
        backspace(); // Handle backspace key on the keyboard
    }
});

// Handle button clicks
let isButtonActive = false; // Flag to prevent double-clicking
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(event) {
        if (isButtonActive) return; // Prevent double-clicking
        isButtonActive = true;

        let value = event.target.textContent;

        // Handle operator, number, and function buttons
        if (isNaN(value) && value !== '.') {
            if (value === "=") {
                calculateResult();
            } else if (value === "C") {
                clearDisplay();
            } else if (value === "←") {
                backspace(); // Implement backspace functionality
            } else if (value === "↔") {
                toggleDecimalFraction(); // Handle the decimal-to-fraction toggle button
            } else {
                appendOperator(value);
            }
        } else { // Else, append number
            appendNumber(value);
        }

        setTimeout(() => {
            isButtonActive = false; // Allow button click again after a short delay
        }, 100); // Timeout delay to prevent double-clicking
    });
});