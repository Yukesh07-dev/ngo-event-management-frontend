const user =
    JSON.parse(sessionStorage.getItem("user"));

if(!user){

    alert("Please Login");

    window.location.href =
        "login.html";
}

document.getElementById("fullName").value =
    user.fullName;

document.getElementById("email").value =
    user.email;

document.getElementById("phone").value =
    user.phone;

document.getElementById("address").value =
    user.address;

document.getElementById("profileForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const updatedUser = {

        fullName:
            document.getElementById("fullName").value,

        phone:
            document.getElementById("phone").value,

        address:
            document.getElementById("address").value
    };

    const response = await fetch(
        `http://localhost:8080/api/users/${user.userId}`,
        {
            method: "PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify(updatedUser)
        }
    );

    const result =
        await response.json();

    sessionStorage.setItem(
        "user",
        JSON.stringify(result)
    );

    document.getElementById("message")
    .innerHTML =
        "<span class='text-success'>Profile Updated Successfully</span>";

});