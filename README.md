# 🌍 Spark Travels

Spark Travels is a dynamic, fully responsive frontend travel planning web application. It helps users discover prominent travel destinations, visualize direct driving routes from their home base, and instantly calculate highly dynamic trip budgets based on geographic distances and traveling styles—all powered by open-source mapping architecture.

---

## 🚀 Key Features

* **Interactive Destination Discovery:** A clean, engaging user interface displaying popular travel hotspots.
* **Dynamic Open-Source Routing:** Leverages **Leaflet.js** and the **Leaflet Routing Machine plugin** to automatically compute and display road trip driving routes and step-by-step navigation panels.
* **Geographic Budget Planner:** Rather than using static guesses, the app queries the open-source **Nominatim API** on the fly to fetch true geographical coordinates for any custom starting point and destination, calculating an intelligent budget using the **Haversine Formula**.
* **Zero Cloud Billing Dependencies:** Completely bypasses expensive proprietary mapping walls (like Google Maps API) by utilizing open-source OpenStreetMap frameworks.

---

## 🛠️ Tech Stack

* **Frontend Architecture:** HTML, CSS (Custom Grid/Flexbox layouts), Modern JavaScript (ES6+ Async/Await Fetch API)
* **Mapping Framework:** [Leaflet.js](https://leafletjs.com/) (Version 1.9.4)
* **Routing Engine:** Leaflet Routing Machine Plugin
* **Geocoding Data Source:** OpenStreetMap Nominatim API

---

## 📊 The Budget Calculation Logic

The budget planner relies on a robust engineering matrix that scales automatically based on real-world travel parameters. 

### The Mathematical Formula:
The application dynamically computes transit costs by calculating the great-circle distance between coordinates via the **Haversine Equation**, adding a 30% buffer for winding ground routes:

$$\text{Total Budget} = (\text{Distance (KM)} \times \text{Transit Rate}) \times \left\lceil \frac{\text{Travelers}}{4} \right\rceil + (\text{Base Stay Cost} \times \text{Travelers} \times \text{Style Multiplier})$$

### Multiplier Breakdown:
* **Budget (1.0x):** Backpacker-friendly lodging and baseline expenses.
* **Standard (1.5x):** Mid-range hotel accommodations and comfortable dining.
* **Luxury (3.0x):** Premium resort options and high-end travel accommodations.

---

## 💻 How to Run the Project Locally

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/spark-travels.git](https://github.com/YOUR_USERNAME/spark-travels.git)
