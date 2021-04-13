let geo = document.querySelector("[itemprop='geo']");
let lat = document.querySelector("[itemprop='latitude']");
let lon = document.querySelector("[itemprop='longitude']");
let btn = document.createElement('button');
// btn.onclick = () => { open(`http://www.google.com/maps/place/${lat.textContent},${lon.textContent}`) };
btn.onclick = () => { open(` http://maps.google.de/maps?q=${lat.textContent},${lon.textContent}&t=k&z=19`) };
btn.textContent = 'Open in Google Maps';
btn.className = 'fp4n';
geo.appendChild(btn);