async function loadMyDonations() {

    const user =
        JSON.parse(sessionStorage.getItem("user"));

    if(!user){

        alert("Please Login");

        window.location.href =
            "login.html";

        return;
    }

    const response = await fetch(
        `http://localhost:8080/api/donations/user/${user.email}`
    );

    const donations =
        await response.json();

    const container =
        document.getElementById("donationContainer");

    container.innerHTML = "";

    donations.forEach(donation => {

        container.innerHTML += `
            <div class="col-md-4 mb-4">

                <div class="card home-card border-0 h-100">

                    <div class="card-body">

                        <h5 class="fw-bold">
                            ₹${donation.amount}
                        </h5>

                        <p class="text-muted">
                            ${donation.message || "No Message"}
                        </p>

                        <p class="small text-muted mb-0">
                            ${donation.email}
                        </p>

                    </div>

                </div>

            </div>
        `;
    });
}

loadMyDonations();
