import { DBManager } from "../db/db.js";
import { CountdownCard, CountdownCards } from "../components/countdownCard.js";
import { CountdownForm } from "../components/countdownForm.js";
import { AddBtn } from "../components/addBtn.js";
import { OpenModal, CloseModal, Alert, RGBToHex } from "./utils.js";
import { Countdown } from "../models/countdown.js";

const db = new DBManager();

function deleteCountdowns(form) {
    return async (event) => {
        try {
            event.preventDefault();

            const formData = new FormData(form);
            const countdownId = formData.get('id');

            await db.deleteCountdown(parseInt(countdownId));

            const card = document.getElementById(`countdown-${countdownId}`);
            card.remove();
            CloseModal();
                        
        } catch (error) {
            Alert(error);
        }
    }
}

function updateCountdowns(form) {
    return async (event) => {
        try {
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            event.preventDefault();

            const countdown = Countdown.fromForm(form);
            await db.updateCountdown(countdown);

            const card = document.getElementById(`countdown-${countdown.ID()}`);
            card.replaceWith(CountdownCard(countdown));
            CloseModal();            
                        
        } catch (error) {
            Alert(error);
        }
    }
}

function saveCountdowns(form) {
    return async (event) => {
        try {
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            event.preventDefault();
            

            const countdown = Countdown.fromForm(form);
            countdown.id = await db.addCountdown(countdown);

            const cards = document.getElementById("countdownCards");
            const card = CountdownCard(countdown);

            cards.appendChild(card);                    
            CloseModal(); 
                        
        } catch (error) {
            Alert(error);
        }
    }
}

function cardToForm(card, form) {
    const id = card.getAttribute("id");
    form.elements.id.value = id.replace('countdown-', '');

    const emoji = card.querySelector(".countdown-card-emoji");
    form.elements.emoji.value = emoji.textContent;
    form.querySelector("#emojiBtn").innerText = emoji.textContent;

    const name = card.querySelector(".countdown-card-name");
    form.elements.name.value = name.textContent;

    const dateStr = card.querySelector(".countdown-card-date");
    const date = new Date(dateStr.textContent);
    form.elements.date.value = date.toISOString().slice(0, 10);
    
    form.elements.color.value = RGBToHex(card.style.backgroundColor);
}

export async function CountdownView(mainElement) {
    try {
        const countdowns = await db.getAllCountdown();

        const title = document.getElementById("title");
        const form = CountdownForm();
        const discardBtn = form.querySelector("#discardBtn");
        const deleteBtn = form.querySelector("#deleteBtn");
        const updateBtn = form.querySelector("#updateBtn");
        const saveBtn = form.querySelector("#saveBtn");
        const cards = CountdownCards(countdowns);
        const addBtn = AddBtn();

        title.innerText = "Countdowns";

        discardBtn.addEventListener("click", CloseModal);
        deleteBtn.addEventListener("click", deleteCountdowns(form));
        updateBtn.addEventListener("click", updateCountdowns(form));
        saveBtn.addEventListener("click", saveCountdowns(form));

        addBtn.addEventListener("click", () => {
            deleteBtn.classList.add("hidden");
            updateBtn.classList.add("hidden");
            saveBtn.classList.remove("hidden");
            form.reset();
            OpenModal("Add", form);
        });

        cards.addEventListener("click", (event) => {
            const clickedCard = event.target.closest('.countdown-card');

            if (clickedCard) {
                deleteBtn.classList.remove("hidden");
                updateBtn.classList.remove("hidden");
                saveBtn.classList.add("hidden");
                cardToForm(clickedCard, form);
                OpenModal("Edit", form);
            }
        });
        
        // append
        mainElement.appendChild(title);
        mainElement.appendChild(cards);
        mainElement.appendChild(addBtn);

    } catch (error) {
        Alert(error);
    }
}