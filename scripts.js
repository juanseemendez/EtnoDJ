document.addEventListener('DOMContentLoaded', function() {
    const botonesAudio = document.querySelectorAll('.selector');
    const contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
    const fuentesAudio = {};
    let consolaEncendida = false;

    function cargarAudio(url) {
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => contextoAudio.decodeAudioData(buffer));
    }

    function reproducirAudio(audioBuffer) {
        const source = contextoAudio.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        const gainNode = contextoAudio.createGain(); // Control de volumen
        source.connect(gainNode).connect(contextoAudio.destination);
        source.start();
        return { source, gainNode }; // Devolvemos source y gainNode
    }

    botonesAudio.forEach((button) => {
        button.dataset.active = 'false';
        const audioUrl = button.getAttribute('data-audio');
        const sectionId = button.closest('.fila').dataset.section;
        button.setAttribute('data-section', sectionId);

        cargarAudio(audioUrl).then(audioBuffer => {
            fuentesAudio[button.id] = {
                buffer: audioBuffer,
                source: null,
                gainNode: null // Inicialmente null
            };

            button.addEventListener('click', function() {
                if (!consolaEncendida) return; // Si la consola está apagada, no hacer nada

                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    this.dataset.active = 'false';
                    fuentesAudio[this.id].source.stop();
                    fuentesAudio[this.id].source = null;
                } else {
                    const { source, gainNode } = reproducirAudio(fuentesAudio[this.id].buffer);
                    fuentesAudio[this.id].source = source;
                    fuentesAudio[this.id].gainNode = gainNode; // Guardamos el gainNode
                    this.classList.add('active');
                    this.dataset.active = 'true';
                }
            });
        });
    });

    // Evento para ajustar el volumen basado en el deslizador
    document.addEventListener('valuechange', (event) => {
        const { id, value } = event.detail;
        const gainValue = value / 100;
        if (!isFinite(gainValue)) return; // Verificar si gainValue es finito
        Object.keys(fuentesAudio).forEach(key => {
            if (fuentesAudio[key].source && document.querySelector(`#${key}`).dataset.section === id) {
                fuentesAudio[key].gainNode.gain.setValueAtTime(gainValue, contextoAudio.currentTime);
            }
        });
    });

    // Función para actualizar el estado de los botones de silencio y solo
    function actualizarEstadoAudio() {
        const botonesSilencio = document.querySelectorAll('.mute');
        const botonesSolo = document.querySelectorAll('.solo');
        const seccionesActivas = Array.from(botonesSolo).filter(btn => btn.classList.contains('activo')).map(btn => btn.id.replace('solo-', ''));

        botonesSilencio.forEach(btn => {
            const sectionId = btn.id.replace('mute-', '');
            const gainNodes = Array.from(document.querySelectorAll(`.selector[data-section="volumen-${sectionId}"]`)).map(selector => fuentesAudio[selector.id]?.gainNode);

            if (btn.classList.contains('activo')) {
                gainNodes.forEach(gainNode => {
                    if (gainNode) gainNode.gain.setValueAtTime(0, contextoAudio.currentTime);
                });
            } else if (seccionesActivas.length > 0 && !seccionesActivas.includes(sectionId)) {
                gainNodes.forEach(gainNode => {
                    if (gainNode) gainNode.gain.setValueAtTime(0, contextoAudio.currentTime);
                });
            } else {
                gainNodes.forEach(gainNode => {
                    if (gainNode) gainNode.gain.setValueAtTime(1, contextoAudio.currentTime);
                });
            }
        });
    }

    // Agregar funcionalidad a los botones de silencio y solo
    const botonesSilencio = document.querySelectorAll('.mute');
    const botonesSolo = document.querySelectorAll('.solo');

    botonesSilencio.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!consolaEncendida) return; // Si la consola está apagada, no hacer nada
            this.classList.toggle('activo');
            actualizarEstadoAudio();
        });
    });

    botonesSolo.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!consolaEncendida) return; // Si la consola está apagada, no hacer nada
            this.classList.toggle('activo');
            actualizarEstadoAudio();
        });
    });

    // Agregar funcionalidad al botón encender
    const botonEncender = document.getElementById('encender');

    botonEncender.addEventListener('click', function() {
        consolaEncendida = !consolaEncendida;
        if (consolaEncendida) {
            botonEncender.classList.add('activo');
            botonEncender.querySelector('i').style.color = 'black';
        } else {
            botonEncender.classList.remove('activo');
            botonEncender.querySelector('i').style.color = 'red';
            // Detener todos los audios si la consola se apaga
            Object.keys(fuentesAudio).forEach(key => {
                if (fuentesAudio[key].source) {
                    fuentesAudio[key].source.stop();
                    fuentesAudio[key].source = null;
                }
            });
            // Desactivar todos los botones de audio
            botonesAudio.forEach(button => {
                button.classList.remove('active');
                button.dataset.active = 'false';
            });
            // Desactivar todos los botones de silencio y solo
            botonesSilencio.forEach(button => {
                button.classList.remove('activo');
            });
            botonesSolo.forEach(button => {
                button.classList.remove('activo');
            });
        }
    });

    // Inicializar color del icono en rojo
    botonEncender.querySelector('i').style.color = 'red';
});
