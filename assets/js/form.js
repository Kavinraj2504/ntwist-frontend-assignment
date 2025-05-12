document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    const successMessage = document.getElementById('successMessage');
    const newSubmissionBtn = document.getElementById('newSubmission');
    const timeSpentElement = document.getElementById('timeSpent');
    const stars = document.querySelectorAll('.star');
    const ratingInput = document.getElementById('rating');

    let startTime = null;
    let timerInterval = null;
    let secondsSpent = 0;

    // Track form interaction time
    form.addEventListener('focusin', function(e) {
        if (startTime === null && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
            startTime = new Date();
            timerInterval = setInterval(updateTimer, 1000);
        }
    });

    function updateTimer() {
        secondsSpent++;
        timeSpentElement.textContent = `Time spent: ${secondsSpent} second${secondsSpent !== 1 ? 's' : ''}`;
    }

    // Star rating functionality
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseInt(this.getAttribute('data-value'));
            ratingInput.value = value;

            stars.forEach((s, index) => {
                if (index < value) {
                    s.classList.add('active');
                    s.textContent = '★';
                } else {
                    s.classList.remove('active');
                    s.textContent = '☆';
                }
            });
        });
    });

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });

        // Validate form
        let isValid = true;

        // Name validation
        const name = document.getElementById('name').value.trim();
        if (name.length < 2) {
            document.getElementById('nameError').textContent = 'Name must be at least 2 characters';
            isValid = false;
        }

        // Email validation
        const email = document.getElementById('email').value.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email';
            isValid = false;
        }

        // Message validation
        const message = document.getElementById('message').value.trim();
        if (message.length < 10) {
            document.getElementById('messageError').textContent = 'Message must be at least 10 characters';
            isValid = false;
        }

        // Rating validation
        const rating = parseInt(ratingInput.value);
        if (rating < 1 || rating > 5) {
            document.getElementById('ratingError').textContent = 'Please select a rating';
            isValid = false;
        }

        if (isValid) {
            // Save to local storage
            saveSubmission(name, email, message, rating, secondsSpent);

            // Show success message
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');

            // Clear timer
            clearInterval(timerInterval);

            // Reset form after 3 seconds
            setTimeout(() => {
                resetForm();
                successMessage.classList.add('hidden');
                form.classList.remove('hidden');
            }, 3000);
        }
    });

    // New submission button
    newSubmissionBtn.addEventListener('click', function() {
        resetForm();
        form.classList.remove('hidden');
        successMessage.classList.add('hidden');
    });

    function resetForm() {
        form.reset();

        // Reset stars
        stars.forEach(star => {
            star.classList.remove('active');
            star.textContent = '☆';
        });
        ratingInput.value = '0';

        // Reset timer
        startTime = null;
        secondsSpent = 0;
        timeSpentElement.textContent = 'Time spent: 0 seconds';
    }

    function saveSubmission(name, email, message, rating, timeSpent) {
        // Get existing submissions or create empty array
        const submissions = JSON.parse(localStorage.getItem('feedbackSubmissions')) || [];

        // Add new submission
        submissions.push({
            name,
            email,
            message,
            rating,
            timeSpent,
            timestamp: new Date().toISOString()
        });

        // Save back to local storage
        localStorage.setItem('feedbackSubmissions', JSON.stringify(submissions));
    }
});