// ========================================================
// 🌟 SPARK TRAVELS - VIEW SAVED SPARKS LOGIC (DASHBOARD) 🌟
// ========================================================

document.addEventListener("DOMContentLoaded", async () => {
    const gridContainer = document.getElementById("favorites-grid");
    const emptyStateMsg = document.getElementById("no-favorites-msg");

    // 1. Peer inside local storage for an active session
    const savedUserRaw = localStorage.getItem('sparkUser');
    
    if (!savedUserRaw) {
        showLoggedOutState(emptyStateMsg, gridContainer);
        return;
    }

    const savedUser = JSON.parse(savedUserRaw);
    const userEmail = savedUser.email;

    if (!userEmail || !savedUser.loggedIn) {
        showLoggedOutState(emptyStateMsg, gridContainer);
        return;
    }

    // 2. FETCH THE ITINERARIES FROM OUR NODE BACKEND EXPRESS BRIDGE
    try {
        // Appending the email as a query parameter string matching server.js setup
        const response = await fetch(`http://127.0.0.1:3000/api/favorites?email=${encodeURIComponent(userEmail)}`);
        const result = await response.json();

        if (result.success && result.favorites && result.favorites.length > 0) {
            // 🎉 We have itineraries! Hide the empty message box and map cards out
            emptyStateMsg.style.display = "none";
            gridContainer.innerHTML = ""; // Wipe any stale placeholders

            result.favorites.forEach(trip => {
                const cardHTML = `
                    <div class="trip-card">
                        <div>
                            <div class="card-route">
                                📍 ${trip.sourceName} ➡️ ${trip.destinationName}
                            </div>
                            <div class="card-details">
                                <span>📏 <strong>Distance:</strong> ${trip.distanceText}</span>
                                <span>⏳ <strong>Duration:</strong> ${trip.numberOfDays} Days</span>
                                <span>👥 <strong>Travelers:</strong> ${trip.numberOfTravelers} Person(s)</span>
                                <span>✨ <strong>Vibe Style:</strong> ${trip.budgetStyle}</span>
                            </div>
                        </div>
                        <div class="card-budget-badge">
                            💰 Estimated Total: <em>₹${trip.calculatedBudget.toLocaleString('en-IN')}</em>
                        </div>
                    </div>
                `;
                gridContainer.innerHTML += cardHTML;
            });

        } else {
            // No favorites array found or it's completely empty
            emptyStateMsg.style.display = "block";
        }

    } catch (err) {
        console.error("Dashboard connection error:", err);
        gridContainer.innerHTML = `
            <div style="color: #ff9f43; text-align: center; padding: 40px; border: 1px solid #ff9f43; border-radius: 8px; background: rgba(255,159,67,0.1);">
                <h3>⚠️ Network Communication Breakdown</h3>
                <p style="margin-top: 10px; color: #ffffff;">Unable to stream your favorites dataset. Check that your Node API server terminal is active on port 3000.</p>
            </div>
        `;
    }
});

// Helper function to handle unauthorized guest visitors
function showLoggedOutState(emptyBox, gridBox) {
    gridBox.innerHTML = "";
    emptyBox.style.display = "block";
    emptyBox.querySelector("h2").innerText = "Access Restricted";
    emptyBox.querySelector("p").innerText = "Please log in or create an account from the homepage to view your personal trip logs dashboard.";
    const btn = emptyBox.querySelector(".explore-now-btn");
    if(btn) {
        btn.innerText = "Back to Login";
        btn.href = "index.html";
    }
}