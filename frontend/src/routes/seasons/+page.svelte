<script lang="ts">
	import { onMount } from 'svelte';

	let seasonsData = [];
	let imagesData = [];

	onMount(async () => {
		try {
			// Fetch seasons data
			const seasonsResponse = await fetch('http://localhost:5000/seasons');
			if (!seasonsResponse.ok) {
				throw new Error('Network response was not ok');
			}
			seasonsData = await seasonsResponse.json();

			// Fetch images data
			const imagesResponse = await fetch('http://localhost:5000/images');
			if (!imagesResponse.ok) {
				throw new Error('Network response was not ok');
			}
			imagesData = await imagesResponse.json();
		} catch (error) {
			console.error('Fetch error:', error);
		}
	});
</script>

<div><h1 class="text-center text-4xl font-bold">Seasons</h1></div>
<div>
	{#if seasonsData.length === 0}
		<p>Loading...</p>
	{:else}
		{#each seasonsData as season}
			<div class="season mb-8">
				<h2 class="text-center text-2xl font-bold">{season.season_name}</h2>
				{#if season.season_number}
					<h2 class="text-1xl mt-1 text-center font-bold">{season.season_number}</h2>
					<p class="mt-1 text-center">{season.version_info} - {season.date_info.join(' ')}</p>

					<h3 class="mt-8 text-center text-2xl font-bold">Alternate Cast Elements</h3>
					<div class="mt-4 flex items-center justify-center space-x-4">
						{#each season.alternate_cast_elements as element}
							<img
								src={`http://localhost:5000${element.image_local}`}
								class="h-16 w-16 object-cover"
								alt={'element.name'}
							/>
						{/each}
					</div>
					<h3 class="mt-8 text-center text-2xl font-bold">Opening Characters:</h3>
					<div class="mt-4 flex items-center justify-center space-x-4">
						{#each season.opening_characters as character}
							<div class="text-center">
								<img
									src={`http://localhost:5000${character.image_local}`}
									alt={character.name}
									class="h-32 w-32 object-cover"
								/>
								<p>{character.name}</p>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	{/if}
</div>
