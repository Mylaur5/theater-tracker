// @ts-nocheck
import { writable } from 'svelte/store';

export let selectedGoodFile = writable('');

export function readStorage() {
	return Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i)).filter((key) =>
		key.endsWith('.json')
	);
}

export function pascalToNormalCase(pascalStr) {
	let normalStr = pascalStr.replace(/([A-Z])/g, ' $1');
	normalStr = normalStr.charAt(0).toUpperCase() + normalStr.slice(1);
	return normalStr.trim();
}

export function normalToPascalCase(normalStr) {
	if (normalStr === 'Kazuha') return 'KaedeharaKazuha';
	return normalStr
		.split(' ') // Split the string into words
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
		.join(''); // Join the words back together without spaces
}

export function normalToSnakeCase(str) {
	if (str === 'Traveler Geo') return 'aether_(geo)';
	return str
		.split(' ') // Split the string by spaces
		.map((word) => word.toLowerCase()) // Convert each word to lowercase
		.join('_'); // Join the words with underscores
}
