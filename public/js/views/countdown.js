import { DBManager } from "../db/db.js";
import { OpenModal, CloseModal } from "./modal.js";

import "../components/countdown.js";
import "../components/alert.js";

export async function CountdownView(mainElement) {
    try {
        const db = new DBManager();
        
        const toastAlert = document.getElementById('toastAlert');

        const title = document.getElementById("title");
        title.innerText = "Countdowns";

        const form = document.createElement('countdown-form');

        const countdowns = await db.getAllCountdown();
        const cards = document.createElement('countdown-cards');
        cards.countdowns = countdowns;
    
        cards.addEventListener("card-clicked", (event) => {
            form.countdownData = event.detail;
            OpenModal("Edit", form);
        });
        
        form.addEventListener('discard-countdown', CloseModal);

        form.addEventListener('delete-countdown', async (event) => {
            try {
                await db.deleteCountdown(event.detail.ID());
                cards.deleteCountdown(event.detail.ID());
                CloseModal(); 
            } catch (error) {
                toastAlert.innerText = error;
            }
        });

        form.addEventListener('update-countdown', async (event) => {
            try {
                await db.updateCountdown(event.detail);
                cards.updateCountdown(event.detail);
                CloseModal();
            } catch (error) {
                toastAlert.innerText = error;
            }
        });
        
        form.addEventListener('save-countdown', async (event) => {
            try {
                const countdown = event.detail;
                countdown.id = await db.addCountdown(countdown);
                cards.addCountdown(countdown);
                CloseModal();  
            } catch (error) {
                toastAlert.innerText = error;
            }
        });

        const addBtn = document.createElement("button");
        addBtn.innerText = "+";
        addBtn.setAttribute("id", "addBtn");
        addBtn.setAttribute("type", "button");

        addBtn.addEventListener("click", () => {
            form.resetForm();
            OpenModal("Add", form);
        });

        mainElement.appendChild(title);
        mainElement.appendChild(cards);
        mainElement.appendChild(addBtn);

    } catch (error) {
        toastAlert.innerText = error;
    }
}