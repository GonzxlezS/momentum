import { CountdownView } from "./views/countdown.js";

function loadCountdownView() {
    const toastAlert = document.createElement('toast-alert');
    toastAlert.setAttribute('id', 'toastAlert');
    document.body.insertBefore(toastAlert, document.body.firstChild);

    const mainElement = document.getElementById("main");
    mainElement.innerHTML = "";
    CountdownView(mainElement);
}

// ---
document.addEventListener('DOMContentLoaded', loadCountdownView);