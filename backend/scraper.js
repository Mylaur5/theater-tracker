import axios from 'axios';
import * as cheerio from 'cheerio';

const URL_OFFICIAL = 'https://genshin-impact.fandom.com/wiki/Imaginarium_Theater/Seasons#Schedule';
const ELEMENTS_URL = '/images/elements/';
const CHARACTERS_URL = '/images/characters/';

async function extractSeasonDates(tr, season) {
	const tdDate = tr.find('td').first();
	season.name = tdDate.find('a').first().text();
	season.number = parseInt(season.name.split(' ')[1]);
	const textSplit = tdDate.find('small').text().split(' –');
	console.log('Found ' + season.name);

	season.date_start = textSplit[0].slice(0, -6);
	season.date_end = textSplit[1].slice(0, -6);
	season.version_start = textSplit[0].slice(-4, -1);
	season.version_end = textSplit[1].slice(-4, -1);
	const seasonStart = new Date(season.date_start);
	const now = new Date();
	const upcoming =
		seasonStart.getFullYear() > now.getFullYear() ||
		(seasonStart.getFullYear() === now.getFullYear() && seasonStart.getMonth() > now.getMonth());
	const current = seasonStart.getFullYear() === now.getFullYear() && seasonStart.getMonth() === now.getMonth();
	season.status = upcoming ? 'upcoming' : current ? 'current' : 'past';
	return season;
}

function extractImages(cardListContainer) {
	function getFileName(cardBody) {
		let name = cardBody.find('.card-image-container img').attr('alt').toLowerCase().replace(' ', '_') + '.png';
		if (name === 'kazuha.png') {
			name = 'kaedehara_kazuha.png';
		}
		return name;
	}

	return Array.from(
		cardListContainer.find('span.card-body').map((index, body) => {
			const cardBody = cheerio.load(body)(body);
			return {
				name: cardBody.find('.card-image-container img').attr('alt'),
				element: cardBody.find('.card-icon img').attr('alt'),
				image_local: CHARACTERS_URL + getFileName(cardBody),
				image_url: cardBody.find('.card-image-container img').attr('data-src')
			};
		})
	);
}

function extractElements(elements) {
	const L = [];
	for (let i = 0; i < 3; i++) {
		const img = elements.eq(i).find('img');
		L.push({
			name: img.attr('alt'),
			image_local: ELEMENTS_URL + img.attr('alt').toLowerCase().replace(' ', '_') + '.png',
			image_url: img.attr('data-src')
		});
	}
	return L;
}

export async function scrape() {
	console.log('Starting the scraping process...');
	const startTime = performance.now();

	const { data } = await axios.get(URL_OFFICIAL);
	const $ = cheerio.load(data);
	const page = $('div.mw-parser-output');
	const seasonsData = Array.from(page.find('tr').map((i, tr) => {
		const season = {};
		if (!$(tr).find('td').length) return;

		extractSeasonDates($(tr), season);

        const tdDetail = $(tr).find('td').eq(1);
        const opening = tdDetail.find('span.card-list-container').first();
        season.opening_characters = extractImages(opening);

        const elements = tdDetail.find('span.lightmode-drop-shadow');
        season.alternate_cast_elements = extractElements(elements);
        
        const specialGuest = tdDetail.find('span.card-list-container').eq(1);
        season.special_guest_stars = extractImages(specialGuest);

        return season
	}));

	const jsonData = JSON.stringify(seasonsData, null, 4);

	const endTime = performance.now();
	console.log(`Script execution time: ${(endTime - startTime) / 1000} seconds`);

	return jsonData;
}