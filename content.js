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

let controlBar = document.createElement('div');
controlBar.className = 'control-bar';
m.appendChild(controlBar);

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

let btn = document.createElement('button');
// get current coordinates
let lat = findGetParameter('lat');
let lon = findGetParameter('lng');
let zoom = findGetParameter('z');
btn.onclick = () => showFullMap(lat, lon, zoom);
btn.textContent = 'Show map with rating';
btn.style.float = 'right';
btn.className = 'ip4n';
let content = document.getElementsByClassName('container').item(3);
content.children[0].style.clear='both';
content.insertBefore(btn, content.children[0]);
  
let showFullMap = (lat, lon, zoom) => {
    
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
        closeBtn.textContent = 'Close';
        closeBtn.onclick = () => {
            controller.abort();
            m.style.display = 'none';
            map.off();
            map.remove();
        };
        controlBar.appendChild(closeBtn);

        let placeDiv = document.createElement('div');
        
        // add search here handler
        let searchBtn = document.createElement('button');
        searchBtn.textContent = 'Search here';
        searchBtn.onclick = () => {
            //controller.abort();
            let latLng = map.getCenter();
            
            //remove places
            map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    layer.remove();
                }
            });
            //remove place type checkboxes
            placeDiv.innerHTML = '';
            
            getPlaces(latLng.lat, latLng.lng);
        };
        controlBar.appendChild(searchBtn);
        controlBar.appendChild(placeDiv);

        let placeMap = new Map();

        let displayPlaces = (data) => {
            for (let place of data) {
                if (placeMap.values().some(placeType => place.type.id === placeType.id && placeType.checked)){
                    let markerDiv = L.divIcon({
                        className: `marker_base`,
                        html: `<span class="marker_icon" style="background-image: url('/images/bitmap/icons/pins/pins_${place.type.code.toLowerCase()}@4x.png');"><div class="rating-text">${place.rating}</div></span>`,
                    });
                    let marker = L.marker([place.lat, place.lng], {icon: markerDiv}).addTo(map);
                    marker.on('click', () => {
                        open(`${baseurl}/en/place/${place.id}`);
                    })
                }
            }
        }

        let getPlaces = (lat,lon) => {
            fetch(`${baseurl}/api/places/around?lat=${lat}&lng=${lon}&radius=200&filter={}&lang=en`, { signal })
            .then(response => response.text())
            .then(text => {
                let body = atob(text);
                let data = JSON.parse(body);
                // generate map of unique place types and mark them as checked
                for (let p of data) {
                    p.type.checked = true;
                    placeMap.set(p.type.id, p.type);
                }
                displayPlaces(data);
                for (let [placeId, place] of placeMap) {
                    let label = document.createElement('label');
                    label.htmlFor = placeId;
                    label.innerHTML += `<span class="marker_icon" style="background-image: url('/images/bitmap/icons/pins/pins_${place.code.toLowerCase()}@4x.png');"></span>`;
                                    
                    let cb = document.createElement('input');
                    cb.type = 'checkbox';
                    cb.checked = true;
                    cb.name = placeId;
                    cb.addEventListener('change', (e) => {
                        // track toggle
                        placeMap.get(placeId).checked = e.target.checked;
                        console.log(placeMap);
                        //remove places
                        map.eachLayer((layer) => {
                            if (layer instanceof L.Marker) {
                                layer.remove();
                            }
                        });
                          
                        displayPlaces(data);
                    });
                    let div = document.createElement('div');
                    div.appendChild(label);
                    div.appendChild(cb);
                    placeDiv.appendChild(div);
                }
            });
        }
        getPlaces(lat, lon);

        
    } else {
        alert('Search for a place first');
    }
}
