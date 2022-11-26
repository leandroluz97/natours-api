/*eslint-disable */

console.log('hello from the client side');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoibGVhbmRyb2x1ejk3IiwiYSI6ImNsYXg1dnExejBqYWEzcXFteWVyeHQ0MjEifQ.UJaeXfjKlcxnDcoH-Y3knw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/leandroluz97/claxyfgdf005v14lgadcu7lvs',
  scrollZoom: false,
  //   center: [-118.113491, 34.111745],
  //   zoom: 10,
  //   interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  //Create 'div' with localization icon
  const el = document.createElement('div');
  el.className = 'marker';

  //Create marker with previous div and coordinates
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  //Add popup
  new mapboxgl.Popup({ offset: 30 })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  //Extend map bounds with current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
