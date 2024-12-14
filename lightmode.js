let lightmode = localStorage.getItem("lightmode");
const theme = document.getElementById("theme");

const enableLightmode = () => {
    document.body.classList.add("lightmode");
    localStorage.setItem("lightmode", "active");
};

const disableLightmode = () => {
    document.body.classList.remove("lightmode");
    localStorage.setItem("lightmode", "inactive");
};

// Check the initial light mode state
if (lightmode === "active") enableLightmode();

theme.addEventListener("click", () => {
    lightmode = localStorage.getItem("lightmode");
    lightmode !== "active" ? enableLightmode() : disableLightmode();
});
