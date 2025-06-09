import { EmojiBtn } from "./emojiBtn.js";

export function CountdownForm() {
    const emojiPickerPopover = document.querySelector("#emojiPickerPopover");
    const emojiPicker = document.querySelector("emoji-picker");

    const form = document.createElement("form");
    const inputID = document.createElement("input");
    const inputEmoji = document.createElement("input");
    const emojiColorContainer = document.createElement("div");
    const inputColor = document.createElement("input");
    const labelName = document.createElement("label");
    const inputName = document.createElement("input");
    const labelTextName = document.createElement("span");
    const labelDate = document.createElement("label");
    const inputDate = document.createElement("input");
    const labelTextDate = document.createElement("span");

    const btnContainer = document.createElement("div");
    const emojiBtn = EmojiBtn();
    const discardBtn = DiscardBtn();
    const deleteBtn = DeleteBtn();
    const updateBtn = UpdateBtn();
    const saveBtn = SaveBtn();

    form.setAttribute("id", "countdownForm");
    
    inputID.setAttribute("type", "hidden");
    inputID.setAttribute("id", "id");
    inputID.setAttribute("name", "id");
   
    inputEmoji.setAttribute("type", "hidden");
    inputEmoji.setAttribute("id", "emoji");
    inputEmoji.setAttribute("name", "emoji");
    inputEmoji.setAttribute("required", "");
    inputEmoji.value = "😀";
    

    emojiColorContainer.setAttribute("id", "emojiColorContainer");

    emojiPicker.addEventListener(("emoji-click"), (event) => {
        inputEmoji.value = event.detail.unicode;
        emojiBtn.innerText = event.detail.unicode;
        emojiPickerPopover.hidePopover();
    });

    inputColor.setAttribute("type", "color");
    inputColor.setAttribute("id", "color");
    inputColor.setAttribute("name", "color");
    inputColor.setAttribute("required", "");

    labelName.setAttribute("for", "name");
    labelName.classList.add("form-label");

    inputName.setAttribute("type", "text");
    inputName.setAttribute("id", "name");
    inputName.setAttribute("name", "name");
    inputName.setAttribute("placeholder", " ");
    inputName.setAttribute("required", "");
    inputName.classList.add("form-input");

    labelTextName.innerText = "Name";
    labelTextName.classList.add("form-text");
    
    labelDate.setAttribute("for", "date");
    labelDate.classList.add("form-label");

    inputDate.setAttribute("type", "date");
    inputDate.setAttribute("id", "date");
    inputDate.setAttribute("name", "date");
    inputDate.setAttribute("required", "");
    inputDate.classList.add("form-input");

    labelTextDate.innerText = "Date";
    labelTextDate.classList.add("form-text");

    btnContainer.setAttribute("id", "btnContainer");

    // return
    emojiColorContainer.appendChild(emojiBtn);
    emojiColorContainer.appendChild(inputColor);
    form.appendChild(emojiColorContainer);

    labelName.appendChild(inputName);
    labelName.appendChild(labelTextName);
    form.appendChild(labelName);

    labelDate.appendChild(inputDate);
    labelDate.appendChild(labelTextDate);
    form.appendChild(labelDate);

    form.appendChild(inputID);
    form.appendChild(inputEmoji);

    btnContainer.appendChild(discardBtn);
    btnContainer.appendChild(deleteBtn);
    btnContainer.appendChild(updateBtn);
    btnContainer.appendChild(saveBtn);

    form.appendChild(btnContainer);
    return form;
}

function DiscardBtn() {
    const discardBtn = document.createElement("button");
    discardBtn.innerText = "Discard";
    discardBtn.setAttribute("id", "discardBtn");
    discardBtn.setAttribute("type", "reset");
    discardBtn.setAttribute("form", "countdownForm");
    return discardBtn;
}

function DeleteBtn() {
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.setAttribute("id", "deleteBtn");
    deleteBtn.setAttribute("type", "reset");
    deleteBtn.setAttribute("form", "countdownForm");
    return deleteBtn;
}

function UpdateBtn() {
  const updateBtn = document.createElement("button");
    updateBtn.innerText = "Update";
    updateBtn.setAttribute("id", "updateBtn");
    updateBtn.setAttribute("type", "submit");
    updateBtn.setAttribute("form", "countdownForm");
    return updateBtn;

}

function SaveBtn() {
    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    saveBtn.setAttribute("id", "saveBtn");
    saveBtn.setAttribute("type", "submit");
    saveBtn.setAttribute("form", "countdownForm");
    return saveBtn;
}