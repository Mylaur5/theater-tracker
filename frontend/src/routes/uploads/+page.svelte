<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedFile } from '../shared.js';

	let uploadsData: string[] = $state([]);
	let files: FileList | undefined = $state();

	async function fetchUploads() {
		return fetch('http://localhost:5000/uploads')
			.then((res) => res.json())
			.catch((error) => {
				console.error('Fetch error:', error);
			});
	}

	function uploadFile(file: File) {
		const formData = new FormData();
		formData.append('file', file);
		fetch('http://localhost:5000/uploads', {
			method: 'POST',
			body: formData
		})
			.then((response) => response.json())
			.then(async (data) => {
				console.log(data);
				uploadsData = await fetchUploads();
				$selectedFile = data.filename;
			});
	}

	onMount(async () => {
		uploadsData = await fetchUploads();
	});

	$effect(() => {
		if (files) {
			for (const file of files) {
				uploadFile(file);
			}
		}
	});
</script>

<h1 class="mb-4 text-center text-4xl font-bold">Uploads</h1>

<div>
	<label
		for="dropzone-file"
		class="flex h-[20vh] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-200 dark:border-gray-600 dark:bg-indigo-900 dark:hover:border-gray-500 dark:hover:bg-indigo-800"
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
				<span class="font-semibold">Click to upload</span> or drag and drop
			</p>
			<p class="text-xs text-gray-500 dark:text-gray-400">JSON files</p>
		</div>
		<input id="dropzone-file" type="file" class="hidden" bind:files />
	</label>

	<form class="mt-8 max-w-sm">
		<label for="countries" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Select a file</label>
		<select
			id="countries"
			class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			bind:value={$selectedFile}
		>
			{#if $selectedFile}
				<option>{$selectedFile}</option>
			{/if}
			{#each uploadsData as upload}
				{#if upload !== $selectedFile}
					<option value={upload}>{upload}</option>
				{/if}
			{:else}
				<option selected disabled>No file has been uploaded yet</option>
			{/each}
		</select>
	</form>
</div>

<style>
	option {
		font-family: inherit;
	}
</style>
