<script lang="ts">
	import '../app.css';
	import { selectedGoodFile, readStorage } from './shared.js';
	import Notification from './Notification.svelte';
	import Sidebar from './Sidebar.svelte';
	import { onMount } from 'svelte';
	let { children } = $props();
	let notify = $state(false);
	let notificationHtmlMessage = $state('');

	onMount(() => {
		document.documentElement.classList.toggle(
			'dark',
			localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		);
		const uploadsData = readStorage();
		if (uploadsData.length === 0 && $selectedGoodFile === '') {
			notify = true;
			notificationHtmlMessage = `⚠️&nbsp;<p>No GOOD file found.<br>
				Please go to the <strong>'Files'</strong> tab a GOOD file.</p>`;
		} else if (uploadsData.length > 0 && $selectedGoodFile === '') {
			$selectedGoodFile = uploadsData[0]!;
			setTimeout(() => {
				notify = true;
				notificationHtmlMessage = `📚&nbsp;<p>Latest GOOD file loaded from local storage.<br/>
				Loaded: <code class="text-sm">${$selectedGoodFile}</code></p>`;
			});
			setTimeout(() => {
				notify = false;
			}, 5000);
		}
	});

	$effect(() => {
		if ($selectedGoodFile !== '') {
			notify = false;
		}
	});
</script>

<main class="flex h-screen bg-white dark:bg-indigo-950 dark:text-gray-400">
	<Sidebar />
	<section class="mx-1 my-8 flex flex-col text-sm md:mx-16 md:w-screen md:text-base">
		<Notification htmlMessage={notificationHtmlMessage} show={notify} />
		{@render children()}
	</section>
</main>
