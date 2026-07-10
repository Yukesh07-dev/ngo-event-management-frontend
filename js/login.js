document.getElementById("loginForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const form = e.target;
    const btn = document.getElementById("loginBtn");

    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    const user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    btn.disabled = true;
    btn.innerHTML = '<i class="bi bi-arrow-repeat me-2"></i>Signing In...';

    try {
        const response = await fetch(
            "http://localhost:8080/api/auth/login",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(user)
            }
        );

        const result = await response.json();

        if(response.ok && result){
            sessionStorage.setItem("user", JSON.stringify(result));
            alert("Login Successful");

            if(result.role === "ADMIN"){
                window.location.href="admin.html";
            } else {
                window.location.href="index.html";
            }
        } else {
            alert(result.message || "Invalid Credentials");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("Server Error. Please try again later.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-box-arrow-in-right me-2"></i>Sign In';
    }

});