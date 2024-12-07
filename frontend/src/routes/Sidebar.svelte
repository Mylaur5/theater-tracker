<script lang="ts">
	let hidden = $state(false);

	function openSidebar() {
		hidden = !hidden;
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'm') openSidebar();
	}
</script>

<span
	role="button"
	class="left-4 top-5 cursor-pointer text-4xl text-white"
	onclick={openSidebar}
	{onkeydown}
	aria-pressed="false"
	tabindex="0"
>
	<i class="bi bi-filter-left rounded-md bg-gray-900 px-2"></i>
</span>
<div
	class="sidebar bottom-0 top-0 w-[300px] overflow-y-auto bg-gray-900 p-2 text-center lg:left-0"
	class:hidden
>
	<div class="text-xl text-gray-100">
		<div class="mt-1 flex items-center p-2.5">
			<i class="bi bi-app-indicator rounded-md bg-blue-600 px-2 py-1"></i>
			<h1 class="ml-3 text-[15px] font-bold text-gray-200">Theater Tracker</h1>
			<i
				role="button"
				class="bi bi-x ml-28 cursor-pointer lg:hidden"
				onclick={openSidebar}
				{onkeydown}
				aria-pressed="false"
				tabindex="0"
			></i>
		</div>
		<div class="my-2 h-[1px] bg-gray-600"></div>
	</div>
	<div
		class="mt-3 flex cursor-pointer items-center rounded-md p-2.5 px-4 text-white duration-300 hover:bg-blue-600"
	>
		<i class="bi bi-house-door-fill"></i>
		<span class="ml-4 text-[15px] font-bold text-gray-200">Home</span>
	</div>
	<div
		class="mt-3 flex cursor-pointer items-center rounded-md p-2.5 px-4 text-white duration-300 hover:bg-blue-600"
	>
		<i class="bi bi-bookmark-fill"></i>
		<span class="ml-4 text-[15px] font-bold text-gray-200">Bookmark</span>
	</div>
	<div class="my-4 h-[1px] bg-gray-600"></div>
</div>
