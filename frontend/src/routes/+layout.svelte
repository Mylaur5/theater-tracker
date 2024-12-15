<script lang="ts">
	import '../app.css';
	import Sidebar from './Sidebar.svelte';
	let { children } = $props();
</script>

<main class="flex h-screen bg-gray-100 dark:bg-indigo-950 dark:text-gray-400">
	<Sidebar />
	<section class="flex flex-col w-screen m-4">
		{@render children()}
	</section>
</main>

<style>
	* {
		font-family: 'Genshin Impact';
	}
</style>
