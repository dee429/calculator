let currentInput = '0';
        let previousInput = '';
        let operator = null;
        let waitingForNumber = false;

        const currentDisplay = document.getElementById('currentDisplay');
        const previousDisplay = document.getElementById('previousDisplay');

        function updateDisplay() {
            currentDisplay.textContent = formatNumber(currentInput);
            if (operator) {
                previousDisplay.textContent = `${formatNumber(previousInput)} ${operator}`;
            } else {
                previousDisplay.textContent = '';
            }
        }

        function formatNumber(num) {
            if (num.length > 12) {
                return parseFloat(num).toExponential(6);
            }
            return num;
        }

        function inputNumber(num) {
            if (waitingForNumber) {
                currentInput = num;
                waitingForNumber = false;
            } else {
                currentInput = currentInput === '0' ? num : currentInput + num;
            }
            updateDisplay();
            animateButton(event.target);
        }

        function inputDecimal() {
            if (waitingForNumber) {
                currentInput = '0.';
                waitingForNumber = false;
            } else if (currentInput.indexOf('.') === -1) {
                currentInput += '.';
            }
            updateDisplay();
            animateButton(event.target);
        }

        function inputOperator(op) {
            if (operator && !waitingForNumber) {
                calculate();
            }
            
            previousInput = currentInput;
            operator = op;
            waitingForNumber = true;
            updateDisplay();
            animateButton(event.target);
        }

        function calculate() {
            if (!operator || waitingForNumber) return;
            
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            let result;
            
            try {
                switch (operator) {
                    case '+':
                        result = prev + current;
                        break;
                    case '−':
                        result = prev - current;
                        break;
                    case '×':
                        result = prev * current;
                        break;
                    case '÷':
                        if (current === 0) {
                            throw new Error('Division by zero');
                        }
                        result = prev / current;
                        break;
                    default:
                        return;
                }
                
                // Round to avoid floating point errors
                result = Math.round(result * 1000000000000) / 1000000000000;
                currentInput = result.toString();
                
            } catch (error) {
                currentInput = 'Error';
                currentDisplay.classList.add('error');
                setTimeout(() => {
                    currentDisplay.classList.remove('error');
                    clearAll();
                }, 2000);
                return;
            }
            
            operator = null;
            previousInput = '';
            waitingForNumber = true;
            updateDisplay();
            animateButton(event.target);
        }

        function clearAll() {
            currentInput = '0';
            previousInput = '';
            operator = null;
            waitingForNumber = false;
            updateDisplay();
            animateButton(event.target);
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
            animateButton(event.target);
        }

        function toggleSign() {
            if (currentInput !== '0') {
                currentInput = currentInput.startsWith('-') 
                    ? currentInput.substring(1) 
                    : '-' + currentInput;
                updateDisplay();
            }
            animateButton(event.target);
        }

        function animateButton(button) {
            if (button) {
                button.classList.add('btn-active');
                setTimeout(() => button.classList.remove('btn-active'), 200);
            }
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            const key = event.key;
            let button = null;
            
            // Prevent default behavior for calculator keys
            if ('0123456789+-*/=.'.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
                event.preventDefault();
            }
            
            if ('0123456789'.includes(key)) {
                inputNumber(key);
                button = document.querySelector(`[onclick="inputNumber('${key}')"]`);
            } else if (key === '.') {
                inputDecimal();
                button = document.querySelector(`[onclick="inputDecimal()"]`);
            } else if (key === '+') {
                inputOperator('+');
                button = document.querySelector(`[onclick="inputOperator('+')"]`);
            } else if (key === '-') {
                inputOperator('−');
                button = document.querySelector(`[onclick="inputOperator('−')"]`);
            } else if (key === '*') {
                inputOperator('×');
                button = document.querySelector(`[onclick="inputOperator('×')"]`);
            } else if (key === '/') {
                inputOperator('÷');
                button = document.querySelector(`[onclick="inputOperator('÷')"]`);
            } else if (key === 'Enter' || key === '=') {
                calculate();
                button = document.querySelector(`[onclick="calculate()"]`);
            } else if (key === 'Escape') {
                clearAll();
                button = document.querySelector(`[onclick="clearAll()"]`);
            } else if (key === 'Backspace') {
                deleteLast();
                button = document.querySelector(`[onclick="deleteLast()"]`);
            }
            
            if (button) {
                animateButton(button);
            }
        });

        // Initialize display
        updateDisplay();