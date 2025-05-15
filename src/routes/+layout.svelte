<script lang="ts">
	import '../app.css';
	import Sidebar from './Sidebar.svelte';
	import { onMount } from 'svelte';
	let { children } = $props();

	onMount(() => {
		document.documentElement.classList.toggle(
			'dark',
			localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		);
	});
</script>

<main class="flex h-screen bg-white dark:bg-indigo-950 dark:text-gray-400">
	<Sidebar />
	<section class="flex flex-col w-screen my-8 mx-16">
		{@render children()}	
	</section>
</main>