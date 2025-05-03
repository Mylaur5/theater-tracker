import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';
import { fileURLToPath } from 'url';

const portraitLink = 'https://library.keqingmains.com/resources/tools/portraits';
const sourceLink = 'https://library.keqingmains.com';

function sanitizeFilename(filename) {
	// Remove invalid characters for Windows file names
	return filename.replace(/[<>:"/\\|?*]/g, '');
}

async function processImage(imgElement, folderName) {
    console.log(imgElement);
	const imgSrc = imgElement;
	const imgLink = `${sourceLink}${imgSrc}`;
	const fileExtension = path.extname(imgSrc);
	let fileName = imgElement.attr('alt');
	console.log(fileName, imgSrc, fileExtension);

	// Skip images without an alt attribute or with an empty alt attribute
	if (!fileName) {
		console.log(`Skipping image with src '${imgSrc}' due to missing or empty alt attribute.`);
		return;
	}

	fileName = sanitizeFilename(fileName).toLowerCase().replace(/ /g, '_') + fileExtension;
	folderName = folderName.toLowerCase().replace(/ /g, '_');
	const destinationFolder = `images/${folderName}/${fileName}`;
	fs.mkdirSync(`images/${folderName}`, { recursive: true });

	// Check if the file already exists and compare sizes
	if (fs.existsSync(destinationFolder)) {
		const existingFileSize = fs.statSync(destinationFolder).size;
		const imgReq = await axios.get(imgLink, { responseType: 'stream' });
		const newFileSize = parseInt(imgReq.headers['content-length'], 10);

		if (existingFileSize === newFileSize) {
			console.log(`Image '${fileName}' already exists and is identical. Skipping download.`);
			return;
		}
	} else {
		const imgReq = await axios.get(imgLink, { responseType: 'stream' });

		imgReq.data.pipe(fs.createWriteStream(destinationFolder));
		console.log(`Image '${fileName}' has been successfully downloaded and saved to '${destinationFolder}'`);
	}
}

/**
 * 
 * @param {cheerio.Cheerio<Element>} h2 
 * @param {cheerio.Cheerio<Element} nextH2 
 * @returns 
 */
function extractImages(h2, nextH2) {

	const images = [];
	let sibling = h2.next();
    console.log(h2.prop("outerHTML"), "\n", sibling.find('img').prop("outerHTML"), "\n\n");
	while (sibling.length > 0 && sibling.eq(0) !== nextH2?.eq(0)) {
		images.push(...sibling.find('img').toArray());
		sibling = sibling.next();
	}
	return [h2.text(), images];
}

async function extract() {
	// Start timing
	const start = performance.now();

	// Main program statements
	const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
	process.chdir(scriptDirectory);
	console.log(process.cwd()); // Current wd is backend

	const { data } = await axios.get(portraitLink);
	const $ = cheerio.load(data);

	// Find all h2 elements
	const h2Elements = $('h2');

	// Characters, Elements, Artifacts, Weapons, Misc
	const relevantH2Elements = [h2Elements.eq(2), h2Elements.eq(3), h2Elements.eq(4), h2Elements.eq(5), h2Elements.eq(6)];

	// Use zip to pair each element with the next element
	const pairedH2Elements = relevantH2Elements.map((h2, index) => [h2, relevantH2Elements[index + 1] || null]);

	// Use map to find the relevant sections and their images
	const imgBatches = pairedH2Elements.map(([h2, nextH2]) => extractImages(h2, nextH2));
	// Process images and save them in the respective folders
	for (const [folderName, imgBatch] of imgBatches) {
		for (const img of imgBatch) {
			await processImage(img, folderName);
		}
	}

	// Stop timing
	const stop = performance.now();
	const executionTime = (stop - start) / 1000;

	console.log(`Program Executed in ${executionTime} seconds`); // It returns time in seconds
}

extract().catch(console.error);
