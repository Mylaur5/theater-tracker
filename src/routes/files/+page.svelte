<script lang="ts">
	import { onMount } from 'svelte';
	import { selectedGoodFile, readStorage } from '../shared.js';
	import Notification from '../Notification.svelte';
	let uploadsData: (string | null)[] = $state([]);
	let files: FileList | undefined = $state();
	let notificationMessage: string = $state('');
	let notificationToggle: boolean = $state(false);
	let isHovering = $state(false);
	let dragCounter = $state(0); // To handle nested drag events

	export function storeFile(file: File) {
		notificationToggle = false;
		$selectedGoodFile = file.name;
		setTimeout(() => {
			notificationMessage = `✅ <p>File&nbsp;<code>${file.name}</code><br>sucessfully loaded in the local storage</p>`;
			notificationToggle = true;
		}, 250);
		setTimeout(() => {
			notificationToggle = false;
		}, 5000);
		// Check if the file is a JSON file
		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const result = (e.target as FileReader).result;
				if (typeof result === 'string') {
					const jsonData = JSON.parse(result);
					const wrappedData = {
						name: file.name,
						storedDate: new Date().toISOString(),
						content: jsonData
					};
					localStorage.setItem(file.name, JSON.stringify(wrappedData));
					console.log('JSON data stored in local storage:', wrappedData);
				}
			} catch (error) {
				console.error('Error parsing JSON file:', error);
			}
		};

		reader.onerror = (e) => console.error('Error reading file:', e);
		reader.readAsText(file);
		setTimeout(() => {
			uploadsData = readStorage();
		}, 500);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		isHovering = false;
		dragCounter = 0;
		if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
			files = event.dataTransfer.files;
			for (const file of files) {
				if (file.type === 'application/json') {
					storeFile(file);
				} else {
					notificationMessage = 'Invalid file type. Only JSON files are allowed.';
					notificationToggle = true;
					setTimeout(() => {
						notificationToggle = false;
					}, 5000);
				}
			}
		}
	}
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
	}
	function handleDragEnter(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		dragCounter++;
		isHovering = true;
	}
	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		event.stopPropagation();
		dragCounter--;
		if (dragCounter === 0) {
			isHovering = false;
		}
	}

	onMount(() => {
		uploadsData = readStorage();

		// Only add window event listeners in the browser
		window.addEventListener('dragenter', handleDragEnter);
		window.addEventListener('dragleave', handleDragLeave);
		window.addEventListener('drop', handleDrop);
		window.addEventListener('dragover', handleDragOver);

		return () => {
			window.removeEventListener('dragenter', handleDragEnter);
			window.removeEventListener('dragleave', handleDragLeave);
			window.removeEventListener('drop', handleDrop);
			window.removeEventListener('dragover', handleDragOver);
		};
	});
</script>

<Notification htmlMessage={notificationMessage} show={notificationToggle} />

<h1 class="mb-4 text-center text-4xl font-bold">Load GOOD file</h1>

{#if isHovering}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-40 flex items-center justify-center bg-gray-300/40 backdrop-blur-sm dark:bg-indigo-900/40"
		ondragenter={handleDragEnter}
		ondragleave={handleDragLeave}
	>
		<div class="rounded-xl border-2 border-blue-500 bg-white/80 px-8 py-6 text-2xl font-bold text-blue-800 shadow-xl">
			Drop your file anywhere!
		</div>
	</div>
{/if}

<div class="mx-[10vw]">
	<label
		for="dropzone-file"
		class="flex h-[40vh] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-200 dark:border-gray-600 dark:bg-indigo-900 dark:hover:border-gray-500 dark:hover:bg-indigo-800"
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
		<input
			id="dropzone-file"
			type="file"
			accept=".json"
			class="hidden"
			onchange={(event) => {
				const target = event.target as HTMLInputElement;
				if (target.files) {
					files = target.files;
					for (const file of files) {
						storeFile(file);
					}
				}
			}}
		/>
	</label>

	{#if $selectedGoodFile !== ''}
		<form class="mt-8 max-w-sm">
			<label for="files" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
				<p class="mt-4">Current file loaded:</p>
			</label>
			<select
				id="files"
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				bind:value={$selectedGoodFile}
			>
				{#each uploadsData as upload}
					<option value={upload}>{upload}</option>
				{:else}
					<option selected disabled>No file has been loaded yet</option>
				{/each}
			</select>
		</form>
	{:else}
		<p class="mt-12">No file has been found. Please load at least one GOOD file.</p>
	{/if}
</div>
