<script lang="ts">
	import { selectedGoodFile, readStorage } from './shared.js';
	import Notification from './Notification.svelte';
	import '../app.css';
	import Sidebar from './Sidebar.svelte';
	import { onMount } from 'svelte';
	let { children } = $props();
	let notify = $state(false);
	let notificationMessage = $state('');

	onMount(() => {
		document.documentElement.classList.toggle(
			'dark',
			localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		);
		const uploadsData = readStorage();
		if (uploadsData.length === 0 && $selectedGoodFile === '') {
			notify = true;
			notificationMessage = "⚠️ <p> No GOOD file found.<br>Please go to the 'Files' tab a GOOD file.</p>";
		} else if (uploadsData.length > 0 && $selectedGoodFile === '') {
			$selectedGoodFile = uploadsData.at(-1) ?? '';
		}
	});
</script>

<main class="flex h-screen bg-white dark:bg-indigo-950 dark:text-gray-400">
	<Sidebar />
	<section class="mx-16 my-8 flex w-screen flex-col">
		<Notification message={notificationMessage} show={notify} />
		{@render children()}
	</section>
</main>
