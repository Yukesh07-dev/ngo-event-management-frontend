const volunteerForm = document.getElementById("volunteerForm");

if (volunteerForm) {
    volunteerForm.addEventListener("submit", async function(e){
        e.preventDefault();

        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const volunteer = {
            fullName: document.getElementById("fullName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            skills: document.getElementById("skills").value,
            availability: document.getElementById("availability").value
        };

        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Submitting...';

        try {
            const response = await fetch(
                "http://localhost:8080/api/volunteers",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify(volunteer)
                }
            );

            if (response.ok) {
                alert("Volunteer Registered Successfully!");
                form.reset();
                form.classList.remove('was-validated');
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting volunteer form:", error);
            alert("Server Error. Please try again later.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}