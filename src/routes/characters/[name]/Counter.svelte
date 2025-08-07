<script>
	import { normalToSnakeCase } from '../../shared.js';

	let { value = $bindable(), label } = $props();
	let id = $derived(normalToSnakeCase(label));
</script>

<label for={id} class="text-left">{label}</label>
<div class="relative flex max-w-[8rem] items-center">
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<button
		type="button"
		id="decrement-button"
		data-input-counter-decrement={id}
		onclick={() => value--}
		class="flex h-8 items-center rounded-s-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
	>
		<svg
			class="h-3 w-3 text-gray-900 dark:text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 18 2"
		>
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16" />
		</svg>
	</button>
	<input
		type="text"
		{id}
		data-input-counter
		aria-describedby="helper-text-explanation"
		bind:value={value}
		class="block h-8 w-full border-x-0 border-gray-300 bg-gray-50 py-2.5 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
		required
	/>
	<!-- svelte-ignore a11y_consider_explicit_label -->
	<button
		type="button"
		id="increment-button"
		data-input-counter-increment={id}
		class="flex h-8 items-center rounded-e-lg border border-gray-300 bg-gray-100 p-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
		onclick={() => value++}
	>
		<svg
			class="h-3 w-3 text-gray-900 dark:text-white"
			aria-hidden="true"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 18 18"
		>
			<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16" />
		</svg>
	</button>
</div>
