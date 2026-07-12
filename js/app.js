const registerForm = document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener("submit", async function(e){

        e.preventDefault();

        const form = e.target;
        const btn = document.getElementById("registerBtn");
        const messageDiv = document.getElementById("message");

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const user = {
            fullName: document.getElementById("fullName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            password: document.getElementById("password").value,
            address: document.getElementById("address").value,
            role: "USER"
        };

        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Creating Account...';

        try{
            const response = await fetch(
                "https://ngo-event-management-backend.onrender.com/api/users",
                {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify(user)
                }
            );

            if(response.ok){
                messageDiv.innerHTML = "<span class='text-success'>Registration Successful! Redirecting to login...</span>";
                registerForm.reset();
                form.classList.remove('was-validated');
                
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            }
            else{
                const errorData = await response.json();
                messageDiv.innerHTML = `<span class='text-danger'>${errorData.message || 'Registration Failed!'}</span>`;
            }
        }catch(error){
            console.error("Registration error:", error);
            messageDiv.innerHTML = "<span class='text-danger'>Server Error. Please try again later.</span>";
        }finally{
            btn.disabled = false;
            btn.innerHTML = '<i class="bi bi-person-plus me-2"></i>Create Account';
        }

    });

}