/* --- 1. SEARCH LOGIC --- */
const searchInput = document.querySelector('.input');

if (searchInput) {
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const query = searchInput.value;
            if (query.trim() !== "") {
                window.location.href = `details.html?place=${encodeURIComponent(query)}`;
            }
        }
    });
}

/* --- 2. BUDGET PLANNER LOGIC --- */
// We will add your calculation functions here next!
console.log("Spark Travels Engine Loaded...");