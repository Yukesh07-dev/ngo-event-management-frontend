function logout() {
    sessionStorage.removeItem("user");
    window.location.href = "index.html";
}

function initNavbar() {
    const menu = document.getElementById("navbarMenu");
    if (!menu) {
        return;
    }

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const user = JSON.parse(sessionStorage.getItem("user"));

    const links = [
        { href: "index.html", label: "Home" },
        // { href: "events.html", label: "Events" },
        { href: "campaigns.html", label: "Campaigns" },
        // { href: "volunteer.html", label: "Volunteer" },
        // { href: "donate.html", label: "Donate" },
        // { href: "gallery.html", label: "Gallery" },
        { href: "contact.html", label: "Contact" }
    ];

    if (user) {
        links.push(
            { href: "my-events.html", label: "My Events" },
            { href: "my-donations.html", label: "My Donations" },
            { href: "profile.html", label: "Profile" }
        );

        if (user.role === "ADMIN") {
            links.push({ href: "admin.html", label: "Admin" });
        }
    } else {

    links.push(
        { href: "login.html", label: "Login" },
        { href: "register.html", label: "Register" }
    );

}

    menu.innerHTML = links.map(link => {
       const isActive =
    currentPage === link.href;

        const activeClass = isActive ? " active" : "";

        return `
            <li class="nav-item">
                <a class="nav-link${activeClass}" href="${link.href}">
                    ${link.label}
                </a>
            </li>
        `;
    }).join("");

    if (user) {
        menu.innerHTML += `
            <li class="nav-item">
                <a class="nav-link" href="#" id="logoutLink">Logout</a>
            </li>
        `;

        document.getElementById("logoutLink").addEventListener("click", function(e) {
            e.preventDefault();
            logout();
        });
    }
}

document.addEventListener("DOMContentLoaded", initNavbar);
