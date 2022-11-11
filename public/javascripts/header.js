window.onload = function () {
    // Grab HTML Elements
    const btn_toggle = document.querySelector("button.menu-toggle");
    const mobile_menu = document.getElementById("mobile-menu");

    // Add Event Listeners
    btn_toggle.addEventListener("click", () => {
        mobile_menu.classList.toggle("hidden");
    });

}