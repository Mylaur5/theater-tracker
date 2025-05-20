<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedGoodFile, readStorage } from '../shared.js';
	let uploadsData: (string | null)[] = $state([]);
	let files: FileList | undefined = $state();

	export function storeFile(file: File) {
		$selectedGoodFile = file.name;

		// Check if the file is a JSON file
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const result = (e.target as FileReader).result;
				if (typeof result === 'string') {
					const jsonData = JSON.parse(result);
					localStorage.setItem(file.name, JSON.stringify(jsonData));
					console.log('JSON data stored in local storage:', jsonData);
				}
			} catch (error) {
				console.error('Error parsing JSON file:', error);
			}
		};

		reader.onerror = (e) => console.error('Error reading file:', e);
		reader.readAsText(file);
	}

	onMount(async () => {
		uploadsData = readStorage();
		$selectedGoodFile = uploadsData.at(-1) ?? '';
	});

	$effect(() => {
		if (files) {
			for (const file of files) {
				storeFile(file);
			}
			uploadsData = readStorage();
		}
	});
</script>

<h1 class="mb-4 text-center text-4xl font-bold">Load GOOD file</h1>

<div class="mx-[10vw]">
	<label
		for="dropzone-file"
		class="flex h-[max(20vh, 15rem)] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-200 dark:border-gray-600 dark:bg-indigo-900 dark:hover:border-gray-500 dark:hover:bg-indigo-800"
	>
		<div class="flex flex-col items-center justify-center pb-6 pt-5">
			<svg
				class="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 20 16"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
				/>
			</svg>
			<p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
				<span class="font-semibold">Click to load</span> your file or drag and drop it here
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">JSON files</p>
		</div>
		<input id="dropzone-file" type="file" accept=".json" class="hidden" bind:files />
	</label>

	<form class="mt-8 max-w-sm">
		<label for="countries" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
			>Current Loaded File:</label
		>
		<select
			id="countries"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			bind:value={$selectedGoodFile}
		>
		{#each uploadsData as upload}
			<option value={upload}>{upload}</option>
				<!-- {#if $selectedGoodFile !== ''}
					<option selected>{$selectedGoodFile}</option>
				{/if}
				{#if upload !== $selectedGoodFile}
				{/if} -->
			{:else}
				<option selected disabled>No file has been loaded yet</option>
			{/each}
		</select>
	</form>
</div>
