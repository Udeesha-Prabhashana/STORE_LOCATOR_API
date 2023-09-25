// Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyCnVwSqPZDCHCmykGd_wW7iN2rjz_8ElEA";

// Initialize the Google Map
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 7.8731, lng: 80.7718 }, // Centered around Sri Lanka
    zoom: 7, // Adjust the zoom level as needed
  });

  // Call the function to fetch store data and display it on the map
  getStores(map);
}


// Function to fetch store data and display it on the map
// Function to fetch store data and display it on the map
async function getStores(map) {
  try {
    console.log("fetch data");
    const res = await fetch("/api/v1/stores");
    const data = await res.json();
    console.log("fetch data" , data)

    const stores = data.data.map((store) => {
      const latitude = store.latitude || 0; // Update with the correct data field
      const longitude = store.longitude || 0; // Update with the correct data field

      // Create a marker for each store
      const marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: store.storeId,
        icon: "images/placeholder.png", // You can specify a custom icon URL
        scaledSize: new google.maps.Size(5, 5),
      });

      // Create an info window to display the latitude when the marker is clicked
      const infoWindow = new google.maps.InfoWindow({
        content: `<div>Latitude: ${latitude}</div>`,
      });

      // Attach a click event listener to the marker to open the info window
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    });
  } catch (error) {
    console.error("Error fetching store locations:", error);
  }
}


// Load map with stores
function loadMap(map, stores) {
  map.on("load", function () {
    map.addLayer({
      id: "points",
      type: "symbol",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: stores,
        },
      },
      layout: {
        "icon-image": "{icon}-15",
        "icon-size": 1.5,
        "text-field": "{storeId}",
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 0.9],
        "text-anchor": "top",
      },
    });
  });
}

// Load the Google Maps JavaScript API with your API key
function loadGoogleMapsScript() {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}

// Load the Google Maps script when the page is loaded
window.onload = loadGoogleMapsScript;
