const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');

export function OpenModal(title, body) {
    const toastAlert = document.getElementById('toastAlert')


    toastAlert.remove();
    modal.insertBefore(toastAlert, modal.firstChild);

    modalTitle.innerText = title;
    modalBody.appendChild(body);
    modal.showModal();
}

export function CloseModal() {
    const toastAlert = document.getElementById('toastAlert')

    toastAlert.remove();
    document.body.insertBefore(toastAlert, document.body.firstChild);

    modal.close();
    modalTitle.innerText = "";
    modalBody.innerHTML = "";
}

modalClose.addEventListener('click', CloseModal);