<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { selectedFile } from '../shared.js';

	let filteredGoodFileCharacters = $state([]);
	let seasonsData = $state([]);
	let goodFileData = $state({});
	let selectedSeason = $state({ name: 'All Seasons', number: -1 });
	let selectedElement = $state('All Elements');
	let seasonFilters = ['All Seasons'];
	let elementFilters = ['All Elements', 'Pyro', 'Hydro', 'Electro', 'Dendro', 'Cryo', 'Geo', 'Anemo'];

	async function betterFetch(url) {
		return fetch(url)
			.then((seasonsResponse) => seasonsResponse.json())
			.catch((error) => {
				console.error('Fetch error:', error);
			});
	}

	function filterCharactersBySeason(seasonNumber) {
		if (seasonNumber === -1) {
			return filteredGoodFileCharacters;
		}

		const selectedSeasonData = seasonsData.filter((season) => season.number === seasonNumber)[0];
		const allCharacters = [...selectedSeasonData.opening_characters, ...selectedSeasonData.special_guest_stars];
		const charNamesInSeason = allCharacters.map((character) => character.name);
		return filteredGoodFileCharacters.filter((character) => charNamesInSeason.includes(character.key));
	}

	function filterCharactersByElement(element) {
		if (element === 'All Elements') {
			return filteredGoodFileCharacters;
		}

		// Build a filter set of unique character names with the specified element
		const characterNamesWithElement = new Set(
			seasonsData
				.flatMap((season) => [...season.opening_characters, ...season.special_guest_stars])
				.filter((char) => char.element === element)
				.map((char) => char.name)
		);

		return filteredGoodFileCharacters.filter((character) =>
			characterNamesWithElement.has(pascalToNormalCase(character.key))
		);
	}

	function updateFilters() {
		filteredGoodFileCharacters = goodFileData.characters;
		filteredGoodFileCharacters = filterCharactersBySeason(selectedSeason.number);
		filteredGoodFileCharacters = filterCharactersByElement(selectedElement);
		filteredGoodFileCharacters = filteredGoodFileCharacters.map((character) => pascalToNormalCase(character.key));
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
		seasonsData = await betterFetch('http://localhost:5000/seasons');

		if ($selectedFile === '') return;
		goodFileData = await betterFetch('http://localhost:5000/uploads/' + $selectedFile);
		filteredGoodFileCharacters = goodFileData.characters.map((character) => pascalToNormalCase(character.key));
	});
</script>

<h1 class="text-center text-4xl font-bold">Characters</h1>

{#if $selectedFile}
	<h3 class="mb-2 text-center text-sm">
		imported from: <code class="font-bold">`{$selectedFile}`</code>
	</h3>

	<div class="flex">
		<p class="me-4 flex items-center">Filter by</p>

		<form class="flex max-w-sm items-center justify-center gap-4">
			<div class="flex">
				<button
					id="states-button"
					popovertarget="dropdown-seasons"
					class="inline-flex shrink-0 items-center rounded-md border border-gray-300 bg-gray-100 p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
					type="button"
				>
					{selectedSeason.name}
					<svg
						class="ms-2.5 h-2.5 w-2.5"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 10 6"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 1 4 4 4-4"
						/>
					</svg>
				</button>
				<div
					id="dropdown-seasons"
					class="inset-auto z-10 w-32 divide-y divide-gray-100 rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
					popover
				>
					<ul class="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="states-button">
						{#each [{ name: 'All Seasons', number: -1 }, ...seasonsData] as season}
							<li>
								<button
									type="button"
									class="inline-flex w-full rounded-md p-2 text-sm text-gray-700 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
									onclick={() => {
										selectedSeason = season;
										updateFilters();
									}}
									popovertarget="dropdown-seasons"
								>
									<div class="inline-flex items-center">{season.name}</div>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>

			<div class="flex">
				<button
					id="states-button"
					popovertarget="dropdown-elements"
					class="inline-flex shrink-0 items-center rounded-md border border-gray-300 bg-gray-100 p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
					type="button"
				>
					{selectedElement}
					<svg
						class="ms-2.5 h-2.5 w-2.5"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 10 6"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m1 1 4 4 4-4"
						/>
					</svg>
				</button>
				<div
					id="dropdown-elements"
					class="inset-auto z-10 w-32 divide-y divide-gray-100 rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
					popover
				>
					<ul class="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="states-button">
						{#each elementFilters as element}
							<li>
								<button
									type="button"
									class="inline-flex w-full rounded-md p-2 text-sm text-gray-700 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
									onclick={() => {
										selectedElement = element;
										updateFilters();
									}}
									popovertarget="dropdown-elements"
								>
									<div class="inline-flex items-center">{element}</div>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</form>
	</div>

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
{:else}
	<div class="my-auto flex items-center justify-center">
		<h3 class="mb-2 text-center">
			Please select a file in the '<strong>Upload</strong>' tab.
		</h3>
	</div>
{/if}
