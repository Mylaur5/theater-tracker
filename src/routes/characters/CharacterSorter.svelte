<script lang="ts">
	import { selectedGoodFile, pascalToNormalCase } from '../shared.js';
	import { onMount } from 'svelte';
	import { assets } from '$app/paths';
	import { get } from 'svelte/store';

	let { characterCell } = $props();

	type GoodFileData = {
		characters: Character[];
	};

	type Character = {
		key: string;
		level: number;
	};

	let seasonsData: any[] = $state([]);
	let charactersData: any[] = $state([]);

	let goodFileData: GoodFileData = $state({ characters: [] });
	let filteredGoodFileCharacters: Character[] = $state([]);

	let selectedSeason = $state({
		name: 'All Seasons',
		number: -1,
		alternate_cast_elements: [{ name: '' }],
		special_guest_stars: []
	});
	let selectedElement = $state('All Elements');
	let selectedOrder = $state('Element');

	let seasonFilters: any[] = $state([]);
	const elements = ['Pyro', 'Hydro', 'Electro', 'Dendro', 'Cryo', 'Geo', 'Anemo'];
	const elementFilters = ['All Elements', ...elements];
	const orders = ['Element', 'Level', 'A to Z'];
	function filterCharactersBySeason(seasonNumber: number) {
		if (seasonNumber === -1) {
			return filteredGoodFileCharacters;
		}

		const selectedSeasonData = seasonsData.filter((season) => season.number === seasonNumber)[0];
		const selectedSeasonElements = selectedSeasonData.alternate_cast_elements.map((element: any) => element.name);
		const charNames = charactersData
			.filter((char) => selectedSeasonElements.includes(char.element))
			.map((char) => char.name);
		const guestNames = selectedSeasonData.special_guest_stars.map((character: any) => character.name);
		return filteredGoodFileCharacters.filter(
			(character) =>
				charNames.includes(pascalToNormalCase(character.key)) || guestNames.includes(pascalToNormalCase(character.key))
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
			characterNamesWithElement.has(pascalToNormalCase(character.key))
		);
	}

	function getElement(character: string) {
		switch (character) {
			case 'TravelerAnemo':
				return 'Anemo';
			case 'TravelerGeo':
				return 'Geo';
			case 'TravelerElectro':
				return 'Electro';
			case 'TravelerDendro':
				return 'Dendro';
			case 'TravelerHydro':
				return 'Hydro';
			case 'TravelerCryo':
				return 'Cryo';
			case 'TravelerPyro':
				return 'Pyro';
			default:
				const characterData = charactersData.find((char) => char.name === pascalToNormalCase(character));
				return characterData ? characterData.element : '?';
		}
	}

	function updateFilters() {
		filteredGoodFileCharacters = goodFileData.characters;
		filteredGoodFileCharacters = filterCharactersBySeason(selectedSeason.number);
		filteredGoodFileCharacters = filterCharactersByElement(selectedElement);
		switch (selectedOrder) {
			case 'Level':
				filteredGoodFileCharacters.sort((a, b) => (a.level > b.level ? -1 : 1));
				break;
			case 'A to Z':
				filteredGoodFileCharacters.sort((a, b) => a.key.localeCompare(b.key));
				break;
			case 'Element':
				const alternate_cast_elements = selectedSeason.alternate_cast_elements.map((element: any) => element.name);
				const seasonElOrder = [
					...alternate_cast_elements,
					...selectedSeason.special_guest_stars
						.map((character: any) => character.element)
						.filter((el: string) => !alternate_cast_elements.includes(el))
				];
				const elementOrder = [...seasonElOrder, ...elements.filter((el) => !seasonElOrder.includes(el) && el !== '')];

				filteredGoodFileCharacters.sort((a, b) => {
					const indexA = elementOrder.indexOf(getElement(a.key));
					const indexB = elementOrder.indexOf(getElement(b.key));
					if (indexA === -1 && indexB === -1) {
						return 0; // Both elements are not in the reference list, maintain their order
					} else if (indexA === -1) {
						return 1; // Only 'a' is not in the reference list, 'b' comes first
					} else if (indexB === -1) {
						return -1; // Only 'b' is not in the reference list, 'a' comes first
					} else {
						return indexA - indexB; // Both elements are in the reference list, sort by their indices
					}
				});
				break;
		}
	}

	onMount(async () => {
		seasonsData = await fetch(`${assets}/data/seasons_data.json`)
			.then((response) => response.json())
			.catch((error) => console.error('Fetch error:', error));
		seasonFilters = [{ name: 'All Seasons', number: -1, alternate_cast_elements: [] }, ...seasonsData];

		charactersData = (
			await fetch(`${assets}/data/keqing_data.json`)
				.then((response) => response.json())
				.catch((error) => console.error('Fetch error:', error))
		).characters;

		if ($selectedGoodFile === '') return;
		goodFileData = JSON.parse(localStorage.getItem($selectedGoodFile) ?? '');
		filteredGoodFileCharacters = goodFileData.characters;
		updateFilters();
	});
</script>

{#snippet arrowDown()}
	<svg class="ms-2.5 h-2.5 w-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
		<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4" />
	</svg>
{/snippet}

<div class="flex gap-12">
	<div class="flex gap-4">
		<p class="flex items-center">Filter by</p>

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
											<img src="{assets}/images/elements/{element.toLowerCase()}.png" alt={element} class="mr-2 h-6" />
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

	<div class="flex gap-4">
		<p class="flex items-center">Order by</p>
		<form class="flex max-w-sm items-center justify-center gap-4">
			<div class="flex">
				<button
					popovertarget="dropdown-order"
					class="flex w-32 items-center justify-between rounded-md border border-gray-300 bg-gray-100 p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-700"
					type="button"
				>
					{selectedOrder}
					{@render arrowDown()}
				</button>
				<div
					id="dropdown-order"
					class="inset-auto z-10 w-32 divide-y divide-gray-100 rounded-md border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"
					popover
				>
					<ul class="text-sm text-gray-700 dark:text-gray-200" aria-labelledby="states-button">
						{#each orders as order}
							<li>
								<button
									type="button"
									class="inline-flex w-full rounded-md p-2 text-sm text-gray-700 hover:bg-white dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
									onclick={() => {
										selectedOrder = order;
										updateFilters();
									}}
									popovertarget="dropdown-order"
								>
									<div class="inline-flex items-center">{order}</div>
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</form>
	</div>

	<div class="flex items-center">
		{#each selectedSeason.alternate_cast_elements as element}
			<img src="{assets}/images/elements/{element.name.toLowerCase()}.png" alt={element.name} class="mx-1 h-6" />
		{/each}
	</div>
</div>
<ul class="max-w-(40vw) mt-2 flex flex-wrap justify-center overflow-scroll">
	{#each filteredGoodFileCharacters as character}
		<li>
			{@render characterCell(character.key, getElement(character.key), character.level)}
		</li>
	{/each}
</ul>
