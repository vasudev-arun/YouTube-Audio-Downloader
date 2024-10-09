function fetchAudio() {
    const youtubeLink = document.getElementById('youtube-link').value;
    const errorMessage = document.getElementById('error-message');
    const audioPlayer = document.getElementById('audio-player');
    const audio = document.getElementById('audio');
    const downloadBtn = document.getElementById('download-btn');

    // Reset
    errorMessage.textContent = '';
    audioPlayer.style.display = 'none';

    if (!youtubeLink) {
        errorMessage.textContent = 'Please enter a valid YouTube link.';
        return;
    }

    // Fetch audio from the backend
    fetch(`http://localhost:3000/download?url=${encodeURIComponent(youtubeLink)}`)
        .then(response => response.blob())
        .then(blob => {
            const audioUrl = URL.createObjectURL(blob);

            // Set audio source and download link
            audio.src = audioUrl;
            downloadBtn.href = audioUrl;
            downloadBtn.download = 'audio.mp3';
            audioPlayer.style.display = 'block';
        })
        .catch(err => {
            errorMessage.textContent = 'Error fetching audio.';
            console.error(err);
        });
}
