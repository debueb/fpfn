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
    m.style.display = 'block';

    // get current coordinates
    let lat = findGetParameter('lat');
    let lon = findGetParameter('lng');
    let zoom = findGetParameter('zoom');
    let baseurl = `${location.protocol}//${location.host}`;
    
    // create overlay map
    let map = L.map('newMap').setView([lat, lon], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {'useCache': true}).addTo(map);

    // add close handler
    let closeBtn = document.createElement('button');
    closeBtn.style.position = 'fixed';
    closeBtn.style.top = '10px';
    closeBtn.style.right = '10px';
    closeBtn.style.zIndex = '99999';
    closeBtn.textContent = 'X';
    closeBtn.onclick = () => {
        m.style.display = 'none';
        map.off();
        map.remove();
    };
    m.appendChild(closeBtn);

    // get a list of all places
    fetch(`${baseurl}/services/V3/getLieuxAroundMeLite.php?latitude=${lat}&longitude=${lon}`)
    .then(response => response.json())
    .then(data => {
        for (let place of data.lieux) {
            // get details for every place
            fetch(`${baseurl}?page=lieu&id=${place.id}`)
            .then(response => response.text())
            .then(html => {
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, "text/html");
                let rating = doc.getElementsByClassName('rating_fg')[0].style.width;
                rating = parseInt(rating.slice(0, rating.length-2), 10); //remove 'px' and round;
                var markerDiv = L.divIcon({
                    className: `marker_base`,
                    html: `<span class="marker_icon" style="background-image: url('/www/resources/images/pins/poi_${place.code.toLowerCase()}.png');">${rating}</span>`,
                });
                let marker = L.marker([place.latitude, place.longitude], {icon: markerDiv}).addTo(map);
                marker.on('click', () => {
                    open(`${baseurl}?page=lieu&id=${place.id}`);
                })
            });
        }
    });

}
//doIt();
let btn = document.createElement('button');
btn.onclick = () => { doIt() };
btn.textContent = 'Fix this shit';
btn.style.float = 'right';
btn.style.background = 'red';
btn.style.color = 'white';
btn.style.display = 'inline-block';
let content = document.getElementById('content');
content.insertBefore(btn, content.children[0]);