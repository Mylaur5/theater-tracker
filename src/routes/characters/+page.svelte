<script lang="ts">
	import { selectedGoodFile, normalToSnakeCase, normalToPascalCase, readStorage } from '../shared.js';
	import CharacterSorter from './CharacterSorter.svelte';
	import { assets, base } from '$app/paths';
	import { onMount } from 'svelte';

	let character: string = $state('');
	let charactersData: any[] = $state([]);
	onMount(async () => {
		charactersData = await fetch(`${assets}/data/seasons_data.json`)
			.then((response) => response.json())
			.then((data) => data.flatMap((season: any) => [...season.opening_characters, ...season.special_guest_stars]))
			.catch((error) => console.error('Fetch error:', error));
		
		if ($selectedGoodFile === '') {
			$selectedGoodFile = readStorage().at(-1) ?? '';
		}
	});
</script>

<h1 class="text-center text-4xl font-bold">Characters</h1>

{#if $selectedGoodFile}
	<h3 class="mb-2 text-center text-sm">
		imported from: <code class="font-bold">`{$selectedGoodFile}`</code>
	</h3>
	<CharacterSorter>
		{#snippet characterCell(characterName: string, element: string)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<a
				class="m-2 flex max-w-28 flex-col items-center justify-start transition-transform hover:scale-105"
				onclick={() => (character = characterName)}
				href="{base}/characters/{normalToPascalCase(characterName)}"
			>
				<img
					src="{assets}/images/elements/{normalToSnakeCase(element)}.png"
					class=" relative left-12 top-4 max-w-6 object-cover transition-transform hover:scale-105"
					alt={element}
					title={element}
				/>
				<img
					src="{assets}/images/characters/{normalToSnakeCase(characterName)}.png"
					class="break-before-all text-wrap object-cover"
					alt={characterName}
					title={characterName}
				/>
				<p class="break-before-auto text-center">{characterName}</p>
			</a>
		{/snippet}
	</CharacterSorter>
{:else}
	<div class="my-auto flex items-center justify-center">
		<h3 class="mb-2 text-center">
			Please select a file in the '<strong>Files</strong>' tab.
		</h3>
	</div>
{/if}
