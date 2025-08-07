<script lang="ts">
	import { onMount } from 'svelte';
	import { assets } from '$app/paths';
	import {
		selectedGoodFile,
		normalToSnakeCase,
		pascalToNormalCase,
		normalToPascalCase,
		readGoodFile,
		writeGoodFile
	} from '../../shared.js';
	import Counter from './Counter.svelte';
	import Notification from '../../Notification.svelte';

	let { data } = $props();
	let characterName = $derived(data.name);
	let element = $state('');

	type GoodFile = {
		characters: Array<Character>;
	};

	type Character = {
		key: string;
		level: number;
		constellation: number;
		ascension: number;
		talent: {
			auto: number;
			skill: number;
			burst: number;
		};
	};

	let characterData: Character | undefined = $state();
	let goodFileData: GoodFile | undefined = $state();
	let notification = $state({ show: false, htmlMessage: '' });

	// Helper function to determine element
	async function getElementForCharacter(characterName: string) {
		switch (characterName) {
			case 'TravelerAnemo':
				return 'Anemo';
			case 'TravelerGeo':
				return 'Geo';
			case 'TravelerElectro':
				return 'Electro';
			case 'TravelerDendro':
				return 'Dendro';
			case 'TravelerHydro':
				return 'Hydro';
			case 'TravelerCryo':
				return 'Cryo';
			case 'TravelerPyro':
				return 'Pyro';
			default:
				return await fetch(`${assets}/data/keqing_data.json`)
					.then((response) => response.json().then((response) => response.characters))
					.then((allChars) => allChars.find((char: any) => normalToPascalCase(char.name) === characterName))
					.then((char) => char.element)
					.catch((error) => {
						console.error('Fetch error:', error);
						return '';
					});
		}
	}

	onMount(async () => {
		// Assign element using helper function
		element = await getElementForCharacter(characterName);

		if ($selectedGoodFile === '') return;
		goodFileData = readGoodFile($selectedGoodFile);
		characterData = goodFileData!.characters.find((char: { key: string }) => char.key === characterName);
	});

	function saveCharToGoodFile() {
		writeGoodFile($selectedGoodFile, goodFileData);
		setTimeout(() => {
			notification.show = true;
			notification.htmlMessage = `✏️&nbsp;<p>Character data has been saved<br/>
				in: <code class="text-sm">${$selectedGoodFile}</code></p>`;
		});
		setTimeout(() => {
			notification.show = false;
		}, 5000);
	}
</script>

<Notification htmlMessage={notification.htmlMessage} show={notification.show} />

<h1 class="mb-4 text-center text-4xl font-bold">{pascalToNormalCase(characterName)}</h1>

{#if $selectedGoodFile.length > 0}
	<h3 class="mb-2 text-center text-sm">
		imported from: <code class="font-bold">`{$selectedGoodFile}`</code>
	</h3>
{/if}

<div class="flex flex-col items-center justify-center gap-8 md:flex-row">
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
	<div class="flex h-full flex-col">
		{#if !characterData}
			<h2 class="break-before-all text-xl font-bold">Character Data Loading...</h2>
		{:else if $selectedGoodFile !== ''}
			<h2 class="text-xl font-bold text-green-500">Level {characterData.level}</h2>
			<form class="grid grid-cols-2 items-center justify-between gap-4 text-sm">
				<Counter bind:value={characterData.constellation} label="Constellation" />
				<Counter bind:value={characterData.talent.auto} label="Talent Auto" />
				<Counter bind:value={characterData.ascension} label="Ascension" />
				<Counter bind:value={characterData.talent.skill} label="Talent Skill" />
				<Counter bind:value={characterData.talent.burst} label="Talent Burst" />
			</form>
		{/if}
		<button
			type="button"
			class="m-6 flex h-8 items-center self-end rounded-md border border-gray-300 bg-gray-100 p-3 px-4 text-white hover:bg-gray-200 focus:outline-none focus:ring-2 dark:border-green-700 dark:bg-green-600 dark:hover:bg-green-800"
			onclick={saveCharToGoodFile}
		>
			Save
		</button>
	</div>
</div>
