class DeslizadorCircular {
    constructor(element, options = {}) {
        this.elemento = element;
        this.radio = options.radius || 30;
        this.valor = options.value !== undefined ? options.value : 0; // Valor inicial
        this.id = options.id || '';

        this.inicializar();
    }

    inicializar() {
        this.circuloExterior = document.createElement('div');
        this.circuloExterior.classList.add('circulo-exterior');

        this.circuloInterior = document.createElement('div');
        this.circuloInterior.classList.add('circulo-interior');

        this.indicador = document.createElement('div');
        this.indicador.classList.add('indicador');

        this.circuloExterior.appendChild(this.circuloInterior);
        this.circuloExterior.appendChild(this.indicador);
        this.elemento.appendChild(this.circuloExterior);

        this.indicador.addEventListener('mousedown', this.iniciarArrastre.bind(this));
        window.addEventListener('mousemove', this.arrastrar.bind(this));
        window.addEventListener('mouseup', this.detenerArrastre.bind(this));

        this.dibujar();
        this.emitirCambioValor(); // Emitir evento al inicializar
    }

    iniciarArrastre(event) {
        this.arrastrando = true;
        this.actualizarValor(event);
    }

    arrastrar(event) {
        if (this.arrastrando) {
            this.actualizarValor(event);
        }
    }

    detenerArrastre() {
        this.arrastrando = false;
    }

    actualizarValor(event) {
        const rect = this.circuloExterior.getBoundingClientRect();
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
        this.valor = ((angle) / (2 * Math.PI)) * 100;
        if (this.valor < 0) this.valor = 0;
        if (this.valor > 100) this.valor = 100;

        console.log(`Angle: ${angle}, Slider Value: ${this.valor}`);

        this.dibujar();
        this.emitirCambioValor();
    }

    emitirCambioValor() {
        if (!isFinite(this.valor)) return; // Verificar si el valor es finito
        const event = new CustomEvent('valuechange', {
            detail: {
                id: this.id,
                value: this.valor
            }
        });
        document.dispatchEvent(event);
    }

    dibujar() {
        const angle = ((this.valor / 100) * 2 * Math.PI + Math.PI / 2);
        this.indicador.style.transform = `translate(0%, -50%) rotate(${angle}rad)`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const deslizadores = document.querySelectorAll('.deslizador-circular');
    deslizadores.forEach(deslizador => {
        new DeslizadorCircular(deslizador, { value: 10, id: deslizador.id });
    });
});
