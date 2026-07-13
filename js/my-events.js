const user =
    JSON.parse(sessionStorage.getItem("user"));

if(!user){

    alert("Please Login");

    window.location.href = "login.html";
}

loadRegistrations();

async function loadRegistrations(){

    const response =
        await fetch(
            `https://ngo-event-management-backend.onrender.com/api/registrations/user/${user.userId}`
        );

    const registrations =
        await response.json();

    const container =
        document.getElementById("registrationContainer");

    container.innerHTML = "";

    registrations.forEach(reg => {

        container.innerHTML += `
            <div class="col-md-4 mb-4">

                <div class="card home-card border-0 h-100">

                    <div class="card-body">

                        <h5 class="fw-bold">
                            Event ID:
                            ${reg.eventId}
                        </h5>

                        <p class="text-muted mb-0">
                            Registered Successfully
                        </p>

                    </div>

                </div>

            </div>
        `;
    });
}
