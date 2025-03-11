<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { selectedFile, fetchData } from '../shared.js';

	let goodFileData = $state({});

	async function fetchFile(selectedFile) {
		if (selectedFile === '') {
			return;
		}
		return fetch('http://localhost:5000/uploads/' + selectedFile)
			.then((res) => res.json())
			.catch((error) => {
				console.error('Fetch error:', error);
			});
	}

	function pascalToSnakeCase(s) {
		if (s === 'TravelerGeo')
			return 'aether_(geo)';
		return s
			.split(/\.?(?=[A-Z])/)
			.join('_')
			.toLowerCase();
	}

	function pascalToNormalCase(pascalStr) {
		let normalStr = pascalStr.replace(/([A-Z])/g, ' $1');
		normalStr = normalStr.charAt(0).toUpperCase() + normalStr.slice(1);
		return normalStr;
	}

	onMount(async () => {
		goodFileData = await fetchFile($selectedFile);
		console.log(goodFileData);
	});
</script>

<h1 class="text-center text-4xl font-bold">Characters</h1>

<h3 class="text-center">
	{#if $selectedFile}
	Characters from: <code class="font-bold">`{$selectedFile}`</code>
	{:else}
	Please select a file in the '<strong>Upload</strong>' tab.
	{/if}
</h3>


<div class="overflow-scroll mt-4 flex flex-wrap items-start max-w-(40vw)">
	{#each goodFileData.characters as character}
		<div class="flex flex-col items-center justify-center m-2">
			<img
				src={`http://localhost:5000/images/characters/${pascalToSnakeCase(character.key)}.png`}
				class="h-20 w-20 object-cover text-wrap break-before-all"
				alt={pascalToNormalCase(character.key)}
				title={pascalToNormalCase(character.key)}
			/>
			<p class="max-w-20 break-before-auto text-center">{pascalToNormalCase(character.key)}</p>
		</div>
	{/each}
</div>
