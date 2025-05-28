<script module>
	export { characterCell };
</script>

<script lang="ts">
	import {
		selectedGoodFile,
		normalToSnakeCase,
		readStorage,
		pascalToSnakeCase,
		pascalToNormalCase
	} from '../shared.js';
	import CharacterSorter from './CharacterSorter.svelte';
	import { assets, base } from '$app/paths';
	import { onMount } from 'svelte';

	let charactersData: any[] = $state([]);

	onMount(async () => {
		charactersData = await fetch(`${assets}/data/keqing_data.json`)
			.then((response) => response.json())
			.then((response) => response.characters)
			.catch((error) => console.error('Fetch error:', error));
	});
</script>

{#snippet characterCell(characterName: string, element: string = '?', level: number = -1, ready: boolean = false)}
	<a
		class="m-2 flex max-w-28 flex-col items-center justify-start transition-transform hover:scale-105"
		href="{base}/characters/{characterName}"
	>
		<div class="flex">
			{#if element === '?'}
				<p
					class="relative left-12 top-6 max-w-6 object-cover transition-transform hover:scale-105"
					title="Unknown Element"
				>
					?
				</p>
			{:else}
				<div class="relative left-12 top-6 max-w-6 transition-transform hover:scale-105">
					<img
						src="{assets}/images/elements/{normalToSnakeCase(element)}.png"
						class="object-cover"
						alt={element}
						title={element}
					/>
				</div>
			{/if}
			{#if level != -1}
				<p
					class="relative left-9 top-[7.75rem] text-center text-xs font-bold text-green-300"
					style="text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black;"
					title="Level {level}"
				>
					{level}
				</p>
			{/if}
		</div>
		<img
			src="{assets}/images/characters/{pascalToSnakeCase(characterName)}.png"
			class="break-before-all text-wrap rounded-md object-cover {ready ? level >= 70 ? "bg-green-300" : "bg-orange-300" : ""}"
			alt={characterName}
			title={characterName}
		/>
		<p class="break-before-auto text-center">{pascalToNormalCase(characterName)}</p>
	</a>
{/snippet}

<h1 class="text-center text-4xl font-bold">Characters</h1>

{#if $selectedGoodFile.length > 0}
	<h3 class="mb-2 text-center text-sm">
		imported from: <code class="font-bold">`{$selectedGoodFile}`</code>
	</h3>
	<CharacterSorter {characterCell} />
{:else}
	<div class="my-auto flex items-center justify-center">
		<h3 class="mb-2 text-center">
			Please select a file in the '<strong>Files</strong>' tab.
		</h3>
	</div>
{/if}
