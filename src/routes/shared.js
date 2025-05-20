// @ts-nocheck
import { writable } from 'svelte/store';

export let selectedGoodFile = writable('');

export function readStorage() {
	return Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
		.filter((key) => key.endsWith('.json'))
		.sort((a, b) => a.localeCompare(b));
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
		default:
			return str
				.split(' ')
				.map((word) => word.toLowerCase())
				.join('_');
	}
}
