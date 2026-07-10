let allEvents = [];

async function loadEvents() {
    const container = document.getElementById("eventContainer");
    
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="text-muted mt-2">Loading events...</p>
            </div>
        `;
    }

    try {
        const response = await fetch("http://localhost:8080/api/events");
        
        if (!response.ok) {
            throw new Error('Failed to load events');
        }

        const events = await response.json();
        allEvents = events;
        renderEvents(events);

    } catch (error) {
        console.error("Error loading events:", error);
        
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-exclamation-circle text-danger" style="font-size: 3rem;"></i>
                    <p class="text-danger mt-2">Failed to load events. Please try again later.</p>
                    <button class="btn btn-success" onclick="loadEvents()">Retry</button>
                </div>
            `;
        }
    }
}

function renderEvents(events){
    const container = document.getElementById("eventContainer");

    if (!container) return;

    if (!events || events.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-calendar-x text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-2">No events available at the moment.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    events.forEach(event => {
        const today = new Date().toISOString().split("T")[0];

        const statusBadge = event.eventDate >= today
            ? `<span class="badge bg-success me-2">Upcoming</span>`
            : `<span class="badge bg-secondary me-2">Completed</span>`;

        container.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card home-card h-100 border-0">
                    <div class="card-body">
                        <h4 class="fw-bold">${event.title}</h4>
                        <p class="text-muted">${event.description}</p>
                        <p class="mb-2">
                            <i class="bi bi-calendar3 me-2 text-success"></i>
                            ${event.eventDate}
                        </p>
                        <p class="mb-2">
                            <i class="bi bi-clock me-2 text-success"></i>
                            ${event.eventTime}
                        </p>
                        <p class="mb-2">
                            <i class="bi bi-geo-alt me-2 text-success"></i>
                            ${event.location}
                        </p>
                        <p class="small text-muted mb-1">
                            Participants: ${event.currentParticipants || 0} / ${event.maxParticipants}
                        </p>
                        <p class="small text-muted">
                            Remaining: ${event.maxParticipants - (event.currentParticipants || 0)}
                        </p>
                        ${
                            event.currentParticipants >= event.maxParticipants
                            ? `<button class="btn btn-outline-danger w-100" disabled>Event Full</button>`
                            : `<button class="btn btn-success w-100" onclick="joinEvent(${event.eventId})">Join Event</button>`
                        }
                    </div>
                </div>
            </div>
        `;
    });
}

loadEvents();

const searchInput = document.getElementById("searchInput");
if (searchInput) {
    searchInput.addEventListener("keyup", function(){
        const keyword = this.value.toLowerCase();
        const filtered = allEvents.filter(event =>
            event.title.toLowerCase().includes(keyword) ||
            (event.category || "").toLowerCase().includes(keyword)
        );
        renderEvents(filtered);
    });
}

async function joinEvent(eventId) {
    const user = JSON.parse(sessionStorage.getItem("user"));

    if (!user) {
        alert("Please Login First");
        window.location.href = "login.html";
        return;
    }

    const registration = {
        userId: user.userId,
        eventId: eventId,
        userEmail: user.email
    };

    try {
        const response = await fetch(
            "http://localhost:8080/api/registrations",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(registration)
            }
        );

        const result = await response.json();

        if (result.message === "ALREADY_REGISTERED") {
            alert("You already joined this event");
        } else {
            alert("Event Joined Successfully");
            loadEvents(); // Reload events to update participant count
        }
    } catch (error) {
        console.error("Error joining event:", error);
        alert("Failed to join event. Please try again.");
    }
}