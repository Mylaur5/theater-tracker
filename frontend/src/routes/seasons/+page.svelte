<script lang="ts">
	import { onMount } from 'svelte';

	let seasonsData: string | any[] = $state([]);
	let currentSeasonNumber = $state(0);
	let prevIcon = $state('/icons/arrow_back_24.png');
	let nextIcon = $state('/icons/arrow_back_24_white.png');

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

	onMount(async () => {
		// Fetch seasons data
		seasonsData = await fetch('http://localhost:5000/seasons')
			.then((seasonsResponse) => {
				if (!seasonsResponse.ok) throw new Error('Network response was not ok');
				return seasonsResponse.json();
			})
			.catch((error) => {
				console.error('Fetch error:', error);
			});

		// Find the current season
		for (let i = 0; i < seasonsData.length; i++) {
			if (seasonsData[i].status === 'current') {
				currentSeasonNumber = seasonsData[i].number;
				console.log(currentSeasonNumber);
				break;
			}
		}
	});

	$effect(() => {
		if (localStorage.theme === 'dark') {
			prevIcon = '/icons/arrow_back_24_white.png';
			nextIcon = '/icons/arrow_forward_24_white.png';
		} else {
			prevIcon = '/icons/arrow_back_24.png';
			nextIcon = '/icons/arrow_forward_24.png';
		}
	});
</script>

<div class="flex items-center justify-center space-x-4 pb-4">
	<button class="rounded-full gray hover:bg-indigo-500" onclick={prevSeason}>
		<img src={prevIcon} class="h-6 w-6" alt="Previous" />
	</button>
	<span class="text-4xl font-bold">Seasons</span>
	<button class="rounded-full font-bold hover:bg-indigo-500" onclick={nextSeason}>
		<img src={nextIcon} class="h-6 w-6" alt="Next" />
	</button>
</div>
{#if seasonsData.length !== 0}
	{#each seasonsData as season}
		<div class:hidden={season.number !== currentSeasonNumber} class="mt-8">
			<h2 class="text-center text-2xl font-bold">
				{season.name}
				{#if season.status !=="past"}
					({capitalize(season.status)})
				{/if}
				</h2>
			<p class="mt-1 text-center">
				{season.date_start} ({season.version_start}) - {season.date_end} ({season.version_end})
			</p>

			{#if season.alternate_cast_elements.length > 0}
				<h3 class="mt-8 text-center text-2xl font-bold">Alternate Cast Elements</h3>
			{/if}
			<div class="mt-4 flex items-center justify-center space-x-4">F
				{#each season.alternate_cast_elements as element}
					<img src={`http://localhost:5000${element.image_local}`} class="h-8 w-8 object-cover"
						 alt={element.name} title={element.name}/>
				{/each}
			</div>

			{#if season.opening_characters.length > 0}
				<h3 class="mt-8 text-center text-2xl font-bold">Opening Characters:</h3>
			{/if}
			<div class="mt-4 flex items-start justify-center space-x-4">
				{#each season.opening_characters as character}
					<div class="flex flex-col items-center justify-center">
						<img
							src={`http://localhost:5000${character.image_local}`}
							alt={character.name}
							class="h-16 w-16 object-cover"
						/>
						<p class="text-center break-before-auto max-w-20">{character.name}</p>
					</div>
				{/each}
			</div>

			{#if season.special_guest_stars.length > 0}
				<h3 class="mt-8 text-center text-2xl font-bold">Special Guest Stars:</h3>
			{/if}
			<div class="mt-4 flex items-center justify-center space-x-4">
				{#each season.special_guest_stars as character}
					<div class="flex flex-col items-center justify-center">
						<img
							src={`http://localhost:5000${character.image_local}`}
							alt={character.name}
							class="h-16 w-16 object-cover"
						/>
						<p class="break-words">{character.name}</p>
					</div>
				{/each}
			</div>
		</div>
	{/each}
{/if}