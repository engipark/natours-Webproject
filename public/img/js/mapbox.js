/* eslint-disable */
const locations = document.getElementById('.map').dataset.locations.split(',');

location1 = locations.slice(0,locations.length/2)
location2 = locations.slice(locations.length/2,location.length)


 var c = location1.map(function(e, i) {
    return [e, location2[i]];
  });
  



mapboxgl.accessToken = 'pk.eyJ1IjoiZW5naXBhcmsiLCJhIjoiY2t5a3g2ZmY0MTZ1YjJvcW8zb2dqZnA2ciJ9.SVLN6GW7OiG3UbKAkN42_Q';



var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    scrollZoom:false
    
});


const bounds = new mapboxgl.LngLatBounds();

c.forEach(loc=>{
    // create marker
    const el = document.createElement('div');
    el.className = 'marker'


    //add marker
    new mapboxgl.Marker({
        element:el,
        anchor:'bottom'

    }).setLngLat(loc).addTo(map)

    //extend map bounts to include current location
    bounds.extend(loc);

})




map.fitBounds(bounds,{
    padding:{
        top:200,
        bottom:200,
        left:100,
        right:100


    }
   



});