/**
 * Haversine Formula: Calculates the great-circle distance between two points 
 * on the surface of a sphere given their latitude and longitude.
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
              
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

/**
 * Main function to dynamically fetch coordinates, 
 * compute distance, and calculate the overall trip budget.
 */
async function calculateTripBudget() {
    // 1. Grab all UI input elements from index.html
    const startInput = document.getElementById('start-loc');
    const destInput = document.getElementById('dest-loc');
    const travelersInput = document.getElementById('travelers');
    const styleSelect = document.getElementById('travel-style');
    const resultDisplay = document.getElementById('total-estimate');

    const startCity = startInput.value.trim();
    const endCity = destInput.value.trim();
    const numTravelers = parseInt(travelersInput.value) || 1;
    const styleMultiplier = parseFloat(styleSelect.value) || 1;

    // Validation: Ensure the user typed locations before running API tasks
    if (!startCity || !endCity) {
        alert("Please enter both a starting city and a destination!");
        return;
    }

    // Update UI status text while the background fetch is processing
    resultDisplay.innerText = "Calculating...";

    try {
        // 2. Fetch Starting City Coordinates from Nominatim API
        const startResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(startCity)}`);
        const startData = await startResponse.json();

        // 3. Fetch Destination City Coordinates from Nominatim API
        const endResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endCity)}`);
        const endData = await endResponse.json();

        if (startData.length > 0 && endData.length > 0) {
            // Extract numerical float variables from API payloads
            const lat1 = parseFloat(startData[0].lat);
            const lon1 = parseFloat(startData[0].lon);
            const lat2 = parseFloat(endData[0].lat);
            const lon2 = parseFloat(endData[0].lon);

            // 4. Compute True Distance + add a 30% buffer for realistic road-turn constraints
            let distanceKM = calculateHaversineDistance(lat1, lon1, lat2, lon2);
            distanceKM = distanceKM * 1.3; 

            // 5. Travel Budget Matrix Math
            const transitCostPerKM = 7;     // Base fuel/toll/transit cost metric per KM
            const lodgingCostPerPerson = 2000; // Standard baseline hotel accommodation expense

            // Shared vehicular distribution factor (assuming groups of up to 4 split vehicle baseline costs)
            const vehicleCount = Math.ceil(numTravelers / 4); 
            
            const totalTransit = distanceKM * transitCostPerKM * vehicleCount;
            const totalLodging = lodgingCostPerPerson * numTravelers * styleMultiplier;
            
            // Grand Total (rounded neatly to integer value)
            const finalCalculatedBudget = Math.round(totalTransit + totalLodging);

            // 6. Push final output to the user display element with regional currency separation
            resultDisplay.innerText = "₹" + finalCalculatedBudget.toLocaleString('en-IN');

        } else {
            resultDisplay.innerText = "Error";
            alert("Could not locate one or both cities. Please verify your spelling!");
        }
    } catch (error) {
        console.error("Budget Planner Core Error:", error);
        resultDisplay.innerText = "Error";
    }
}
