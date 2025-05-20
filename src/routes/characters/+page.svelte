<script lang="ts">
	import {
		selectedGoodFile,
		normalToSnakeCase,
		readStorage,
		pascalToSnakeCase,
		pascalToNormalCase
	} from '../shared.js';
	import CharacterSorter from './CharacterSorter.svelte';
	import Notification from '../Notification.svelte';
	import { assets, base } from '$app/paths';
	import { onMount } from 'svelte';

	let character: string = $state('');
	let charactersData: any[] = $state([]);
	let notify = $state(false);
	let notificationMessage = $state('');
	onMount(async () => {
		charactersData = await fetch(`${assets}/data/keqing_data.json`)
			.then((response) => response.json())
			.then((response) => response.characters)
			.catch((error) => console.error('Fetch error:', error));

		const uploadsData = readStorage();
		if (uploadsData.length === 0 && $selectedGoodFile === '') {
			notify = true;
			notificationMessage = "⚠️ No GOOD file found.<br>Please go to the 'Files' tab a GOOD file.";
		} else if (uploadsData.length > 0 && $selectedGoodFile === '') {
			$selectedGoodFile = uploadsData.at(-1) ?? '';
		}
	});
</script>

<h1 class="text-center text-4xl font-bold">Characters</h1>

<!-- Notification Component -->
{#if $selectedGoodFile.length > 0}
	<h3 class="mb-2 text-center text-sm">
		imported from: <code class="font-bold">`{$selectedGoodFile}`</code>
	</h3>
	<CharacterSorter>
		{#snippet characterCell(characterName: string, element: string, level: number)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<a
				class="m-2 flex max-w-28 flex-col items-center justify-start transition-transform hover:scale-105"
				onclick={() => (character = characterName)}
				href="{base}/characters/{characterName}"
			>
				{#if element === '?'}
					<p
						class="relative left-12 top-10 max-w-6 object-cover transition-transform hover:scale-105"
						title="Unknown Element"
					>
						?
					</p>
				{:else}
					<div class="relative left-12 top-10 max-w-6 transition-transform hover:scale-105">
						<img
							src="{assets}/images/elements/{normalToSnakeCase(element)}.png"
							class="object-cover"
							alt={element}
							title={element}
						/>
						<p
							class=""
							title="Level {level}"
						>
							{level}
						</p>
					</div>
				{/if}
				<img
					src="{assets}/images/characters/{pascalToSnakeCase(characterName)}.png"
					class="break-before-all text-wrap object-cover"
					alt={characterName}
					title={characterName}
				/>
				<p class="break-before-auto text-center">{pascalToNormalCase(characterName)}</p>
			</a>
		{/snippet}
	</CharacterSorter>
{:else}
	<Notification message={notificationMessage} show={notify} />
	<div class="my-auto flex items-center justify-center">
		<h3 class="mb-2 text-center">
			Please select a file in the '<strong>Files</strong>' tab.
		</h3>
	</div>
{/if}
