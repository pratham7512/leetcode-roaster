document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const roastButtons = document.querySelectorAll('.roast-btn');
    const resultDiv = document.getElementById('result');
    const roastText = document.getElementById('roast-text');

    roastButtons.forEach(button => {
        button.addEventListener('click', () => {
            const username = usernameInput.value.trim();
            const intensity = button.dataset.intensity;

            if (username) {
                fetchRoast(username, intensity);
            } else {
                alert('Please enter a LeetCode username');
            }
        });
    });

    async function fetchRoast(username, intensity) {
        try {
            const response = await fetch(`/roast/?username=${username}&intensity=${intensity}`);
            const data = await response.json();
            console.log(data.roast);
            if (data.roast) {
                resultDiv.classList.remove('hidden');
                roastText.textContent = data.roast;
            } else {
                throw new Error('Failed to generate roast');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate roast. Please try again.');
        }
    }
});
