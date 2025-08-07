// @ts-nocheck
import { writable } from 'svelte/store';

export let selectedGoodFile = writable('');

/**
 * Reads all keys from localStorage that end with '.json',
 * sorts them by their storedDate in descending order,
 * and returns an array of the sorted keys.
 *
 * @returns {string[]} An array of localStorage keys ending with '.json',
 * sorted by storedDate (newest first).
 */
export function readStorage() {
	return Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
		.filter((key) => key.endsWith('.json'))
		.sort((a, b) => {
			const dateA = JSON.parse(localStorage.getItem(a)).storedDate;
			const dateB = JSON.parse(localStorage.getItem(b)).storedDate;
			if (dateA && dateB) {
				return new Date(dateB) - new Date(dateA);
			}
		});
}

/**
 * Reads and parses a JSON file from localStorage and returns its `content` property.
 *
 * @param {string} fileName - The name of the file to read from localStorage.
 * @returns {*} The `content` property of the parsed file, or `null` if an error occurs or input is invalid.
 */
export function readGoodFile(fileName) {
	if (!fileName) {
		console.error('No file name provided:', fileName);
		return;
	}
	if (typeof fileName !== 'string') {
		console.error('File name is not a string:', fileName);
		return null;
	}

	try {
		const goodFile = JSON.parse(localStorage.getItem(fileName));
		return goodFile.content;
	} catch (error) {
		console.error(`Error reading or parsing file ${JSON.stringify(fileName)} from localStorage:`, error);
		return null;
	}
}

/**
 * Writes a JSON object to localStorage under the specified key.
 * Adds a storedDate property with the current ISO date string.
 *
 * @param {string} key - The key under which to store the object.
 * @param {*} content - The content to store (will be wrapped in an object).
 */
export function writeGoodFile(key, content) {
	if (!key || typeof key !== 'string') {
		console.error('Invalid key for localStorage:', key);
		return;
	}
	const data = {
		name: key,
		content,
		storedDate: new Date().toISOString()
	};
	try {
		localStorage.setItem(key, JSON.stringify(data));
	} catch (error) {
		console.error(`Error writing file ${JSON.stringify(key)} to localStorage:`, error);
	}
}

export function pascalToNormalCase(pascalStr) {
	let normalStr = pascalStr.replace(/([A-Z])/g, ' $1');
	normalStr = normalStr.charAt(0).toUpperCase() + normalStr.slice(1);
	return normalStr.trim();
}

export function pascalToSnakeCase(pascalStr) {
	switch (pascalStr) {
		case 'TravelerGeo':
			return 'aether_(geo)';
		case 'TravelerAnemo':
			return 'aether_(anemo)';
		case 'TravelerDendro':
			return 'aether_(dendro)';
		case 'TravelerElectro':
			return 'aether_(electro)';
		case 'TravelerHydro':
			return 'aether_(hydro)';
		case 'TravelerPyro':
			return 'aether_(pyro)';
		case 'TravelerCryo':
			return 'aether_(cryo)';
		default:
			return pascalStr
				.replace(/([a-z])([A-Z])/g, '$1_$2') // Insert an underscore before each uppercase letter that follows a lowercase letter
				.replace(/([A-Z])([A-Z][a-z])/g, '$1_$2') // Insert an underscore before each uppercase letter that follows another uppercase letter and is followed by a lowercase letter
				.toLowerCase(); // Convert the entire string to lowercase
	}
}

export function normalToPascalCase(normalStr) {
	if (normalStr === 'Kazuha') return 'KaedeharaKazuha';
	return normalStr
		.split(' ') // Split the string into words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
		.join(''); // Join the words back together without spaces
}

export function normalToSnakeCase(str) {
	switch (str) {
		case 'Traveler Geo':
			return 'aether_(geo)';
		case 'Traveler Anemo':
			return 'aether_(anemo)';
		case 'Kazuha':
			return 'kaedehara_kazuha';
		default:
			return str
				.split(' ')
				.map((word) => word.toLowerCase())
				.join('_');
	}
}
