document.addEventListener('DOMContentLoaded', function() {
    const audioButtons = document.querySelectorAll('.selector');
    document.getElementById('reproducir').addEventListener('click', function() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('AudioContext created or resumed:', audioContext);
    });
    
    const audioSources = {};

    function loadAudio(url) {
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => audioContext.decodeAudioData(buffer));
    }

    function playAudio(audioBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        const gainNode = audioContext.createGain(); // Control de volumen
        source.connect(gainNode).connect(audioContext.destination);
        source.start();
        return { source, gainNode }; // Devolvemos source y gainNode
    }

    audioButtons.forEach((button, index) => {
        button.dataset.active = 'false';
        const audioUrl = button.getAttribute('data-audio');
        const sectionId = button.closest('.fila').dataset.section;
        button.setAttribute('data-section', sectionId);

        loadAudio(audioUrl).then(audioBuffer => {
            audioSources[button.id] = {
                buffer: audioBuffer,
                source: null,
                gainNode: null // Inicialmente null
            };

            button.addEventListener('click', function() {
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    this.dataset.active = 'false';
                    audioSources[this.id].source.stop();
                    audioSources[this.id].source = null;
                } else {
                    const { source, gainNode } = playAudio(audioSources[this.id].buffer);
                    audioSources[this.id].source = source;
                    audioSources[this.id].gainNode = gainNode; // Guardamos el gainNode
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
        Object.keys(audioSources).forEach(key => {
            if (audioSources[key].source && document.querySelector(`#${key}`).dataset.section === id) {
                audioSources[key].gainNode.gain.setValueAtTime(gainValue, audioContext.currentTime);
            }
        });
    });
});
