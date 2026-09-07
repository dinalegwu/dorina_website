// Shop Now button
function shopNow() {
    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

// Contact Us button
function contactUs() {
    const phoneNumber = "2348148157968";
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
}

// Welcome message when the page loads
window.addEventListener("load", function () {
    console.log("Welcome to Dorina's website!");
});
