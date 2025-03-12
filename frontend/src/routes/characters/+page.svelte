<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { selectedFile } from '../shared.js';

	let filteredGoodFileCharacters = $state({});
	let currentSeasonCharacters = $state([]);
	let currentSeasonNumber = $state(0);

	async function betterFetch(url) {
		return fetch(url)
			.then((seasonsResponse) => seasonsResponse.json())
			.catch((error) => {
				console.error('Fetch error:', error);
			});
	}

	function normalToSnakeCase(str) {
		if (str === 'Traveler Geo') return 'aether_(geo)';
		return str
			.split(' ') // Split the string by spaces
			.map((word) => word.toLowerCase()) // Convert each word to lowercase
			.join('_'); // Join the words with underscores
	}

	function pascalToNormalCase(pascalStr) {
		let normalStr = pascalStr.replace(/([A-Z])/g, ' $1');
		normalStr = normalStr.charAt(0).toUpperCase() + normalStr.slice(1);
		return normalStr.trim();
	}

	onMount(async () => {
		const seasonsData = await betterFetch('http://localhost:5000/seasons')
		const currentSeasonData = seasonsData.filter((season) => season.status === 'current')[0];
		const charactersData = [...currentSeasonData.opening_characters, ...currentSeasonData.special_guest_stars];
		currentSeasonNumber = currentSeasonData.number;
		currentSeasonCharacters = charactersData.map((character) => character.name);

		if ($selectedFile === '') return;
		const goodFileData = await betterFetch('http://localhost:5000/uploads/' + $selectedFile)
		filteredGoodFileCharacters = goodFileData.characters
			.filter((character) => currentSeasonCharacters.includes(character.key))
			.map((character) => pascalToNormalCase(character.key));
	});
</script>

<h1 class="text-center text-4xl font-bold">Characters</h1>

{#if $selectedFile}
	<h3 class="mb-2 text-center">
		Characters of season {currentSeasonNumber} from: <code class="font-bold">`{$selectedFile}`</code>
	</h3>
{:else}
	<h3 class="mb-2 text-center">
		Please select a file in the '<strong>Upload</strong>' tab.
	</h3>
{/if}

<ul class="max-w-(40vw) mt-2 flex flex-wrap justify-center overflow-scroll">
	{#each filteredGoodFileCharacters as characterName}
		<li class="m-2 flex flex-col items-center justify-center">
			<img
				src={`http://localhost:5000/images/characters/${normalToSnakeCase(characterName)}.png`}
				class="h-28 w-28 break-before-all text-wrap object-cover"
				alt={characterName}
				title={characterName}
			/>
			<p class="max-w-28 break-before-auto text-center">{characterName}</p>
		</li>
	{/each}
</ul>
