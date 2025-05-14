// Share functionality script
document.addEventListener('DOMContentLoaded', function() {
    const shareButton = document.getElementById('share-btn');
    
    if (shareButton) {
        // Add hover effect animation
        shareButton.addEventListener('mouseover', function() {
            this.classList.add('pulse');
        });
        
        shareButton.addEventListener('mouseout', function() {
            this.classList.remove('pulse');
        });
        
        shareButton.addEventListener('click', function() {
            // Get the prediction information
            const experience = document.querySelector('.input-summary strong').textContent;
            const salary = document.querySelector('.predicted-value').textContent;
            
            // Create share text with emoji for better visibility on social
            const shareText = `🚀 I just used the Salary Prediction tool! With ${experience} years of experience, my predicted salary is ${salary}. Try it yourself!`;
            
            // Add animation to the button when clicked
            this.classList.add('clicked');
            
            // Check if Web Share API is supported
            if (navigator.share) {
                navigator.share({
                    title: '✨ Salary Prediction Result',
                    text: shareText,
                    url: window.location.href,
                })
                .then(() => {
                    console.log('Shared successfully');
                    showShareFeedback('Shared successfully!');
                })
                .catch((error) => {
                    console.log('Error sharing:', error);
                    if (error.name !== 'AbortError') {
                        fallbackShare(shareText);
                    }
                });
            } else {
                // Fallback for browsers that don't support the Web Share API
                fallbackShare(shareText);
            }
            
            // Remove animation class after delay
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 500);
        });
        
        function fallbackShare(shareText) {
            try {
                navigator.clipboard.writeText(shareText)
                    .then(() => {
                        // Show copied notification
                        showShareFeedback('Copied to clipboard!');
                    });
            } catch (err) {
                console.error('Failed to copy text: ', err);
                
                // Create a temporary input for manual copy
                const tempInput = document.createElement('input');
                tempInput.value = shareText;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                showShareFeedback('Text ready to share!');
            }
        }
        
        function showShareFeedback(message) {
            // Create or update feedback element
            let feedback = document.querySelector('.share-feedback');
            
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.className = 'share-feedback';
                shareButton.parentNode.appendChild(feedback);
            }
            
            // Add success message with animation
            feedback.textContent = message;
            feedback.classList.add('show');
            
            // Hide feedback after delay
            setTimeout(() => {
                feedback.classList.remove('show');
            }, 2000);
        }
    }
});