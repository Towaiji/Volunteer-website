async function initMap() {
    const map = L.map('map').setView([43.6532, -79.3832], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    try {
        const response = await fetch('opportunities.json');
        const data = await response.json();
        data.forEach(op => {
            if (op.latitude && op.longitude) {
                const marker = L.marker([op.latitude, op.longitude]).addTo(map);
                marker.bindPopup(`<a href="${op.link}" target="_blank">${op.title}</a><br>${op.location}`);
            }
        });
    } catch(err) {
        console.error('Failed to load opportunities', err);
    }
}

window.addEventListener('load', initMap);
