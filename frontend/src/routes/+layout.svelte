<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<main class="min-h-screen bg-gray-100">
	<nav class="bg-blue-500 p-4 text-white">
		<h1 class="text-2xl">Theater Tracker</h1>
	</nav>
	<section class="p-8">
		{@render children()}
	</section>
	<footer class="bg-blue-500 p-4 text-center text-white">
		<p>&copy; 2024 Theater Tracker</p>
	</footer>
</main>
