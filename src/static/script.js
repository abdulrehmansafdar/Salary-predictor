// Salary prediction form validation and enhancement
document.addEventListener('DOMContentLoaded', function() {
    // Add input animation
    const experienceInput = document.getElementById('years_experience');
    if (experienceInput) {
        // Focus on the input field when page loads
        setTimeout(() => {
            experienceInput.focus();
        }, 1000);
        
        // Add input animation
        experienceInput.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                this.classList.add('has-value');
            } else {
                this.classList.remove('has-value');
            }
        });
    }
    
    // Get the form element if it exists on the page
    const predictionForm = document.getElementById('prediction-form');
    
    if (predictionForm) {
        // Add form submission handling with validation
        predictionForm.addEventListener('submit', function(e) {
            const experienceInput = document.getElementById('years_experience');
            const experience = parseFloat(experienceInput.value);
            
            // Basic validation
            if (isNaN(experience) || experience < 0) {
                e.preventDefault(); // Prevent form submission
                showError('Please enter a valid positive number for years of experience.');
                experienceInput.classList.add('input-error');
                return false;
            }
            
            if (experience > 50) {
                e.preventDefault();
                showError('Please enter a value less than or equal to 50 years.');
                experienceInput.classList.add('input-error');
                return false;
            }
            
            // Show loading state with animation
            const submitButton = document.querySelector('.predict-btn');
            submitButton.innerHTML = 'Predicting <span class="spinner"></span>';
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            
            // Add a subtle page fade-out effect
            document.body.classList.add('submitting');
            
            // Allow form submission to continue
            return true;
        });
    }
    
    // Function to display error messages with animation
    function showError(message) {
        // Look for existing error container or create one
        let errorContainer = document.querySelector('.error-message');
        
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'error-message';
            predictionForm.appendChild(errorContainer);
        }
        
        // Set error message with icon
        errorContainer.innerHTML = `<p><i class="fas fa-exclamation-circle"></i> ${message}</p>`;
        errorContainer.style.display = 'block';
        
        // Add animation class
        errorContainer.classList.add('animate-error');
        
        // Auto-hide error after 5 seconds
        setTimeout(() => {
            errorContainer.style.opacity = '0';
            setTimeout(() => {
                errorContainer.style.display = 'none';
                errorContainer.style.opacity = '1';
                errorContainer.classList.remove('animate-error');
            }, 500);
        }, 5000);
    }
    
    // Add copy button for salary prediction result if on results page
    const resultValue = document.querySelector('.predicted-value');
    if (resultValue) {
        // Create copy button with icon
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> <span>Copy</span>';
        copyBtn.title = 'Copy salary to clipboard';
        
        // Insert after result value
        resultValue.parentNode.insertBefore(copyBtn, resultValue.nextSibling);
        
        // Add click handler for copy button
        copyBtn.addEventListener('click', function() {
            // Get text without any currency symbols or commas
            const salaryText = resultValue.innerText.replace(/[$,]/g, '');
            
            // Copy to clipboard
            navigator.clipboard.writeText(salaryText).then(function() {
                copyBtn.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> <span>Copy</span>';
                }, 2000);
            }).catch(function(err) {
                console.error('Failed to copy: ', err);
                copyBtn.innerHTML = '<i class="fas fa-times"></i> <span>Failed</span>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i> <span>Copy</span>';
                }, 2000);
            });
        });
    }
    
    // Add animation to Gemini insights section if present
    const geminiContent = document.querySelector('.gemini-content');
    if (geminiContent) {
        // Add fade-in class for animation
        setTimeout(() => {
            geminiContent.classList.add('fade-in');
        }, 300);
        
        // If content has headings, add additional animations
        const headings = geminiContent.querySelectorAll('h3');
        if (headings.length > 0) {
            headings.forEach((heading, index) => {
                heading.style.opacity = '0';
                heading.style.transform = 'translateY(15px)';
                setTimeout(() => {
                    heading.style.transition = 'all 0.5s ease';
                    heading.style.opacity = '1';
                    heading.style.transform = 'translateY(0)';
                }, 500 + (index * 200));
            });
        }
    }
    
    // Add smooth scrolling for better UX
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});