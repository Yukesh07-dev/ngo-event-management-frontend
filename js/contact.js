const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", async function(e){
        e.preventDefault();

        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const contact = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            subject: document.getElementById("subject").value,
            message: document.getElementById("message").value
        };

        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Sending...';

        try {
            const response = await fetch(
                "http://localhost:8080/api/contact",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify(contact)
                }
            );

            if (response.ok) {
                alert("Message Sent Successfully");
                form.reset();
                form.classList.remove('was-validated');
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to send message. Please try again.");
            }
        } catch (error) {
            console.error("Error sending contact form:", error);
            alert("Server Error. Please try again later.");
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}