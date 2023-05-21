let ul = document.getElementsByClassName('place-info-location mt-5 mb-4').item(0);
let latLon = ul.children.item(0).children.item(1).children.item(0).textContent; //42.5108, 0.1249 (lat, lng)'
let lat = latLon.substring(0, latLon.indexOf(','));
let lon = latLon.substring(latLon.indexOf(',')+1, latLon.indexOf('(')).trim();
console.log(lat);
console.log(lon);
let btn = document.createElement('button');
btn.onclick = () => { open(` https://www.google.de/maps?q=${lat},${lon}&t=k&z=19`) };
btn.textContent = 'Open in Google Maps';
btn.className = 'ip4n';
ul.insertBefore(btn, ul.children.item(1));