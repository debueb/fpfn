let m = document.createElement('div');
m.style.position = 'fixed';
m.style.top = 0;
m.style.left = 0;
m.style.width = '100%';
m.style.height = '100vh';
m.style.zIndex = '9999';
m.style.display = 'none';
m.id = 'newMap';
document.body.appendChild(m);

let findGetParameter = (parameterName) => {
    var result = null,
    tmp = [];
    location.search
    .substr(1)
    .split("&")
    .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
    return result;
};
  
let doIt = () => {
    // get current coordinates
    let lat = findGetParameter('lat');
    let lon = findGetParameter('lng');
    let zoom = findGetParameter('z');
    let baseurl = `${location.protocol}//${location.host}`;
    
    if (!!lat) {
        m.style.display = 'block';

        // create overlay map
        let map = L.map('newMap').setView([lat, lon], zoom);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {'useCache': true}).addTo(map);

        // AbortController to kill requests when user exists view
        const controller = new AbortController();
        const signal = controller.signal;

        // add close handler
        let closeBtn = document.createElement('button');
        closeBtn.style.position = 'fixed';
        closeBtn.style.top = '10px';
        closeBtn.style.right = '10px';
        closeBtn.style.zIndex = '99999';
        closeBtn.textContent = 'X';
        closeBtn.onclick = () => {
            controller.abort();
            m.style.display = 'none';
            map.off();
            map.remove();
        };
        m.appendChild(closeBtn);

        fetch(`${baseurl}/api/places/around?lat=${lat}&lng=${lon}&radius=200&filter={}&lang=en`, { signal })
        .then(response => response.json())
        .then(data => {
            for (let place of data) {
                let markerDiv = L.divIcon({
                    className: `marker_base`,
                    html: `<span class="marker_icon" style="background-image: url('/images/bitmap/icons/pins/pins_${place.type.code.toLowerCase()}@4x.png');"><div class="rating-text">${place.rating}</div></span>`,
                });
                let marker = L.marker([place.lat, place.lng], {icon: markerDiv}).addTo(map);
                marker.on('click', () => {
                    open(`${baseurl}/en/place/${place.id}`);
                })
            }
        });
    } else {
        alert('Search for a place first');
    }
}
let btn = document.createElement('button');
btn.onclick = doIt;
btn.textContent = 'Show map with rating';
btn.style.float = 'right';
btn.className = 'ip4n';
let content = document.getElementsByClassName('container').item(3);
content.children[0].style.clear='both';
content.insertBefore(btn, content.children[0]);