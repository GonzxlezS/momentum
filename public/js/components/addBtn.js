export function AddBtn() {
    const addBtn = document.createElement("button");
    addBtn.innerText = "+";
    addBtn.setAttribute("id", "addBtn");
    addBtn.setAttribute("type", "button");
    return addBtn;
}