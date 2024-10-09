const express = require('express');
const youtubedl = require('youtube-dl-exec');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// API endpoint to download audio
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send({ error: 'No video URL provided' });
    }

    try {
        const outputDir = path.resolve(__dirname, 'audio');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        const fileId = Date.now(); // Unique file identifier based on timestamp
        const outputFilePath = path.join(outputDir, `${fileId}.mp3`); // Define output file path
        const tempOutputPath = path.join(outputDir, `${fileId}.webm`); // Temporary output file path

        console.log('Temp output file path:', tempOutputPath);

        // Check if the file already exists to prevent redundant downloads
        if (fs.existsSync(outputFilePath)) {
            return res.download(outputFilePath, 'audio.mp3', (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                } else {
                    console.log('Audio downloaded successfully.');
                }
            });
        }

        // Use youtube-dl to download the audio
        const result = await youtubedl(videoUrl, {
            extractAudio: true,
            audioFormat: 'mp3',
            output: tempOutputPath,
        });

        console.log('Download result:', result);

        // Check if the file was created successfully
        if (fs.existsSync(tempOutputPath)) {
            fs.renameSync(tempOutputPath, outputFilePath); // Rename to .mp3
            console.log(`Renamed file to: ${outputFilePath}`);
            res.download(outputFilePath, 'audio.mp3', (err) => {
                if (err) {
                    console.error('Error downloading file:', err);
                } else {
                    console.log('Audio downloaded successfully.');
                }
            });
        } else {
            console.error('File was not created:', tempOutputPath);
            res.status(404).send({ error: 'File not found' });
        }
    } catch (error) {
        console.error('Error fetching audio:', error);
        res.status(500).send({ error: 'Failed to fetch audio' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
