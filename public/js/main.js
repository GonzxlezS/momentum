import { CountdownView } from "./views/countdownView.js";
import { CloseModal } from "./views/utils.js";

const modal = document.getElementById("modal");
window.addEventListener("click", (event) => {
    if (event.target === modal) {
        CloseModal();
    }
});

function loadCountdownView() {
    const mainElement = document.getElementById("main");
    mainElement.innerHTML = "";
    CountdownView(mainElement);
}

// ---
document.addEventListener('DOMContentLoaded', loadCountdownView);