/* EXISTING RSS LOADER CODE REMAINS UNCHANGED ABOVE THIS POINT */

/* ------------------------------ */
/* v0.9.4 — LEFT RAIL FEATURES    */
/* ------------------------------ */

/* WEATHER WIDGET */
async function loadWeather() {
    try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=51.87&longitude=-2.24&current_weather=true");
        const data = await res.json();
        const w = data.current_weather;

        document.getElementById("weatherContent").innerHTML =
            `${w.temperature}°C — ${w.weathercode}`;
    } catch {
        document.getElementById("weatherContent").innerHTML = "Weather unavailable";
    }
}
loadWeather();
setInterval(loadWeather, 1800000); // 30 min

/* TIMEZONES */
function updateTimezones() {
    const now = new Date();

    document.getElementById("tzLondon").textContent =
        "London: " + now.toLocaleTimeString("en-GB", { timeZone: "Europe/London" });

    document.getElementById("tzNewYork").textContent =
        "New York: " + now.toLocaleTimeString("en-US", { timeZone: "America/New_York" });

    document.getElementById("tzTokyo").textContent =
        "Tokyo: " + now.toLocaleTimeString("en-US", { timeZone: "Asia/Tokyo" });
}
setInterval(updateTimezones, 1000);
updateTimezones();

/* QUICK LINKS */
function renderQuickLinks() {
    const list = document.getElementById("quickLinksList");
    const links = JSON.parse(localStorage.getItem("quickLinks") || "[]");

    list.innerHTML = "";

    links.forEach((link, i) => {
        const div = document.createElement("div");
        div.innerHTML = `<a href="${link}" target="_blank">${link}</a>
                         <button data-i="${i}" class="ql-del">x</button>`;
        list.appendChild(div);
    });

    document.querySelectorAll(".ql-del").forEach(btn => {
        btn.onclick = () => {
            const links = JSON.parse(localStorage.getItem("quickLinks") || "[]");
            links.splice(btn.dataset.i, 1);
            localStorage.setItem("quickLinks", JSON.stringify(links));
            renderQuickLinks();
        };
    });
}

document.getElementById("addQuickLinkBtn").onclick = () => {
    const input = document.getElementById("quickLinkInput");
    const url = input.value.trim();
    if (!url) return;

    const links = JSON.parse(localStorage.getItem("quickLinks") || "[]");
    links.push(url);
    localStorage.setItem("quickLinks", JSON.stringify(links));

    input.value = "";
    renderQuickLinks();
};

renderQuickLinks();

/* END OF v0.9.4 ADDITIONS */
