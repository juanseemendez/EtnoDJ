document.addEventListener('DOMContentLoaded', function() {
    const audioButtons = document.querySelectorAll('.selector');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
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
        source.connect(audioContext.destination);
        source.start();
        return source;
    }

    function adjustVolume(id, value) {
        const gainValue = Math.pow(10, (value - 50) / 20); // Valor de volumen logarítmico en dB
        console.log(`Adjusting volume for ${id} to ${gainValue} (value: ${value})`);
        document.querySelectorAll(`.fila [data-section="${id}"]`).forEach(button => {
            if (audioSources[button.id] && audioSources[button.id].source) {
                const gainNode = audioContext.createGain();
                gainNode.gain.value = gainValue;
                audioSources[button.id].source.connect(gainNode);
                gainNode.connect(audioContext.destination);
            }
        });
    }

    audioButtons.forEach((button, index) => {
        button.dataset.active = 'false';
        const audioUrl = button.getAttribute('data-audio');
        const sectionId = button.closest('.fila').dataset.section;
        button.setAttribute('data-section', sectionId);

        loadAudio(audioUrl).then(audioBuffer => {
            audioSources[button.id] = {
                buffer: audioBuffer,
                source: null
            };

            button.addEventListener('click', function() {
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                    this.dataset.active = 'false';
                    audioSources[this.id].source.stop();
                    audioSources[this.id].source = null;
                } else {
                    const source = playAudio(audioSources[this.id].buffer);
                    audioSources[this.id].source = source;
                    this.classList.add('active');
                    this.dataset.active = 'true';
                }
            });
        });
    });

    document.addEventListener('volumechange', (event) => {
        adjustVolume(event.detail.id, event.detail.value);
    });
});
