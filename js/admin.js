const API_BASE = "https://ngo-event-management-backend.onrender.com/api";

// Initialize dashboard components when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadDashboardStats();
    loadUsers();
    loadVolunteers();
    loadEvents();
    loadMessages();
    loadGallery();
});

/**
 * 1. Fetch data from active endpoints and calculate dashboard card tallies
 */
async function loadDashboardStats() {
    try {
        const [users, events, campaigns, donations, messages] = await Promise.all([
            fetch(`${API_BASE}/users`).then(r => r.ok ? r.json() : []),
            fetch(`${API_BASE}/events`).then(r => r.ok ? r.json() : []),
            fetch(`${API_BASE}/campaigns`).then(r => r.ok ? r.json() : []),
            fetch(`${API_BASE}/donations`).then(r => r.ok ? r.json() : []),
            fetch(`${API_BASE}/contact`).then(r => r.ok ? r.json() : [])
        ]);

        // Dynamically compute regular volunteers from user records matching user role type
        const volunteerList = users.filter(user => user.role === "USER");

        // Helper helper to update text inside DOM element safely if it exists
        const updateText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.innerText = value;
        };

        // Populate upper summary grid layout cards
        updateText("usersCount", users.length);
        updateText("volunteersCount", volunteerList.length);
        updateText("eventsCount", events.length);
        
        // Populate core dashboard card layout targets
        updateText("totalUsers", users.length);
        updateText("totalVolunteers", volunteerList.length);
        updateText("totalEvents", events.length);
        updateText("totalCampaigns", campaigns.length);
        updateText("totalMessages", messages.length);

        // Sum up core currency totals cleanly
        const donationTotal = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
        updateText("donationAmount", "₹ " + donationTotal);
        updateText("totalDonations", "₹" + donationTotal);

    } catch (error) {
        console.error("Error loading dashboard metrics layout stats:", error);
    }
}

/**
 * 2. Load clean system user management rosters
 */
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        if (!response.ok) throw new Error("Failed to load users data collection");
        const users = await response.json();

        const tbody = document.querySelector("#userTable tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        users.forEach(user => {
            tbody.innerHTML += `
                <tr>
                    <td>${user.userId}</td>
                    <td>${user.fullName}</td>
                    <td>${user.email}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Users table population process crashed:", error);
    }
}

/**
 * 3. Load active volunteers list filtered cleanly out from regular registered profiles
 */
async function loadVolunteers() {
    try {
        const response = await fetch(`${API_BASE}/users`);
        if (!response.ok) throw new Error("Failed to execute data handshake with users schema");
        const users = await response.json();

        const tbody = document.querySelector("#volunteerTable tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        const volunteers = users.filter(user => user.role === "USER");

        volunteers.forEach(volunteer => {
            tbody.innerHTML += `
                <tr>
                    <td>${volunteer.userId}</td>
                    <td>${volunteer.fullName}</td>
                    <td>${volunteer.email}</td>
                    <td>${volunteer.phone || "N/A"}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Volunteer listing failed to loop:", error);
    }
}

/**
 * 4. Manage System Events Panels
 */
async function loadEvents() {
    try {
        const response = await fetch(`${API_BASE}/events`);
        if (!response.ok) throw new Error("Failed to resolve dynamic event arrays");
        const events = await response.json();

        const tbody = document.querySelector("#eventTable tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        events.forEach(event => {
            tbody.innerHTML += `
                <tr>
                    <td>${event.eventId}</td>
                    <td>${event.title}</td>
                    <td>${event.eventDate}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteEvent(${event.eventId})">Delete</button>
                        <button class="btn btn-primary btn-sm" onclick="viewParticipants(${event.eventId})">Participants</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Events panel generation failed:", error);
    }
}

async function deleteEvent(id) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
        await fetch(`${API_BASE}/events/${id}`, { method: "DELETE" });
        loadEvents();
        loadDashboardStats();
    } catch (error) {
        console.error("Error context removal hook execution failure:", error);
    }
}

// Intercept new event forms registration creation
const eventForm = document.getElementById("eventForm");
if (eventForm) {
    eventForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        try {
            const event = {
                title: document.getElementById("title").value,
                description: document.getElementById("description").value,
                eventDate: document.getElementById("eventDate").value,
                eventTime: document.getElementById("eventTime").value,
                location: document.getElementById("location").value,
                category: document.getElementById("category").value,
                maxParticipants: parseInt(document.getElementById("maxParticipants").value),
                currentParticipants: 0,
                imageUrl: document.getElementById("imageUrl").value
            };

            await fetch(`${API_BASE}/events`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(event)
            });

            alert("Event Created Successfully");
            eventForm.reset();
            loadEvents();
            loadDashboardStats();
        } catch (error) {
            console.error("Failed to commit new event entry data row:", error);
        }
    });
}

/**
 * 5. Manage Fundraising Campaign Entities
 */
const campaignForm = document.getElementById("campaignForm");
if (campaignForm) {
    campaignForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        try {
            const campaign = {
                title: document.getElementById("campaignTitle").value,
                description: document.getElementById("campaignDescription").value,
                goalAmount: parseFloat(document.getElementById("goalAmount").value),
                imageUrl: document.getElementById("campaignImage").value,
                raisedAmount: 0
            };

            const response = await fetch(`${API_BASE}/campaigns`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(campaign)
            });

            if (response.ok) {
                alert("Campaign Created Successfully");
                campaignForm.reset();
                loadDashboardStats();
            }
        } catch (error) {
            console.error("Error creating new fundraising profile context row:", error);
        }
    });
}

/**
 * 6. Load Incoming Contact and Support Logs
 */
async function loadMessages() {
    try {
        const response = await fetch(`${API_BASE}/contact`);
        if (!response.ok) throw new Error("Contact database route error");
        const messages = await response.json();

        const tbody = document.querySelector("#messageTable tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        messages.forEach(message => {
            tbody.innerHTML += `
                <tr>
                    <td>${message.name}</td>
                    <td>${message.email}</td>
                    <td>${message.subject}</td>
                    <td>${message.message}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Failed loading internal feedback notification lines:", error);
    }
}

/**
 * 7. System Showcase Media Gallery Framework Action Hooks
 */
async function loadGallery() {
    try {
        const response = await fetch(`${API_BASE}/gallery`);
        if (!response.ok) throw new Error("Gallery mapping failure");
        const images = await response.json();

        const tbody = document.querySelector("#galleryTable tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        images.forEach(image => {
            // Determine the correct ID field dynamically (checking for imageId, id, or galleryId)
            const actualId = image.id || image.imageId || image.galleryId;
            
            // Diagnostic check: If it's still undefined, log the object structure to fix the key
            if (actualId === undefined) {
                console.error("Missing ID key in image object:", image);
            }

            tbody.innerHTML += `
                <tr>
                    <td>${actualId || "N/A"}</td>
                    <td>
                        <img src="${image.imageUrl}" width="80" class="rounded" alt="">
                    </td>
                    <td>${image.title}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="deleteGallery(${actualId})">Delete</button>
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Failed reading gallery array objects feed:", error);
    }
}
const galleryForm = document.getElementById("galleryForm");
if (galleryForm) {
    galleryForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        try {
            const image = {
                title: document.getElementById("galleryTitle").value,
                imageUrl: document.getElementById("galleryImage").value,
                description: document.getElementById("galleryDescription").value
            };

            const response = await fetch(`${API_BASE}/gallery`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(image)
            });

            if (response.ok) {
                alert("Gallery Image Added");
                galleryForm.reset();
                loadGallery();
            }
        } catch (error) {
            console.error("Failed uploading profile node card component element metadata:", error);
        }
    });
}

async function deleteGallery(id) {
    if (!confirm("Delete this image?")) return;
    try {
        await fetch(`${API_BASE}/gallery/${id}`, { method: "DELETE" });
        loadGallery();
    } catch (error) {
        console.error("Failed deleting media object target collection map element:", error);
    }
}

/**
 * 8. Track Specific Scheduled Events Audiences lists 
 */
async function viewParticipants(eventId) {
    try {
        const response = await fetch(`${API_BASE}/registrations/event/${eventId}`);
        if (!response.ok) throw new Error("Failed evaluating registry record lists");
        const participants = await response.json();

        const tbody = document.querySelector("#participantTable tbody");
        if (!tbody) return;
        tbody.innerHTML = "";

        participants.forEach(participant => {
            tbody.innerHTML += `
                <tr>
                    <td>${participant.userId}</td>
                    <td>${participant.userEmail}</td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Unable to list specific targeting assembly users context profiles:", error);
    }
}