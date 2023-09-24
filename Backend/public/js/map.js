// Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key
const GOOGLE_MAPS_API_KEY = "AIzaSyCnVwSqPZDCHCmykGd_wW7iN2rjz_8ElEA";

// Initialize the Google Map
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 42.707741, lng: -71.157895 }, // Set the initial map center
    zoom: 9, // Set the initial zoom level
  });

  // Fetch store locations from your API endpoint (replace with your actual URL)
  fetch("/api/v1/stores")
    .then((response) => response.json())
    .then((data) => {
      const stores = data.data;
      stores.forEach((store) => {
        const { latitude, longitude, storeId } = store.location;
        addStoreMarker(
          map,
          parseFloat(latitude),
          parseFloat(longitude),
          storeId
        );
      });
    })
    .catch((error) => {
      console.error("Error fetching store locations:", error);
    });
}

// Add a marker for a store location
function addStoreMarker(map, lat, lng, storeId) {
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: map,
    title: storeId,
  });

  // Add a click event listener to the marker to show store details or perform other actions.
  marker.addListener("click", function () {
    // Handle marker click event here
    alert(`Store ID: ${storeId}`);
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
