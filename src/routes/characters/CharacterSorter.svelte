<script lang="ts">
	import { selectedGoodFile, pascalToNormalCase } from '../shared.js';
	import { onMount } from 'svelte';
	import { assets } from '$app/paths';

	let { characterCell } = $props();

	interface GoodFileData {
		characters: any[];
	}

	let seasonsData: any[] = $state([]);
	let charactersData: any[] = $state([]);

	let goodFileData: GoodFileData = $state({ characters: [] });
	let filteredGoodFileCharacters: string[] = $state([]);
	let selectedSeason = $state({ name: 'All Seasons', number: -1 });
	let selectedElement = $state('All Elements');
	let seasonFilters: any[] = $state([]);
	const elementFilters = ['All Elements', 'Pyro', 'Hydro', 'Electro', 'Dendro', 'Cryo', 'Geo', 'Anemo'];

	function filterCharactersBySeason(seasonNumber: number) {
		if (seasonNumber === -1) {
			return filteredGoodFileCharacters;
		}

		const selectedSeasonData = seasonsData.filter((season) => season.number === seasonNumber)[0];
		const selectedSeasonElements = selectedSeasonData.alternate_cast_elements.map((element: any) => element.name);
		const characterNamesWithElement = charactersData.filter((char) => selectedSeasonElements.includes(char.element)).map((char) => char.name)
		const charNamesInSeason = selectedSeasonData.special_guest_stars.map((character: any) => character.name);
		return filteredGoodFileCharacters.filter(
			(character) =>
				characterNamesWithElement.includes(pascalToNormalCase(character)) || charNamesInSeason.includes(character)
		);
	}

	function filterCharactersByElement(element: string) {
		if (element === 'All Elements') {
			return filteredGoodFileCharacters;
		}

		// Build a filter set of unique character names with the specified element
		const characterNamesWithElement = new Set(
			charactersData.filter((char) => char.element === element).map((char) => char.name)
		);

		return filteredGoodFileCharacters.filter((character) =>
			characterNamesWithElement.has(pascalToNormalCase(character))
		);
	}

	function getElement(character: string) {
		const characterData = charactersData.find((char) => char.name === character);
		return characterData ? characterData.element : '?';
	}

	function updateFilters() {
		filteredGoodFileCharacters = goodFileData.characters.map((character) => pascalToNormalCase(character.key));
		filteredGoodFileCharacters = filterCharactersBySeason(selectedSeason.number);
		filteredGoodFileCharacters = filterCharactersByElement(selectedElement);
	}

	onMount(async () => {
		seasonsData = await fetch(`${assets}/data/seasons_data.json`)
			.then((response) => response.json())
			.catch((error) => console.error('Fetch error:', error));
		seasonFilters = [{ name: 'All Seasons', number: -1 }, ...seasonsData];
		charactersData = seasonsData.flatMap((season) => [...season.opening_characters, ...season.special_guest_stars]);

		if ($selectedGoodFile === '') return;
		goodFileData = JSON.parse(localStorage.getItem($selectedGoodFile) ?? '');
		filteredGoodFileCharacters = goodFileData.characters.map((character) => pascalToNormalCase(character.key));
	});
</script>

{#snippet arrowDown()}
	<svg class="ms-2.5 h-2.5 w-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
		<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
	</svg>
{/snippet}

<div class="flex">
	<p class="me-4 flex items-center">Filter by</p>

	<form class="flex max-w-sm items-center justify-center gap-4">
		<div class="flex">
			<button
				popovertarget="dropdown-seasons"
				class="flex w-32 items-center justify-between rounded-md border border-gray-300 bg-gray-100 p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
				type="button"
			>
				{selectedSeason.name}
				{@render arrowDown()}
			</button>
			<div
				id="dropdown-seasons"
				class="inset-auto z-10 w-32 divide-y divide-gray-100 rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
				popover
			>
				<ul class="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="states-button">
					{#each seasonFilters as season}
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
				class="inline-flex w-36 items-center justify-between rounded-md border border-gray-300 bg-gray-100 p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
				type="button"
			>
				{selectedElement}
				{@render arrowDown()}
			</button>
			<div
				id="dropdown-elements"
				class="inset-auto z-10 w-36 divide-y divide-gray-100 rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
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
								<div class="inline-flex items-center">
									{#if element !== 'All Elements'}
										<img src="{assets}/images/elements/{element.toLowerCase()}.png" alt={element} class="mr-2 h-4" />
									{/if}
									{element}
								</div>
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
		<li>
			{@render characterCell(characterName, getElement(characterName))}
		</li>
	{/each}
</ul>
