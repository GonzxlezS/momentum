export function OpenModal(title, body) {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById('modalBody');

    modalTitle.innerText = title;
    modalBody.appendChild(body);
    
    modal.classList.remove("hidden");
}

export function CloseModal() {
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById('modalBody');

    modalTitle.innerText = "";
    modalBody.innerHTML = "";
    modal.classList.add("hidden");
}

export function Alert(msg) {
    const alert = document.getElementById("alert");
    alert.innerText = msg;
    alert.classList.remove("hidden");

    setTimeout(()=> {
        alert.classList.add("hidden");
        alert.innerText = "";
    }, 5000);
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

export function RGBToHex(rgbString) {
  const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(rgbString);
  if (result) {
    const r = parseInt(result[1], 10);
    const g = parseInt(result[2], 10);
    const b = parseInt(result[3], 10);

    if (r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
        return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
    }
  }
  return "#000"
}