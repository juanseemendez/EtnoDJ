class DeslizadorCircular {
    constructor(element, options = {}) {
        this.element = element;
        this.radius = options.radius || 30;
        this.value = options.value !== undefined ? options.value : 0; // Valor inicial
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

        this.indicator.addEventListener('mousedown', this.startDrag.bind(this));
        window.addEventListener('mousemove', this.drag.bind(this));
        window.addEventListener('mouseup', this.stopDrag.bind(this));

        this.draw();
        this.emitValueChange(); // Emitir evento al inicializar
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
        let angle = Math.atan2(y, x) - Math.PI / 2;

        // Convertir ángulo a un rango entre 0 y 2 * PI
        if (angle <= 0) {
            angle += 2 * Math.PI;
        }
        
        // Limitar el ángulo para evitar giros infinitos 
        if (angle <= 3 * Math.PI / 15) angle = 3 * Math.PI / 15;
        if (angle >= 27 * Math.PI / 15) angle = 27 * Math.PI / 15;

        // Calcular valor basado en el ángulo
        this.value = ((angle) / (2 * Math.PI)) * 100;
        if (this.value < 0) this.value = 0;
        if (this.value > 100) this.value = 100;

        console.log(`Angle: ${angle}, Slider Value: ${this.value}`);

        this.draw();
        this.emitValueChange();
    }

    emitValueChange() {
        const event = new CustomEvent('valuechange', {
            detail: {
                id: this.id,
                value: this.value
            }
        });
        document.dispatchEvent(event);
    }

    draw() {
        const angle = ((this.value / 100) * 2 * Math.PI + Math.PI / 2);
        this.indicator.style.transform = `translate(0%, -50%) rotate(${angle}rad)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.deslizador-circular');
    sliders.forEach(slider => {
        new DeslizadorCircular(slider, { value: 10, id: slider.id });
    });
});
