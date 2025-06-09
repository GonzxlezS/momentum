export function CountdownCard(countdown) {
    const countdownCard = document.createElement("div");
    const countdownCardRight = document.createElement("div");
    const countdownCardEmoji = document.createElement("span");
    const countdownCardDetails = document.createElement("div");
    const countdownCardName = document.createElement("span");
    const countdownCardDate = document.createElement("span");
    const countdownCardLeft = document.createElement("div");
    const countdownCardDaysleft = document.createElement("span");
    const countdownCardDaysLabel= document.createElement("span");

    countdownCard.setAttribute("id", `countdown-${countdown.ID()}`);
    countdownCard.classList.add("countdown-card");
    countdownCard.style.backgroundColor = countdown.color;
    countdownCard.style.color = countdown.textColor();

    // countdown-card-right
    countdownCardRight.classList.add("countdown-card-right");

    countdownCardEmoji.classList.add("countdown-card-emoji");
    countdownCardEmoji.innerText = countdown.emoji;
        
    countdownCardDetails.classList.add("countdown-card-details");

    countdownCardName.classList.add("countdown-card-name");
    countdownCardName.textContent = countdown.name;
 
    countdownCardDate.classList.add("countdown-card-date");
    countdownCardDate.textContent = countdown.date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    // countdown-card-left
    countdownCardLeft.classList.add("countdown-card-left");
    
    countdownCardDaysleft.classList.add("countdown-card-daysleft");
    countdownCardDaysleft.textContent = countdown.daysleft();

    countdownCardDaysLabel.classList.add("countdown-card-days-label");
    countdownCardDaysLabel.innerText = "days";


    // return
    countdownCardDetails.appendChild(countdownCardName)
    countdownCardDetails.appendChild(countdownCardDate)

    countdownCardRight.appendChild(countdownCardEmoji);
    countdownCardRight.appendChild(countdownCardDetails);
    
    countdownCardLeft.appendChild(countdownCardDaysleft);
    countdownCardLeft.appendChild(countdownCardDaysLabel);

    countdownCard.appendChild(countdownCardRight);
    countdownCard.appendChild(countdownCardLeft);
    return countdownCard;
}

export function CountdownCards(countdowns) {
    const cards = document.createElement("div");
    cards.setAttribute("id", "countdownCards");
    cards.classList.add("countdown-cards");

    countdowns.forEach(countdown => {
        const card = CountdownCard(countdown);
        cards.appendChild(card);                    
    });
    return cards;
}