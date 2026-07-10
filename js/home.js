const API = "https://ngo-event-management-backend-production.up.railway.app/api";

async function loadStats() {
    try {
        const response = await fetch(`${API}/dashboard`);
        const stats = await response.json();

        document.getElementById("statVolunteers").textContent = stats.volunteers || 0;
        document.getElementById("statEvents").textContent = stats.events || 0;
        document.getElementById("statDonations").textContent = stats.donations || 0;
        document.getElementById("statCampaigns").textContent = stats.campaigns || 0;
    } catch (error) {
        console.error("Stats load failed:", error);
    }
}

async function loadHomeEvents() {
    try {
        const response = await fetch(`${API}/events`);
        const events = await response.json();
        const container = document.getElementById("homeEventContainer");
        container.innerHTML = "";

        const featured = events.slice(0, 3);

        if (featured.length === 0) {
            container.innerHTML = `<div class="col-12 text-center text-muted py-4">No upcoming events yet. Check back soon!</div>`;
            return;
        }

        featured.forEach(event => {
            container.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card home-card h-100 border-0">
                        <div class="card-body">
                            <span class="badge bg-success mb-2">${event.category || "Event"}</span>
                            <h5>${event.title}</h5>
                            <p class="text-muted small">${event.description?.substring(0, 80) || ""}...</p>
                            <p class="mb-1"><i class="bi bi-calendar3 me-1"></i> ${event.eventDate}</p>
                            <p class="mb-3"><i class="bi bi-geo-alt me-1"></i> ${event.location}</p>
                            <a href="events.html" class="btn btn-success btn-sm w-100">View Details</a>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Events load failed:", error);
    }
}

async function loadHomeCampaigns() {
    try {
        const response = await fetch(`${API}/campaigns`);
        const campaigns = await response.json();
        const container = document.getElementById("homeCampaignContainer");
        container.innerHTML = "";

        const featured = campaigns.slice(0, 3);

        if (featured.length === 0) {
            container.innerHTML = `<div class="col-12 text-center text-muted py-4">No active campaigns right now.</div>`;
            return;
        }

        featured.forEach(campaign => {
            const percentage = Math.round((campaign.raisedAmount / campaign.goalAmount) * 100) || 0;

            container.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card home-card h-100 border-0">
                        <img src="${campaign.imageUrl}" class="card-img-top" style="height:180px; object-fit:cover;" alt="${campaign.title}">
                        <div class="card-body">
                            <h5>${campaign.title}</h5>
                            <p class="text-muted small">${campaign.description?.substring(0, 70) || ""}...</p>
                            <div class="progress mb-2" style="height:8px;">
                                <div class="progress-bar bg-success" style="width:${percentage}%"></div>
                            </div>
                            <small class="text-muted">Raised ₹${campaign.raisedAmount} of ₹${campaign.goalAmount}</small>
                            <a href="campaigns.html" class="btn btn-success btn-sm w-100 mt-3">Donate</a>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Campaigns load failed:", error);
    }
}

async function loadHomeGallery() {
    try {
        const response = await fetch(`${API}/gallery`);
        const images = await response.json();
        const container = document.getElementById("homeGalleryContainer");
        container.innerHTML = "";

        const featured = images.slice(0, 3);

        if (featured.length === 0) {
            container.innerHTML = `<div class="col-12 text-center text-muted py-4">Gallery coming soon!</div>`;
            return;
        }

        featured.forEach(image => {
            container.innerHTML += `
                <div class="col-md-4 mb-4">
                    <div class="card home-card border-0">
                        <img src="${image.imageUrl}" class="card-img-top" style="height:200px; object-fit:cover;" alt="${image.title}">
                        <div class="card-body py-2">
                            <h6 class="mb-0">${image.title}</h6>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Gallery load failed:", error);
    }
}

loadStats();
loadHomeEvents();
loadHomeCampaigns();
loadHomeGallery();
