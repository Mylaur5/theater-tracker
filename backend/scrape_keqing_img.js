import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const PORTRAIT_LINK = 'https://library.keqingmains.com/resources/tools/portraits';
const SOURCE_LINK = 'https://library.keqingmains.com';
const IMAGE_FOLDER = './static/images/';
const KEQING_DATA_FILE = './static/data/keqing_data.json';

function sanitizeFilename(filename) {
	// Remove invalid characters for Windows file names
	return filename.replace(/[<>:"/\\|?*]/g, '');
}

async function downloadImage(imgSrc, fileName, folderName) {
	const imgLink = `${SOURCE_LINK}${imgSrc}`;
	const destinationFile = path.resolve(`${IMAGE_FOLDER}${folderName}/${fileName}`);
	fs.mkdirSync(`./images/${folderName}`, { recursive: true });

	// Check if the file already exists and compare sizes
	if (fs.existsSync(destinationFile)) {
		const existingFileSize = fs.statSync(destinationFile).size;
		const imgReq = await axios.get(imgLink, { responseType: 'stream' });
		const newFileSize = parseInt(imgReq.headers['content-length'], 10);

		if (existingFileSize === newFileSize) {
			console.log(`Image '${destinationFile}' already exists and is identical. Skipping download.`);
		}
	} else {
		const imgReq = await axios.get(imgLink, { responseType: 'stream' });

		await new Promise((resolve, reject) => {
			const writer = fs.createWriteStream(destinationFile);
			imgReq.data.pipe(writer);
			writer.on('finish', () => {
				console.log(`Image '${fileName}' has been successfully downloaded and saved to '${destinationFile}'`);
				resolve();
			});
			writer.on('error', reject);
			imgReq.data.on('error', reject);
		});
	}
}

async function extract() {
	// Start timing
	const start = performance.now();

	// Main program statements
	console.log(process.cwd()); // Current wd is backend

	const { data } = await axios.get(PORTRAIT_LINK);
	const $ = cheerio.load(data);

	const keqingTabs = ['element', 'level', 'type'];
	const keqingData = {};
	const downloadPromises = []; // Collect all download promises

	// Loop through each .tabs-container element
	$('.tabs-container').each((containerIndex, container) => {
		// Find the preceding h2 element
		const h2 = $(container).prev('h2').text().toLowerCase();
		console.log(`Preceding h2: ${h2}`);
		keqingData[h2] = [];

		const tabList = $(container)
			.find('*[role="tablist"] > li')
			.map((index, li) => $(li).text());

		// Loop through each [role='tabpanel'] element within the current .tabs-container
		const tabPanels = $(container).find('[role="tabpanel"]');
		tabPanels.each((panelIndex, panelElement) => {
			console.log(`  Tab Panel ${tabList[panelIndex]} inside Container`);

			// Perform any operations you need on each [role='tabpanel'] element
			$(panelElement)
				.find('img')
				.each((index, imgElement) => {
					const img = $(imgElement);
					if (img.attr('alt') === undefined || img.attr('alt') === 'undefined') {
						console.log(`Skipping image with src '${img.attr('src')}' due to missing alt attribute.`);
						return;
					}

					const fileExtension = path.extname(img.attr('src'));
					const fileName = sanitizeFilename(img.attr('alt')).replace(/ /g, '_') + fileExtension;
					keqingData[h2].push({
						name: img.attr('alt'),
						image_local: `/images/${h2}/${fileName}`,
						image_url: SOURCE_LINK + img.attr('src'),
						[keqingTabs[containerIndex]]: tabList[panelIndex]
					});
					const promise = downloadImage(img.attr('src'), fileName, h2).catch((error) => {
						console.error(`Error processing image ${img.attr('alt')}:`, error.message);
					});
					downloadPromises.push(promise);
				});
		});
	});

	// Wait for all downloads to finish
	await Promise.all(downloadPromises);

	// Stop timing
	const stop = performance.now();
	const executionTime = (stop - start) / 1000;

	console.log(`Program Executed in ${executionTime} seconds`); // It returns time in seconds
	return JSON.stringify(keqingData, null, 4);
}

extract()
	.then((data) => {
		fs.writeFile(KEQING_DATA_FILE, data, (err) => {
			if (err) {
				console.error('Error writing to file', err);
				return;
			}

			console.log('Data successfully written to ' + path.resolve(KEQING_DATA_FILE));
			process.exit(0);
		});
	})
	.catch((err) => {
		console.error(err);
		process.exit(1);
	});
