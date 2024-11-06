import fs from 'fs';
import path from 'path';
import { createObjectCsvWriter } from 'csv-writer';
import dotenv from 'dotenv';

dotenv.config();

const omnivoreDir = process.env.OMNIVORE_CONTENT_FOLDER;
const highlightsDir = process.env.OMNIVORE_HIGHLIGHTS_FOLDER;
const raindropCsvPath = process.env.RAINDROP_FOLDER;
const raindropFolderName = process.env.RAINDROP_FOLDER_NAME;

// Define the CSV writer
const csvWriter = createObjectCsvWriter({
    path: raindropCsvPath,
    header: [
        { id: 'folder', title: 'folder' },
        { id: 'url', title: 'url' },
        { id: 'title', title: 'title' },
        { id: 'note', title: 'note' },
        { id: 'tags', title: 'tags' },
        { id: 'created', title: 'created' },
        { id: 'highlights', title: 'highlights' }
    ],
    alwaysQuote: true
});

// Function to read and process JSON files from the Omnivore directory
async function readOmnivoreFiles(dir) {
    const files = fs.readdirSync(dir);
    const records = [];

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile() && path.extname(file) === '.json') {
            const content = fs.readFileSync(filePath, 'utf-8');
            const articles = JSON.parse(content);

            // Map the articles to the required CSV format
            for (const article of articles) {
                let note = article.description ? article.description.replace(/"/g, "'").replace(/\r?\n|\r/g, ' ') : ''; // Replace double quotes with single quotes and newlines with space
                let highlights = '';

                // If the slug attribute is present, read the corresponding markdown file
                if (article.slug) {
                    const markdownFilePath = path.join(highlightsDir, `${article.slug}.md`);
                    if (fs.existsSync(markdownFilePath)) {
                        const markdownContent = fs.readFileSync(markdownFilePath, 'utf-8');
                        highlights = markdownContent.replace(/"/g, "'").replace(/\r?\n|\r/g, ' ');
                        note = `${note}\n\n${highlights}`;
                    }
                }

                // Add 'Archived' label if the article state is 'Archived'
                let tags = article.labels;
                if (article.state === 'Archived') {
                    tags.push('Archived');
                }

                records.push({
                    folder: raindropFolderName,
                    url: article.url,
                    title: article.title,
                    note: note,
                    tags: tags.join(', '),
                    created: new Date(article.savedAt).getTime() / 1000, // Convert to Unix timestamp
                    highlights: highlights
                });
            }
        }
    }

    return records;
}

// Main function to create the CSV file
(async () => {
    try {
        const records = await readOmnivoreFiles(omnivoreDir);
        await csvWriter.writeRecords(records);
        console.log('CSV file was written successfully');
    } catch (error) {
        console.error('Error writing CSV file:', error);
    }
})();
