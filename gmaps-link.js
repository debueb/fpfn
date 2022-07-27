let geo = document.querySelector("[itemprop='geo']");
let lat = document.querySelector("[itemprop='latitude']");
let lon = document.querySelector("[itemprop='longitude']");
let btn = document.createElement('button');
btn.onclick = () => { open(` https://www.google.de/maps?q=${lat.textContent},${lon.textContent}&t=k&z=19`) };
btn.textContent = 'Open in Google Maps';
btn.className = 'ip4n';
geo.appendChild(btn);
