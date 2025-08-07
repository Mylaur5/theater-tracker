<script lang="ts">
	let { htmlMessage, show = false } = $props();

	function closeNotification() {
		show = false;
	}
</script>

<div
	class:show
	class="notification fixed md:right-4 right-0 top-4 flex rounded-lg bg-gray-50  px-2 md:px-4 py-4 shadow-md hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-gray-300"
>
	{@html htmlMessage}
	<button
		type="button"
		onclick={closeNotification}
		class="md:-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-blue-50 bg-transparent p-1.5 text-lg text-gray-400 hover:bg-gray-700 focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:hover:bg-gray-700"
		data-dismiss-target="#alert-1"
		aria-label="Close"
	>
		<span class="sr-only">Close</span>
		<svg class="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
			<path
				stroke="currentColor"
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
			/>
		</svg>
	</button>
</div>

<style>
	.notification {
		visibility: hidden;
		opacity: 0;
		transition:
			opacity 0.1s ease-in,
			transform 0.1s ease-in;
	}

	.notification.show {
		visibility: visible;
		opacity: 1;
		transform: translateX(-20px);
	}

	@media (width < 768px) {
		.notification.show {
			transform: translateX(-5px);
		}
	}
</style>
