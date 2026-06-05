// 1. Get the place name from the URL
const urlParams = new URLSearchParams(window.location.search);
const place = urlParams.get('place');

// Update the heading on the page
if (place) {
    document.getElementById('place-name').innerText = "Exploring " + place;
    buildRoute("Bengaluru", place); // Your home base to the searched destination!
}

// 2. Main function to fetch coordinates for both cities and draw the route
async function buildRoute(startCity, endCity) {
    try {
        // Fetch Starting Point Coordinates (Bengaluru)
        const startResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${startCity}`);
        const startData = await startResponse.json();

        // Fetch Destination Coordinates (e.g., Mysuru)
        const endResponse = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${endCity}`);
        const endData = await endResponse.json();

        if (startData.length > 0 && endData.length > 0) {
            const startLat = parseFloat(startData[0].lat);
            const startLon = parseFloat(startData[0].lon);
            const destLat = parseFloat(endData[0].lat);
            const destLon = parseFloat(endData[0].lon);

            // Initialize the Map centered on your starting location
            const map = L.map('map').setView([startLat, startLon], 8);

            // Add the map graphics (Tiles)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap'
            }).addTo(map);

            // 3. DRAW THE ROAD ROUTE
            L.Routing.control({
                waypoints: [
                    L.latLng(startLat, startLon), // Start position (Bengaluru)
                    L.latLng(destLat, destLon)    // End position (Destination)
                ],
                routeWhileDragging: false,
                addWaypoints: false
            }).addTo(map);

            document.getElementById('place-description').innerText = 
                `Showing the complete driving route from ${startCity} to ${endCity}! Check the map panel for step-by-step guidance and total distance.`;

        } else {
            document.getElementById('place-description').innerText = "Could not map the route. One of the locations was not found.";
        }
    } catch (error) {
        console.error("Error setting up the route:", error);
    }
}