
fetch("https://ngo-event-management-backend.onrender.com/api/users")
.then(response => response.json())
.then(data => {

    const usersCount =
        document.getElementById("usersCount");

    if (usersCount) {
        usersCount.innerText = data.length;
    }

});

fetch("https://ngo-event-management-backend.onrender.com/api/volunteers")
.then(response => response.json())
.then(data => {

    const volunteersCount =
        document.getElementById("volunteersCount");

    if (volunteersCount) {
        volunteersCount.innerText = data.length;
    }

});

fetch("https://ngo-event-management-backend.onrender.com/api/events")
.then(response => response.json())
.then(data => {

    const eventsCount =
        document.getElementById("eventsCount");

    if (eventsCount) {
        eventsCount.innerText = data.length;
    }

});

fetch("https://ngo-event-management-backend.onrender.com/api/donations")
.then(response => response.json())
.then(data => {

    let total = 0;

    data.forEach(donation => {
        total += Number(donation.amount);
    });

    const donationAmount =
        document.getElementById("donationAmount");

    if (donationAmount) {
        donationAmount.innerText = "₹ " + total;
    }

});


loadDashboardStats();
loadUsers();
loadVolunteers();
loadEvents();
loadMessages();
loadGallery();



async function loadUsers() {

    const response =
        await fetch("https://ngo-event-management-backend.onrender.com/api/users");

    const users =
        await response.json();

    const tbody =
        document.querySelector("#userTable tbody");

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

}


async function loadVolunteers() {

    const response =
        await fetch("https://ngo-event-management-backend.onrender.com/api/volunteers");

    const volunteers =
        await response.json();

    const tbody =
        document.querySelector("#volunteerTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    volunteers.forEach(volunteer => {

        tbody.innerHTML += `
            <tr>
                <td>${volunteer.volunteerId}</td>
                <td>${volunteer.fullName}</td>
                <td>${volunteer.email}</td>
                <td>${volunteer.skills}</td>
            </tr>
        `;

    });

}



async function loadEvents() {

    const response =
        await fetch("https://ngo-event-management-backend.onrender.com/api/events");

    const events =
        await response.json();

    const tbody =
        document.querySelector("#eventTable tbody");

    if (!tbody) return;

    tbody.innerHTML = "";

    events.forEach(event => {

        tbody.innerHTML += `
            <tr>
                <td>${event.eventId}</td>
                <td>${event.title}</td>
                <td>${event.eventDate}</td>
                <td>

<button
class="btn btn-danger btn-sm"
onclick="deleteEvent(${event.eventId})">

Delete

</button>

<button
class="btn btn-primary btn-sm"
onclick="viewParticipants(${event.eventId})">

Participants

</button>

</td>
            </tr>
        `;

    });

}



async function deleteEvent(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this event?");

    if (!confirmDelete) {
        return;
    }

    await fetch(
        `https://ngo-event-management-backend.onrender.com/api/events/${id}`,
        {
            method: "DELETE"
        }
    );

    loadEvents();
}

const eventForm =
    document.getElementById("eventForm");

if(eventForm){

    eventForm.addEventListener(
        "submit",
        async function(e){

            console.log("FORM SUBMITTED");
            e.preventDefault();

            const event = {

                title:
                document.getElementById("title").value,

                description:
                document.getElementById("description").value,

                eventDate:
                document.getElementById("eventDate").value,

                eventTime:
                document.getElementById("eventTime").value,

                location:
                document.getElementById("location").value,

                category:
                document.getElementById("category").value,

                maxParticipants:
                parseInt(
                    document.getElementById(
                        "maxParticipants"
                    ).value
                ),

                currentParticipants: 0,

                imageUrl:
                document.getElementById("imageUrl").value
            };

            await fetch(
                "https://ngo-event-management-backend.onrender.com/api/events",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":
                        "application/json"
                    },
                    body:
                    JSON.stringify(event)
                }
            );

            alert(
                "Event Created Successfully"
            );

            eventForm.reset();

            loadEvents();
        }
    );
}

const campaignForm =
    document.getElementById("campaignForm");

if(campaignForm){

    campaignForm.addEventListener(
        "submit",
        async function(e){

            e.preventDefault();

            const campaign = {

                title:
                document.getElementById(
                    "campaignTitle"
                ).value,

                description:
                document.getElementById(
                    "campaignDescription"
                ).value,

                goalAmount:
                parseFloat(
                    document.getElementById(
                        "goalAmount"
                    ).value
                ),

                imageUrl:
                document.getElementById(
                    "campaignImage"
                ).value,

                raisedAmount: 0
            };

            const response =
                await fetch(
                    "https://ngo-event-management-backend.onrender.com/api/campaigns",
                    {
                        method:"POST",
                        headers:{
                            "Content-Type":
                            "application/json"
                        },
                        body:
                        JSON.stringify(campaign)
                    }
                );

            if(response.ok){

                alert(
                    "Campaign Created Successfully"
                );

                campaignForm.reset();
            }
        }
    );
}
async function loadMessages(){

    const response =
        await fetch(
            "https://ngo-event-management-backend.onrender.com/api/contact"
        );

    const messages =
        await response.json();

    const tbody =
        document.querySelector(
            "#messageTable tbody"
        );

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
}

const galleryForm =
    document.getElementById("galleryForm");

if(galleryForm){

    galleryForm.addEventListener(
        "submit",
        async function(e){

            e.preventDefault();

            const image = {

                title:
                document.getElementById(
                    "galleryTitle"
                ).value,

                imageUrl:
                document.getElementById(
                    "galleryImage"
                ).value,

                description:
                document.getElementById(
                    "galleryDescription"
                ).value
            };

            const response =
                await fetch(
                    "https://ngo-event-management-backend.onrender.com/api/gallery",
                    {
                        method:"POST",
                        headers:{
                            "Content-Type":
                            "application/json"
                        },
                        body:
                        JSON.stringify(image)
                    }
                );

            if(response.ok){

               alert("Gallery Image Added");

galleryForm.reset();

loadGallery();
            }
        }
    );
}
async function loadDashboardStats(){

    const response =
        await fetch(
            "https://ngo-event-management-backend.onrender.com/api/dashboard"
        );

    const stats =
        await response.json();

    document.getElementById(
        "userCount"
    ).innerText = stats.users;

    document.getElementById(
        "volunteerCount"
    ).innerText = stats.volunteers;

    document.getElementById(
        "eventCount"
    ).innerText = stats.events;

    document.getElementById(
        "donationCount"
    ).innerText = stats.donations;

    document.getElementById(
        "campaignCount"
    ).innerText = stats.campaigns;
}

async function viewParticipants(eventId){

    const response =
        await fetch(
            `https://ngo-event-management-backend.onrender.com/api/registrations/event/${eventId}`
        );

    const participants =
        await response.json();

    const tbody =
        document.querySelector(
            "#participantTable tbody"
        );

    tbody.innerHTML = "";

    participants.forEach(participant => {

        tbody.innerHTML += `

            <tr>

                <td>
                    ${participant.userId}
                </td>

                <td>
                    ${participant.userEmail}
                </td>

            </tr>

        `;
    });
}
async function loadDashboardStats() {

    const users =
        await fetch("https://ngo-event-management-backend.onrender.com/api/users")
        .then(r => r.json());

    const volunteers =
        await fetch("https://ngo-event-management-backend.onrender.com/api/volunteers")
        .then(r => r.json());

    const events =
        await fetch("https://ngo-event-management-backend.onrender.com/api/events")
        .then(r => r.json());

    const campaigns =
        await fetch("https://ngo-event-management-backend.onrender.com/api/campaigns")
        .then(r => r.json());

    const donations =
        await fetch("https://ngo-event-management-backend.onrender.com/api/donations")
        .then(r => r.json());

    const messages =
        await fetch("https://ngo-event-management-backend.onrender.com/api/contact")
        .then(r => r.json());

    document.getElementById("totalUsers").innerText =
        users.length;

    document.getElementById("totalVolunteers").innerText =
        volunteers.length;

    document.getElementById("totalEvents").innerText =
        events.length;

    document.getElementById("totalCampaigns").innerText =
        campaigns.length;

    document.getElementById("totalMessages").innerText =
        messages.length;

    const donationTotal =
        donations.reduce(
            (sum,d)=>sum+d.amount,
            0
        );

    document.getElementById("totalDonations")
        .innerText =
        "₹" + donationTotal;
}
loadDashboardStats();

async function loadGallery(){

    const response =
        await fetch("https://ngo-event-management-backend.onrender.com/api/gallery");

    const images =
        await response.json();

    const tbody =
        document.querySelector("#galleryTable tbody");

    tbody.innerHTML = "";

    images.forEach(image=>{

        tbody.innerHTML += `

        <tr>

            <td>${image.galleryId}</td>

            <td>

                <img
                    src="${image.imageUrl}"
                    width="80"
                    class="rounded">

            </td>

            <td>${image.title}</td>

            <td>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="deleteGallery(${image.galleryId})">

                    Delete

                </button>

            </td>

        </tr>

        `;

    });

}

async function deleteGallery(id){

    if(!confirm("Delete this image?")){
        return;
    }

    await fetch(
        `https://ngo-event-management-backend.onrender.com/api/gallery/${id}`,
        {
            method:"DELETE"
        }
    );

    loadGallery();

}