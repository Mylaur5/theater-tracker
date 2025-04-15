<script>
	import { onMount } from 'svelte';
	import { selectedGoodFile, normalToSnakeCase, pascalToNormalCase } from '../../shared.js';
	let { data } = $props();
	let characterName = $derived(data.name);
	let goodFileData = $state({ characters: [] });
	let characterData = $state({talent: {}});

	onMount(() => {
		if ($selectedGoodFile === '') return;
		goodFileData = JSON.parse(localStorage.getItem($selectedGoodFile) ?? '');
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
		<p>Level {characterData.level}</p>
		<p>Constellation {characterData.constellation}</p>
		<p>Ascension {characterData.ascension}</p>
		<p>
			Talent: Auto {characterData.talent.auto}, Skill {characterData.talent.skill}, Burst {characterData.talent.burst}
		</p>
	</div>
</div>
