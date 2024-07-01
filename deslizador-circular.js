class CircularSlider {
    constructor(element, options = {}) {
        this.element = element;
        this.radius = options.radius || 40;
        this.value = options.value || 0;

        this.init();
    }

    init() {
        this.outerCircle = document.createElement('div');
        this.outerCircle.classList.add('outer-circle');

        this.innerCircle = document.createElement('div');
        this.innerCircle.classList.add('inner-circle');

        this.indicator = document.createElement('div');
        this.indicator.classList.add('indicator');

        this.outerCircle.appendChild(this.innerCircle);
        this.outerCircle.appendChild(this.indicator);
        this.element.appendChild(this.outerCircle);

        this.outerCircle.addEventListener('mousedown', this.startDrag.bind(this));
        window.addEventListener('mousemove', this.drag.bind(this));
        window.addEventListener('mouseup', this.stopDrag.bind(this));

        this.draw();
    }

    startDrag(event) {
        this.dragging = true;
        this.updateValue(event);
    }

    drag(event) {
        if (this.dragging) {
            this.updateValue(event);
        }
    }

    stopDrag() {
        this.dragging = false;
    }

    updateValue(event) {
        const rect = this.outerCircle.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(y, x);
        this.value = (angle) / (2 * Math.PI) * 100;
        this.draw();
    }

    draw() {
        const angle = this.value / 100 * 360;
        this.indicator.style.transform = `translate(0%, -50%) rotate(${angle}deg)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.deslizador-circular');
    sliders.forEach(slider => {
        new CircularSlider(slider, { value: -25 });
    });
});
