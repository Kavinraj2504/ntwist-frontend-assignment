document.addEventListener('DOMContentLoaded', function() {
    const submissionsList = document.getElementById('submissionsList');
    const sortButton = document.getElementById('sortButton');
    let isSorted = false;

    // Display submissions
    displaySubmissions();

    // Sort button functionality
    sortButton.addEventListener('click', function() {
        isSorted = !isSorted;
        sortButton.textContent = isSorted ? 'Sort Alphabetically (Z-A)' : 'Sort Alphabetically (A-Z)';
        displaySubmissions();
    });

    function displaySubmissions() {
        // Get submissions from local storage
        const submissions = JSON.parse(localStorage.getItem('feedbackSubmissions')) || [];

        // Add hardcoded example if empty
        if (submissions.length === 0) {
            const exampleSubmissions = [
                {
                    name: "John Doe",
                    email: "john@example.com",
                    message: "This is a sample feedback message.",
                    rating: 4,
                    timeSpent: 45,
                    timestamp: "2023-05-01T10:30:00Z"
                },
                {
                    name: "Jane Smith",
                    email: "jane@example.com",
                    message: "Another example feedback entry.",
                    rating: 5,
                    timeSpent: 60,
                    timestamp: "2023-05-02T14:15:00Z"
                }
            ];
            localStorage.setItem('feedbackSubmissions', JSON.stringify(exampleSubmissions));
            displaySubmissions();
            return;
        }

        // Sort if needed
        const submissionsToDisplay = [...submissions];
        if (isSorted) {
            submissionsToDisplay.sort((a, b) => b.name.localeCompare(a.name));
        } else {
            submissionsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
        }

        // Clear current list
        submissionsList.innerHTML = '';

        // Display each submission
        submissionsToDisplay.forEach((submission, index) => {
            const submissionElement = document.createElement('div');
            submissionElement.className = 'submission-item';

            // Generate a unique color based on the name
            const hue = hashCode(submission.name) % 360;
            const color = `hsl(${hue}, 70%, 90%)`;
            submissionElement.style.backgroundColor = color;
            submissionElement.style.borderLeft = `4px solid hsl(${hue}, 70%, 50%)`;

            // Format time spent
            const minutes = Math.floor(submission.timeSpent / 60);
            const seconds = submission.timeSpent % 60;
            const timeString = minutes > 0
                ? `${minutes}m ${seconds}s`
                : `${seconds}s`;

            // Format date
            const date = new Date(submission.timestamp);
            const dateString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

            // Create stars
            let stars = '';
            for (let i = 0; i < 5; i++) {
                stars += i < submission.rating ? '★' : '☆';
            }

            submissionElement.innerHTML = `
                <p class="name">${submission.name}</p>
                <p class="email">${submission.email}</p>
                <div class="rating" aria-label="Rating: ${submission.rating} out of 5">${stars}</div>
                <p class="message">${submission.message}</p>
                <p class="time">Time spent: ${timeString} | Submitted: ${dateString}</p>
            `;

            submissionsList.appendChild(submissionElement);
        });
    }

    // Helper function to generate a hash code for color generation
    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash);
    }
});