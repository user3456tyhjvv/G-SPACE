document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const buyButtonsContainer = document.querySelector('.plan-options');
    const paymentModal = document.getElementById('paymentModal');
    const codeModal = document.getElementById('codeModal');
    const closeModal = document.getElementById('closeModal');
    const closeCodeModal = document.getElementById('closeCodeModal');
    const modalTitle = document.getElementById('modalTitle');
    const paymentAmount = document.getElementById('paymentAmount');
    const confirmStkPayment = document.getElementById('confirmStkPayment');
    const confirmPaybill = document.getElementById('confirmPaybill');
    const stkSpinner = document.getElementById('stkSpinner');
    const paybillSpinner = document.getElementById('paybillSpinner');
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    const closeNotification = document.querySelector('.close-notification');
    const accessCodeDisplay = document.getElementById('accessCodeDisplay');
    const connectBtn = document.getElementById('connectBtn');
    const paybillNumber = document.getElementById('paybillNumber');
    const accountNumber = document.getElementById('accountNumber');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const verifyCodeBtn = document.getElementById('verifyCodeBtn');
    const accessCodeInput = document.getElementById('accessCodeInput');
    
    // Current selected plan
    let currentPlan = null;
    let clientIp = null;
    let clientMac = null;
    let clientGateway = null;
    
    // Set client info from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    clientIp = urlParams.get('ip') || '';
    clientMac = urlParams.get('mac') || '';
    clientGateway = urlParams.get('gateway') || '';
    
    // Plan data
    const plans = [
        { title: "1Hour Unlimited", price: "10", duration: "1Hour Unlimited", speed: "MAX 5mbps", color: "blue" },
        { title: "150mins Unlimited", price: "20", duration: "150mins Unlimited", speed: "MAX 5mbps", color: "green" },
        { title: "4Hours Unlimited", price: "25", duration: "4Hours Unlimited", speed: "MAX 5mbps", color: "green" },
        { title: "2Hours LiveStream", price: "30", duration: "2Hours LiveStream", speed: "MAX 15mbps", color: "red" },
        { title: "8Hours Unlimited", price: "35", duration: "8Hours Unlimited", speed: "MAX 5mbps", color: "red" },
        { title: "13Hours Unlimited", price: "40", duration: "13Hours Unlimited", speed: "MAX 5mbps", color: "green" },
        { title: "6GBs-24hours", price: "45", duration: "6GBs-24hours", speed: "MAX 5mbps", color: "purple" },
        { title: "24Hours Unlimited", price: "50", duration: "24Hours Unlimited", speed: "MAX 5mbps", color: "red" }
    ];
    
    // Generate plan cards
    function generatePlanCards() {
        buyButtonsContainer.innerHTML = '';
        
        plans.forEach(plan => {
            const planCard = document.createElement('div');
            planCard.className = `plan-card border-${plan.color}`;
            planCard.setAttribute('data-amount', plan.price);
            planCard.setAttribute('data-duration', plan.duration);
            
            planCard.innerHTML = `
                <div class="plan-title">${plan.title}</div>
                <div class="plan-price">KSH:${plan.price}/-</div>
                <div class="plan-speed">${plan.speed}</div>
                <button class="buy-btn" data-plan="${plan.title}">Buy Now</button>
            `;
            
            buyButtonsContainer.appendChild(planCard);
        });
        
        // Add event listeners to buy buttons
        document.querySelectorAll('.buy-btn').forEach(button => {
            button.addEventListener('click', function() {
                const planCard = this.closest('.plan-card');
                currentPlan = {
                    amount: planCard.getAttribute('data-amount'),
                    duration: planCard.getAttribute('data-duration'),
                    plan: this.getAttribute('data-plan')
                };
                
                // Update modal content
                modalTitle.textContent = currentPlan.plan;
                paymentAmount.textContent = currentPlan.amount;
                
                // Show modal
                paymentModal.classList.add('active');
            });
        });
    }
    
    // Initialize the page
    generatePlanCards();
    
    // Close modal handlers
    closeModal.addEventListener('click', function() {
        paymentModal.classList.remove('active');
    });
    
    closeCodeModal.addEventListener('click', function() {
        codeModal.classList.remove('active');
    });
    
    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
    
    // Phone number validation
    const validatePhone = (phone) => {
        return phone.match(/^07[0-9]{8}$/);
    };
    
    // Show notification
    function showNotification(message, type = 'success') {
        notification.className = 'notification';
        notification.classList.add(type, 'show');
        notificationMessage.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }
    
    // Close notification
    closeNotification.addEventListener('click', function() {
        notification.classList.remove('show');
    });
    
    // Generate random 6-digit access code
    function generateAccessCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
    
    // STK Payment handler
    confirmStkPayment.addEventListener('click', async function() {
        const phone = document.getElementById('modalPhone').value;
        
        // Validate phone number
        if (!validatePhone(phone)) {
            showNotification('Please enter a valid 10-digit Safaricom number starting with 07', 'error');
            return;
        }
        
        // Show loading state
        confirmStkPayment.disabled = true;
        stkSpinner.style.display = 'inline-block';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Generate access code
            const accessCode = generateAccessCode();
            
            // Show success
            showNotification(`STK push sent to ${phone}. Please complete payment on your phone.`);
            
            // Show access code in modal
            accessCodeDisplay.textContent = accessCode;
            accessCodeInput.value = accessCode; // Auto-fill verification input
            
            // Switch to code modal
            paymentModal.classList.remove('active');
            codeModal.classList.add('active');
        } catch (error) {
            console.error('Error:', error);
            showNotification('Failed to send payment request. Please try again.', 'error');
        } finally {
            // Reset button state
            confirmStkPayment.disabled = false;
            stkSpinner.style.display = 'none';
        }
    });
    
    // Paybill handler
    confirmPaybill.addEventListener('click', async function() {
        const phone = document.getElementById('paybillPhone').value;
        
        // Validate phone number
        if (!validatePhone(phone)) {
            showNotification('Please enter a valid 10-digit number starting with 07', 'error');
            return;
        }
        
        // Show loading state
        confirmPaybill.disabled = true;
        paybillSpinner.style.display = 'inline-block';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Generate access code
            const accessCode = generateAccessCode();
            
            // Show access code
            accessCodeDisplay.textContent = accessCode;
            accessCodeInput.value = accessCode; // Auto-fill verification input
            
            // Switch to code modal
            paymentModal.classList.remove('active');
            codeModal.classList.add('active');
        } catch (error) {
            console.error('Error:', error);
            showNotification('Failed to generate paybill details. Please try again.', 'error');
        } finally {
            // Reset button state
            confirmPaybill.disabled = false;
            paybillSpinner.style.display = 'none';
        }
    });
    
    // Connect to WiFi handler
    connectBtn.addEventListener('click', async function() {
        const accessCode = accessCodeDisplay.textContent;
        
        // Show loading state
        connectBtn.disabled = true;
        connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        
        try {
            // Simulate connection process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success
            showNotification('WiFi access granted! You can now browse freely.', 'success');
            
            // Close modal after delay
            setTimeout(() => {
                codeModal.classList.remove('active');
                connectBtn.disabled = false;
                connectBtn.innerHTML = '<i class="fas fa-wifi"></i> Connect to WiFi Now';
            }, 1500);
        } catch (error) {
            console.error('Error:', error);
            showNotification('Connection failed. Please check your network.', 'error');
            connectBtn.disabled = false;
            connectBtn.innerHTML = '<i class="fas fa-wifi"></i> Connect to WiFi Now';
        }
    });
    
    // Verify access code handler
    verifyCodeBtn.addEventListener('click', async function() {
        const code = accessCodeInput.value.trim();
        
        if (!code || code.length !== 6) {
            showNotification('Please enter a valid 6-digit access code', 'error');
            return;
        }
        
        // Show loading state
        verifyCodeBtn.disabled = true;
        verifyCodeBtn.innerHTML = 'Verifying... <div class="spinner"></div>';
        
        try {
            // Simulate verification
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success
            showNotification('Access code verified! Reconnecting to WiFi...', 'success');
            
            // Reset button
            verifyCodeBtn.disabled = false;
            verifyCodeBtn.innerHTML = 'Connect';
            
            // Clear input
            accessCodeInput.value = '';
            
            // Simulate reconnection
            setTimeout(() => {
                showNotification('Successfully reconnected to WiFi!', 'success');
            }, 1000);
        } catch (error) {
            console.error('Error:', error);
            showNotification('Invalid access code. Please try again.', 'error');
            verifyCodeBtn.disabled = false;
            verifyCodeBtn.innerHTML = 'Connect';
        }
    });
    
    // Close modal when clicking outside
    paymentModal.addEventListener('click', function(e) {
        if (e.target === paymentModal) {
            paymentModal.classList.remove('active');
        }
    });
    
    codeModal.addEventListener('click', function(e) {
        if (e.target === codeModal) {
            codeModal.classList.remove('active');
        }
    });
    
    // Auto-advance input for access code
    accessCodeInput.addEventListener('input', function() {
        if (this.value.length === 6) {
            verifyCodeBtn.focus();
        }
    });
    
    // Enter key for verification
    accessCodeInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            verifyCodeBtn.click();
        }
    });
});