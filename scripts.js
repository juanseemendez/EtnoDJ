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
        source.connect(audioContext.destination);
        source.start();
        return source;
    }

    // Manejar clic en cada botón
    audioButtons.forEach(button => {
        const audioUrl = button.getAttribute('data-audio');
        loadAudio(audioUrl).then(audioBuffer => {
            audioSources[button.id] = audioBuffer; // Guardar el buffer de audio

            button.addEventListener('click', function() {
                if (this.classList.contains('active')) {
                    // Detener la reproducción si ya está activo
                    audioSources[this.id].stop();
                    this.classList.remove('active');
                } else {
                    // Reproducir el audio si no está activo
                    playAudio(audioSources[this.id]);
                    this.classList.add('active');
                }
            });
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
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


