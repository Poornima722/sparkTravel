// ========================================================
// 🌟 SPARK TRAVELS - BULLETPROOF SAVED ITINERARY LOGIC 🌟
// ========================================================

document.addEventListener("DOMContentLoaded", () => {
    const saveBtn = document.getElementById("save-favorite-btn");
    const statusMsg = document.getElementById("save-status-msg");

    if (!saveBtn) return; 

    // 🛡️ Add a guard flag to prevent multiple parallel background triggers
    let isSaving = false;

    saveBtn.addEventListener("click", async () => {
        // If we are already working on a save request, block any incoming clicks!
        if (isSaving) return; 

        const savedUserRaw = localStorage.getItem('sparkUser');
        if (!savedUserRaw) {
            statusMsg.innerText = "No account found! Please login or create an account to save favorites.";
            statusMsg.style.color = "red";
            return;
        }

        const savedUser = JSON.parse(savedUserRaw);
        const userEmail = savedUser.email;

        if (!userEmail || !savedUser.loggedIn) {
            statusMsg.innerText = "No account found! Please login or create an account to save favorites.";
            statusMsg.style.color = "red";
            return;
        }

        // 🛑 GATEKEEPER VALIDATION: Prevent saving blank layouts
        const destInputRaw = document.getElementById("dest-loc")?.value.trim() || "";
        const totalEstimateRaw = document.getElementById("total-estimate")?.innerText || "₹0";
        const finalBudgetNum = parseInt(totalEstimateRaw.replace(/[^0-9]/g, '')) || 0;

        if (!destInputRaw || finalBudgetNum === 0) {
            statusMsg.innerText = "⚠️ Please enter a destination and estimate your budget before saving!";
            statusMsg.style.color = "orange";
            return; 
        }

        const startLoc = document.getElementById("start-loc")?.value.trim() || "Current Location";
        const travelersCount = parseInt(document.getElementById("travelers")?.value) || 1;
        const tripDaysCount = parseInt(document.getElementById("trip-days")?.value) || 1;
        
        const styleSelect = document.getElementById("travel-style");
        const selectedStyleText = styleSelect ? styleSelect.options[styleSelect.selectedIndex].text : "Standard";
        const distanceVal = document.getElementById("distance-display")?.innerText || "Calculated Route";

        const tripLogData = {
            email: userEmail,
            sourceName: startLoc,
            destinationName: destInputRaw,
            distanceText: distanceVal, 
            numberOfDays: tripDaysCount,
            numberOfTravelers: travelersCount,
            budgetStyle: selectedStyleText,
            calculatedBudget: finalBudgetNum
        };

        // 🚀 ACTIVATE LOCK: Lock the gate before making the network call!
        isSaving = true;
        saveBtn.disabled = true; // Visually disable it if it's an HTML button element

        try {
            statusMsg.innerText = "Saving your custom itinerary...";
            statusMsg.style.color = "#ff9f43";

            const response = await fetch('http://127.0.0.1:3000/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tripLogData)
            });

            const result = await response.json();

            if (result.success) {
                statusMsg.innerText = `❤️ Trip itinerary to ${destInputRaw} permanently saved!`;
                statusMsg.style.color = "green";
            } else {
                statusMsg.innerText = "⚠️ " + result.message;
                statusMsg.style.color = "orange";
            }
        } catch (err) {
            console.error("Transmission breakdown:", err);
            statusMsg.innerText = "Network link down. Is your Node backend terminal running?";
            statusMsg.style.color = "red";
        } finally {
            // 🔓 RELEASE LOCK: Open the gate back up after the server replies completely
            isSaving = false;
            saveBtn.disabled = false;
        }
    });
});