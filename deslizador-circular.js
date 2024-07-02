class CircularSlider {
    constructor(element, options = {}) {
        this.element = element;
        this.radius = options.radius || 40;
        this.value = options.value !== undefined ? options.value : 50; // Volumen medio
        this.id = options.id || '';

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
        let angle = Math.atan2(y, x);

        // Convertir ángulo a un rango entre 0 y 2 * PI
        if (angle < -Math.PI / 2) {
            angle += 2 * Math.PI;
        }

        // Limitar el ángulo para evitar giros infinitos y cambios abruptos
        if (angle > 3 * Math.PI / 2) {
            angle = 3 * Math.PI / 2;
        } else if (angle < -Math.PI / 2) {
            angle = -Math.PI / 2;
        }

        // Calcular valor basado en el ángulo
        this.value = ((angle + Math.PI / 2) / (2 * Math.PI)) * 100;
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;

        console.log(`Angle: ${angle}, Volume Value: ${this.value}`);

        this.draw();
        this.emitVolumeChange();
    }

    emitVolumeChange() {
        const event = new CustomEvent('volumechange', {
            detail: {
                id: this.id,
                value: this.value
            }
        });
        document.dispatchEvent(event);
    }

    draw() {
        const angle = ((this.value / 100) * 2 * Math.PI) - Math.PI / 2;
        this.indicator.style.transform = `translate(0%, -50%) rotate(${angle}rad)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.deslizador-circular');
    sliders.forEach(slider => {
        new CircularSlider(slider, { value: 50, id: slider.id });
    });
});
