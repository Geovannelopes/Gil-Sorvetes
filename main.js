const items = document.querySelectorAll('.destaque')
const list = document.querySelectorAll('.list')

let active = 0;
const total = items.length
let timer;

function update(direction) {

    document.querySelector('.destaque.active').classList.remove('active')

    if (direction > 0) {
        active = active + 1
        if (active == total) {
            active = 0
        }
    } else if (direction < 0) {
        active = active - 1
        if (active < 0) {
            active = total - 1
        }
    }

    items[active].classList.add('active')
}
clearInterval(timer)
timer = setInterval(() => {
    update(1)
}, 5000);
