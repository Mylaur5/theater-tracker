<script lang="ts">
	import { onMount } from 'svelte';
	import Notification from '../Notification.svelte';

	let seasonsData: any[] = $state([]);
	let currentSeasonNumber = $state(1);
	let notify = $state(false);
	let notificationMessage = $state('');

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

	async function refreshData() {
		notify = true;
		notificationMessage = 'Refreshing...';
		await fetch('http://localhost:5000/seasons', { method: 'PUT' })
			.then((response) => response.json())
			.catch((error) => {
				console.error('Fetch error:', error);
			});
		fetchSeasonsData();
		notificationMessage = 'Refresh complete!';

		// Hide the notification after 5 seconds
		setTimeout(() => {
			notify = false;
		}, 5000);
	}

	async function fetchSeasonsData() {
		// Fetch seasons data
		seasonsData = await fetch('http://localhost:5000/seasons')
			.then((seasonsResponse) => {
				if (!seasonsResponse.ok) throw new Error('Network response was not ok');
				return seasonsResponse.json();
			})
			.catch((error) => {
				console.error('Fetch error:', error);
			});

		// Find the current season or returns 1
		currentSeasonNumber = seasonsData.find((season) => season.status === 'current')?.number ?? 1;
	}

	onMount(async () => {
		fetchSeasonsData();
	});
</script>

<nav class="flex items-center justify-center space-x-4">
	<button onclick={prevSeason} class="gray flex gap-1 rounded-full p-1 hover:bg-indigo-500" aria-label="Previous">
		<svg
			class="h-6 w-6"
			xmlns="http://www.w3.org/2000/svg"
			height="24px"
			viewBox="0 -960 960 960"
			width="24px"
			fill="currentColor"><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" /></svg
		>
		Previous
	</button>
	<button onclick={refreshData} class="flex gap-1 rounded-full p-1 font-bold hover:bg-indigo-500">
		<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
			<path
				d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"
			/>
		</svg>
		Refresh
	</button>
	<button onclick={nextSeason} class="flex gap-1 rounded-full p-1 font-bold hover:bg-indigo-500" aria-label="Next">
		<svg
			class="h-6 w-6"
			xmlns="http://www.w3.org/2000/svg"
			height="24px"
			viewBox="0 -960 960 960"
			width="24px"
			fill="currentColor"><path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" /></svg
		>
		Next
	</button>
</nav>

<!-- Notification Component -->
<Notification message={notificationMessage} show={notify} />

{#if seasonsData.length !== 0}
	{#each seasonsData as season}
		<div class:hidden={season.number !== currentSeasonNumber} class="mt-4 overflow-auto">
			<h2 class="text-center text-3xl font-bold">
				{season.name}
				{#if season.status !== 'past'}
					({capitalize(season.status)})
				{/if}
			</h2>
			<p class="mt-1 text-center">
				{season.date_start} ({season.version_start}) - {season.date_end} ({season.version_end})
			</p>

			{#if season.alternate_cast_elements.length > 0}
				<h3 class="mt-4 text-center text-xl font-bold">Alternate Cast Elements</h3>
			{/if}
			<div class="mt-1 flex items-center justify-center space-x-4">
				{#each season.alternate_cast_elements as element}
					<img
						src={`http://localhost:5000${element.image_local}`}
						class="h-8 w-8 object-cover"
						alt={element.name}
						title={element.name}
					/>
				{/each}
			</div>

			{#if season.opening_characters.length > 0}
				<h3 class="mt-4 text-center text-xl font-bold">Opening Characters:</h3>
			{/if}
			<div class="mt-1 flex items-start justify-center space-x-4">
				{#each season.opening_characters as character}
					<div class="flex flex-col items-center justify-center">
						<img
							src={`http://localhost:5000${character.image_local}`}
							alt={character.name}
							class="h-28 w-28 object-cover"
						/>
						<p class="max-w-28 break-normal text-center">{character.name}</p>
					</div>
				{/each}
			</div>

			{#if season.special_guest_stars.length > 0}
				<h3 class="mt-4 text-center text-xl font-bold">Special Guest Stars:</h3>
			{/if}
			<div class="mt-t flex items-start justify-center space-x-4">
				{#each season.special_guest_stars as character}
					<div class="flex flex-col items-center justify-center">
						<img
							src={`http://localhost:5000${character.image_local}`}
							alt={character.name}
							class="h-28 w-28 object-cover"
						/>
						<p class="max-w-28 break-normal text-center">{character.name}</p>
					</div>
				{/each}
			</div>
		</div>
	{/each}
{/if}
