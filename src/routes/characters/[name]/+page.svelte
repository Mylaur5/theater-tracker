<script>
	import { onMount } from 'svelte';
	import { assets } from '$app/paths';
	import {
		selectedGoodFile,
		normalToSnakeCase,
		pascalToNormalCase,
		normalToPascalCase,
		readGoodFile
	} from '../../shared.js';
	let { data } = $props();
	let characterName = $derived(data.name);
	let element = $state('');
	let characterData = $state();

	onMount(async () => {
		// Find matching element from seasons_data.json
		switch (characterName) {
			case 'TravelerAnemo':
				element = 'Anemo';
				break;
			case 'TravelerGeo':
				element = 'Geo';
				break;
			case 'TravelerElectro':
				element = 'Electro';
				break;
			case 'TravelerDendro':
				element = 'Dendro';
				break;
			case 'TravelerHydro':
				element = 'Hydro';
				break;
			case 'TravelerCryo':
				element = 'Cryo';
				break;
			case 'TravelerPyro':
				element = 'Pyro';
				break;
			default:
				element = await fetch(`${assets}/data/keqing_data.json`)
					.then((response) => response.json().then((response) => response.characters))
					.then((allChars) => allChars.find((/** @type {{ name: any; }} */ char) => normalToPascalCase(char.name) === characterName))
					.then((char) => char.element)
					.catch((error) => console.error('Fetch error:', error));
		}

		if ($selectedGoodFile === '') return;
		const goodFileData = readGoodFile($selectedGoodFile);
		characterData = goodFileData.characters.find((/** @type {{ key: string; }} */ char) => char.key === characterName);
	});
</script>

<h1 class="mb-4 text-center text-4xl font-bold">{pascalToNormalCase(characterName)}</h1>

{#if $selectedGoodFile.length > 0}
	<h3 class="mb-2 text-center text-sm">
		imported from: <code class="font-bold">`{$selectedGoodFile}`</code>
	</h3>
{/if}

<div class="flex flex-col md:flex-row items-center justify-center gap-8">
	<div class="flex flex-col items-center justify-center gap-4">
		<p class="flex items-center gap-2 text-xl font-bold">
			{#await element}
				Loading element...
			{:then element}
				<img
					src="{assets}/images/elements/{element.toLowerCase()}.png"
					class="w-7 break-before-all text-wrap object-cover"
					alt={element}
					title={element}
				/>
				{element}
			{/await}
		</p>
		<img
			src="{assets}/images/characters/{normalToSnakeCase(pascalToNormalCase(characterName))}.png"
			class="w-40 break-before-all text-wrap object-cover"
			alt={characterName}
			title={characterName}
		/>
	</div>
	<div class="flex h-full flex-col justify-evenly">
		{#if !characterData}
			<h2 class="text-xl font-bold break-before-all">Character Data Not Found...</h2>
		{:else if $selectedGoodFile !== ''}
			<h2 class="text-xl font-bold text-green-500">Level {characterData.level}</h2>
			<div class="text-sm">
				<p>Constellation: {characterData.constellation}</p>
				<p>Ascension: {characterData.ascension}</p>
				<p>Talent:</p>
				<p class="pl-8">Auto {characterData.talent.auto}</p>
				<p class="pl-8">Skill {characterData.talent.skill}</p>
				<p class="pl-8">Burst {characterData.talent.burst}</p>
			</div>
		{/if}
	</div>
</div>
