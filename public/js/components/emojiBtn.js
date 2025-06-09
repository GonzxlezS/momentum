export function EmojiBtn() {
    const emojiBtn = document.createElement("button");
    emojiBtn.innerText = "😀";
    emojiBtn.setAttribute("id", "emojiBtn");
    emojiBtn.setAttribute("type", "button");
    emojiBtn.setAttribute("form", "countdownForm");
    emojiBtn.setAttribute("popovertarget", "emojiPickerPopover");
    emojiBtn.setAttribute("popovertargetaction", "show");
    return emojiBtn;
}