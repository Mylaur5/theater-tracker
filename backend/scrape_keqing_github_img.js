import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const baseUrl = 'https://github.com';
const IMAGE_FOLDER = './static/images/';

let skipped = 0;
let downloaded = 0;

function sanitizeFilename(filename) {
	// Remove invalid characters for Windows file names
	return filename
		.replace(/[<>:"/\\|?*]/g, '')
		.toLowerCase()
		.replace(/ /g, '_');
}

async function downloadImage(imgSrc, fileName, folderName) {
	const folderPath = path.resolve(`${IMAGE_FOLDER}${folderName}`);
	const destinationFile = path.join(folderPath, fileName);

	// Clean the folder before downloading
	if (fs.existsSync(folderPath)) {
		fs.readdirSync(folderPath).forEach((file) => {
			const filePath = path.join(folderPath, file);
			fs.unlinkSync(filePath);
		});
		fs.rmdirSync(folderPath);
	}
	fs.mkdirSync(folderPath, { recursive: true });

	// --- Case-insensitive rename logic ---
	const filesInFolder = fs.readdirSync(folderPath);
	const lowerFileName = fileName.toLowerCase();
	for (const existing of filesInFolder) {
		if (existing.toLowerCase() === lowerFileName && existing !== fileName) {
			const oldPath = path.join(folderPath, existing);
			fs.unlinkSync(oldPath);
			console.log(`\x1b[33m✏️ Deleting '${existing}' to '${fileName}' for case normalization.\x1b[0m`);
		}
	}

	try {
		// Check if the file already exists and compare sizes
		if (fs.existsSync(destinationFile)) {
			const existingFileSize = fs.statSync(destinationFile).size;
			const imgReq = await axios.get(imgSrc, {
				responseType: 'stream',
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
					Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
					'Accept-Language': 'en-US,en;q=0.9'
				}
			});
			const newFileSize = parseInt(imgReq.headers['content-length'], 10);

			if (existingFileSize === newFileSize) {
				skipped++;
				console.log(`\x1b[90m⏭️ Skipping download: Image '${destinationFile}' already exists and is identical.\x1b[0m`);
				return;
			}
		} else {
			const imgReq = await axios.get(imgSrc, {
				responseType: 'stream',
				headers: {
					'User-Agent':
						'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
					Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
					'Accept-Language': 'en-US,en;q=0.9'
				}
			});

			await new Promise((resolve, reject) => {
				const writer = fs.createWriteStream(destinationFile);
				imgReq.data.pipe(writer);
				writer.on('finish', () => {
					downloaded++;
					console.log(`\x1b[32m Downloading '${fileName}' successfully. Saved to '${destinationFile}'\x1b[0m`);
					resolve();
				});
				writer.on('error', reject);
				imgReq.data.on('error', reject);
			});
		}
	} catch (error) {
		if (error.response && error.response.status === 403) {
			console.error(
				`\x1b[31m⚠️ Forbidden (Code 403): Access to the image '${imgSrc}' is forbidden. Skipping...\x1b[0m`
			);
			return;
		} else {
			console.error(`\x1b[31m⚠️ Error downloading image '${imgSrc}': ${error.message}\x1b[0m`);
			throw error;
		}
	}
}

async function scrape(section, url) {
	try {
		const start = performance.now();
		const response = await axios.get(url);
		const html = response.data;
		const $ = cheerio.load(html);
		const downloadPromises = []; // Collect all download promises

		if (!fs.existsSync(IMAGE_FOLDER)) {
			fs.mkdirSync(IMAGE_FOLDER);
		}

		$('script[type="application/json"][data-target="react-app.embeddedData"]').each((i, elem) => {
			const jsonText = $(elem).html();
			if (jsonText) {
				const jsonData = JSON.parse(jsonText);
				const items = jsonData.payload.tree.items;
				items.forEach((item) => {
					if (item.contentType === 'file') {
						const fileName = item.name;
						const fileUrl = `${baseUrl}/KQM-git/TCL/raw/master/${item.path}`;

						const promise = downloadImage(fileUrl, sanitizeFilename(fileName), section).catch((error) => {
							console.error(`Error processing image ${fileName}:`, error.message);
						});
						downloadPromises.push(promise);
					}
				});
			}
		});
		// Wait for all downloads to finish
		await Promise.all(downloadPromises);

		// Stop timing
		const stop = performance.now();
		const executionTime = (stop - start) / 1000;
		console.log(`Program Executed in ${executionTime} seconds`); // It returns time in seconds
	} catch (error) {
		console.error(`\x1b[31m⚠️ Failed to scrape the page: ${error.message}: ${error.stack}\x1b[0m`);
	}
}

for (const [section, url] of Object.entries({
	artifacts: 'https://github.com/KQM-git/TCL/tree/master/static/img/artifacts/icon',
	characters: 'https://github.com/KQM-git/TCL/tree/master/static/img/characters/icon',
	elements: 'https://github.com/KQM-git/TCL/tree/master/static/img/elements',
	weapons: 'https://github.com/KQM-git/TCL/tree/master/static/img/weapons/icon_ascended'
})) {
	scrape(section, url);
}
