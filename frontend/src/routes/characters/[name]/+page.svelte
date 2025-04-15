<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { selectedGoodFile, normalToSnakeCase, pascalToNormalCase, normalToPascalCase } from '../../shared.js';
	let { data } = $props();
	let characterName = $derived(data.name);
	let element = $state("");
	let characterData = $state({ talent: {} });

	onMount(async () => {
		// Find matching element from seasons_data.json
		element = await fetch('/data/seasons_data.json')
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

<div class="flex items-start justify-center transition-transform hover:scale-105">
	<img
		src={`/images/characters/${normalToSnakeCase(pascalToNormalCase(characterName))}.png`}
		class="w-36 break-before-all text-wrap object-cover"
		alt={characterName}
		title={characterName}
	/>
	<div>
		<img
			src={`/images/elements/${element.toLowerCase()}.png`}
			class="w-10 break-before-all text-wrap object-cover"
			alt={characterName}
			title={characterName}
		/>
		<p>Level {characterData.level}</p>
		<p>Constellation {characterData.constellation}</p>
		<p>Ascension {characterData.ascension}</p>
		<p>
			Talent: Auto {characterData.talent.auto}, Skill {characterData.talent.skill}, Burst {characterData.talent.burst}
		</p>
	</div>
</div>
