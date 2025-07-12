<script lang="ts">
	import { normalToSnakeCase, normalToPascalCase, pascalToNormalCase, pascalToSnakeCase } from './shared.js';
	import { onMount } from 'svelte';
	import { assets, base } from '$app/paths';
	import { characterCell } from './characters/+page.svelte';

	let seasonsData: any[] = $state([]);
	let currentSeasonNumber = $state(1);

	function capitalize(str: string) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	function nextSeason() {
		if (currentSeasonNumber < seasonsData.length) {
			currentSeasonNumber++;
		}
	}

	function prevSeason() {
		if (currentSeasonNumber > 1) {
			currentSeasonNumber--;
		}
	}

	function getSeasonStatus(season: any) {
		const seasonStart = new Date(season.date_start);
		const now = new Date();
		const upcoming =
			seasonStart.getFullYear() > now.getFullYear() ||
			(seasonStart.getFullYear() === now.getFullYear() && seasonStart.getMonth() > now.getMonth());
		const current = seasonStart.getFullYear() === now.getFullYear() && seasonStart.getMonth() === now.getMonth();
		return upcoming ? 'upcoming' : current ? 'current' : 'past';
	}

	// async function refreshData() {
	// 	notify = true;
	// 	notificationMessage = 'Refreshing...';
	// 	fetchSeasonsData();
	// 	notificationMessage = 'Refresh complete!';

	// 	// Hide the notification after 5 seconds
	// 	setTimeout(() => {
	// 		notify = false;
	// 	}, 5000);
	// }

	async function fetchSeasonsData() {
		// Fetch seasons data
		seasonsData = await fetch(`${assets}/data/seasons_data.json`)
			.then((seasonsResponse) => {
				if (!seasonsResponse.ok) throw new Error('Network response was not ok');
				return seasonsResponse.json();
			})
			.catch((error) => {
				console.error('Fetch error:', error);
			});

		// Find the current season or returns 1
		seasonsData.forEach((season) => {
			if (getSeasonStatus(season) === 'current') {
				currentSeasonNumber = season.number;
			}
		});
	}

	onMount(async () => {
		fetchSeasonsData();
	});

	const navUI = [
		{
			onclick: prevSeason,
			label: 'Previous',
			iconSVG: `<svg
				class="h-6 w-6"
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px" 
				fill="currentColor">
					<path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
				</svg>`
		},
		{
			onclick: () => {
				window.open('https://github.com/Mylaur5/theater-tracker/actions/workflows/deploy-gh-pages.yml', '_blank');
			},
			label: 'Refresh',
			iconSVG: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
				<path
					d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"
				/>
			</svg>`
		},
		{
			onclick: nextSeason,
			label: 'Next',
			iconSVG: `<svg
				class="h-6 w-6"
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 -960 960 960"
				width="24px"
				fill="currentColor">
					<path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
				</svg>`
		}
	];
</script>

<div class="flex items-center justify-center">
	<nav class="bg-gray-5 flex items-center justify-center space-x-4 rounded dark:bg-indigo-900">
		{#each navUI as nav}
			<button
				onclick={nav.onclick}
				class="gray flex gap-1 rounded p-1 px-2 hover:bg-gray-200 dark:hover:bg-indigo-800"
				aria-label={nav.label}
			>
				{@html nav.iconSVG}
				{nav.label}
			</button>
		{/each}
	</nav>
</div>

{#await seasonsData}
	<p class="text-center text-2xl font-bold">Loading...</p>
{:then}
	{#each seasonsData as season}
		<div class:hidden={season.number !== currentSeasonNumber} class="mt-4 overflow-auto">
			<h2 class="text-center text-3xl font-bold">
				{season.name}
				{#if getSeasonStatus(season) !== 'past'}
					({capitalize(getSeasonStatus(season))})
				{/if}
			</h2>
			<p class="mt-1 text-center">
				{season.date_start} ({season.version_start}) - {season.date_end} ({season.version_end})
			</p>

			{#if season.alternate_cast_elements.length > 0}
				<h3 class="mt-4 text-center text-xl font-bold">Alternate Cast Elements</h3>
				<div class="mt-1 flex items-center justify-center space-x-4">
					{#each season.alternate_cast_elements as element}
						<img
							src="{assets}/images/elements/{element.name.toLowerCase()}.png"
							class="max-w-8 object-cover transition-transform hover:scale-105"
							alt={element.name}
							title={element.name}
						/>
					{/each}
				</div>
			{/if}

			{#if season.opening_characters.length > 0}
				<h3 class="mt-4 text-center text-xl font-bold">Opening Characters:</h3>
				<div class="mt-1 flex items-start justify-center space-x-4">
					{#each season.opening_characters as character}
						{@render characterCell(normalToPascalCase(character.name), character.element)}
					{/each}
				</div>
			{/if}

			{#if season.special_guest_stars.length > 0}
				<h3 class="mt-4 text-center text-xl font-bold">Special Guest Stars:</h3>
				<div class="mt-t flex items-start justify-center space-x-4">
					{#each season.special_guest_stars as character}
						{@render characterCell(normalToPascalCase(character.name), character.element)}
					{/each}
				</div>
			{/if}
		</div>
	{/each}
{/await}
