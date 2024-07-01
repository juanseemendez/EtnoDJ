document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar todos los botones de audio
    const audioButtons = document.querySelectorAll('.selector');

    // Crear un contexto de audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Crear un objeto para cargar y reproducir el audio
    const audioSources = {};

    // Función para cargar el audio
    function loadAudio(url) {
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => audioContext.decodeAudioData(buffer));
    }


    // Función para reproducir el audio
    function playAudio(audioBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;  // Activar el bucle
        source.connect(audioContext.destination);
        source.start();
        return source;
    } 

    // Manejar clic en cada botón
    audioButtons.forEach((button, index) => {
        button.dataset.active = 'false';
        const audioUrl = button.getAttribute('data-audio');
        loadAudio(audioUrl).then(audioBuffer => {
            // Guardar el buffer de audio
            audioSources[button.id] = {
                buffer: audioBuffer,
                source: null  // Inicialmente no hay fuente de audio creada
            };

            button.addEventListener('click', function() {              
                if (this.classList.contains('active')) {
                    // Detener la reproducción si ya está activo
                    this.classList.remove('active');
                    this.dataset.active = 'false';
                    console.log(`Button ${index + 1} deactivated`);
                    audioSources[this.id].source.stop();
                    audioSources[this.id].source = null;  // Limpiar la referencia a la fuente
                } else {
                    // Reproducir el audio si no está activo
                    const source = playAudio(audioSources[this.id].buffer);
                    audioSources[this.id].source = source;  // Guardar la referencia a la fuente
                    this.classList.add('active');
                    this.dataset.active = 'true';
                    console.log(`Button ${index + 1} activated`);
                }
            });
        });
    });
});

/*document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.selector');
    
    buttons.forEach((button, index) => {
        button.dataset.active = 'false';
        button.addEventListener('click', () => {
            const isActive = button.dataset.active === 'true';
            if (isActive) {
                button.classList.remove('active');
                button.dataset.active = 'false';
                console.log(`Button ${index + 1} deactivated`);
            } else {
                button.classList.add('active');
                button.dataset.active = 'true';
                console.log(`Button ${index + 1} activated`);
            }
        });
    });
});
*/

