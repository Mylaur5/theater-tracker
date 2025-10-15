import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { performance } from 'perf_hooks';

const BASE_URL = 'https://github.com';
const IMAGE_FOLDER = './static/images/';
const KEQING_DATA_FILE = './static/data/keqing_data.json';

async function scrape(section, url) {
	try {
		const data = [];
		const start = performance.now();
		const response = await axios.get(url);
		const html = response.data;
		const $ = cheerio.load(html);

		if (!fs.existsSync(IMAGE_FOLDER)) {
			fs.mkdirSync(IMAGE_FOLDER);
		}

		$('script[type="application/json"][data-target="react-app.embeddedData"]').each((i, elem) => {
			const jsonText = $(elem).html();
			if (jsonText) {
				const jsonData = JSON.parse(jsonText);
				const items = jsonData.payload.tree.items;

				// console.log(items);
				items.forEach((item) => {
					if (item.name.endsWith('.md')) {
						const charName = item.name.replace('.md', '').replace('-', '_');
						data.push(charName);
					}
				});
			}
		});

		return data;
	} catch (error) {
		console.error(`Error scraping ${section} from ${url}:`, error);
		return [];
	}
}

let data = {
	anemo: 'https://github.com/KQM-git/TCL/tree/master/docs/characters/anemo',
	geo: 'https://github.com/KQM-git/TCL/tree/master/docs/characters/geo',
	electro: 'https://github.com/KQM-git/TCL/tree/master/docs/characters/electro',
	hydro: 'https://github.com/KQM-git/TCL/tree/master/docs/characters/hydro',
	pyro: 'https://github.com/KQM-git/TCL/tree/master/docs/characters/pyro',
	cryo: 'https://github.com/KQM-git/TCL/tree/master/docs/characters/cryo',
	dendro: 'https://github.com/KQM-git/TCL/tree/master/docs/characters/dendro'
};
for (const [section, url] of Object.entries(data)) {
	data[section] = await scrape(section, url);
}

// console.log('Scraped data:', data.anemo);

// for each character in keqing_data.json, update their category based on the data scraped
const keqingData = JSON.parse(fs.readFileSync(KEQING_DATA_FILE, 'utf-8'));
for (const char of keqingData.characters) {
	for (const [section, chars] of Object.entries(data)) {
		if (chars.includes(char.name.replace('.png', ''))) {
			console.log(`${char.name}: ${section}`);
			char.element = section;
			break;
		}
	}
}
fs.writeFileSync(KEQING_DATA_FILE, JSON.stringify(keqingData, null, 2));
console.log('Keqing data updated with categories.');
