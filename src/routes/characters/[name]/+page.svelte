<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { base, assets } from '$app/paths';
	import { selectedGoodFile, normalToSnakeCase, pascalToNormalCase, normalToPascalCase } from '../../shared.js';
	let { data } = $props();
	let characterName = $derived(data.name);
	let element = $state('');
	let characterData = $state({ talent: {} });

	onMount(async () => {
		// Find matching element from seasons_data.json
		element = await fetch(`${assets}/data/seasons_data.json`)
			.then((response) => response.json())
			.then((data) => data.flatMap((season) => [...season.opening_characters, ...season.special_guest_stars]))
			.then((allChars) => allChars.find((char) => normalToPascalCase(char.name) === characterName))
			.then((char) => char.element)
			.catch((error) => console.error('Fetch error:', error));

		if ($selectedGoodFile === '') return;
		const goodFileData = JSON.parse(localStorage.getItem($selectedGoodFile) ?? '');
		characterData = goodFileData.characters.find((char) => char.key === characterName);
	});
</script>

<h1 class="mb-4 text-center text-4xl font-bold">{pascalToNormalCase(characterName)}</h1>

<div class="flex items-start justify-center">
	<img
		src="{assets}/images/characters/{normalToSnakeCase(pascalToNormalCase(characterName))}.png"
		class="w-45 break-before-all text-wrap object-cover"
		alt={characterName}
		title={characterName}
	/>
	<div class="flex h-full flex-col justify-between">
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
		{#await characterData}
			<p class="ml-6 mt-6 break-before-auto text-sm">
				Loading Data...<br />
				Meanwhile, ensure to have selected a file <br /> in the <strong>'Files'</strong> tab.
			</p>
		{:then characterData}
			<div class="text-sm">
				<p>Level: {characterData.level}</p>
				<p>Constellation: {characterData.constellation}</p>
				<p>Ascension: {characterData.ascension}</p>
				<p>Talent:</p>
				<p class="pl-8">Auto {characterData.talent.auto}</p>
				<p class="pl-8">Skill {characterData.talent.skill}</p>
				<p class="pl-8">Burst {characterData.talent.burst}</p>
			</div>
		{/await}
	</div>
</div>
