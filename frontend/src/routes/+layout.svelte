<script lang="ts">
	import '../app.css';
	import Sidebar from './Sidebar.svelte';
	let { children } = $props();
</script>

<main class="flex h-screen bg-gray-100">
	<Sidebar />
	<section class="flex flex-col w-screen justify-between">
		{@render children()}
		<footer class="bg-blue-500 p-4 text-center text-white">
			<p>&copy; 2024 Theater Tracker</p>
		</footer>
	</section>
</main>

<style>
	* {
		font-family: 'HYWenHei 85W';
	}
</style>
