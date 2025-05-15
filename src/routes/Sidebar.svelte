<script lang="ts">
	import { AiOutlineMoon, AiOutlineSun } from 'svelte-icons-pack/ai';
	import { Icon } from 'svelte-icons-pack';
	import { base } from '$app/paths';

	type MenuItem = {
		id: string;
		label: string;
		href: string;
		img: string;
	};

	const menuItems: MenuItem[] = [
		{
			id: 'seasons',
			label: 'Seasons',
			href: '/',
			img: '/icons/Imaginarium_Theater_Emblem.png'
		},
		{
			id: 'characters',
			label: 'Characters',
			href: '/characters',
			img: '/icons/Icon_Party_Setup.webp'
		},
		{
			id: 'files',
			label: 'Files',
			href: '/files',
			img: '/icons/Icon_Archive.webp'
		}
	];

	let hidden: boolean = $state(false);
	let selected: string = $state('');
	let darkMode: boolean = $state(true);

	function toggleSidebar() {
		hidden = !hidden;
	}

	function toggleDarkMode() {
		darkMode = !darkMode;
	}

	$effect(() => {
		if (darkMode) {
			localStorage.theme = 'dark';
			document.documentElement.classList.add('dark');
		} else {
			localStorage.theme = 'light';
			document.documentElement.classList.remove('dark');
		}
	});
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div
	role="menu"
	class="flex h-full {hidden
		? 'w-16'
		: 'w-60'} flex-col overflow-hidden bg-gray-900 text-gray-400 transition-all duration-300 ease-in-out"
	tabindex="0"
>
	<!-- Home -->
	<button class="group mt-3 flex w-full items-center px-3" onclick={toggleSidebar}>
		<img
			alt="System_Imaginarium_Theater"
			src="{base}/icons/System_Imaginarium_Theater.webp"
			decoding="async"
			loading="lazy"
			width="30"
			height="30"
			data-image-name="System_Imaginarium_Theater.webp"
			data-image-key="System_Imaginarium_Theater.webp"
			data-relevant="0"
			class="transition-transform duration-300 group-hover:scale-125"
		/>
		<span
			class="ml-2 text-nowrap text-sm font-bold transition-all duration-300 group-hover:scale-110 group-hover:text-white"
			class:hidden
		>
			Theater Tracker
		</span>
	</button>
	<!-- Separator -->
	<hr class="mt-3 border-t border-gray-700" />
	<!-- Menu -->
	{#each menuItems as item}
		<a
			class="group mt-2 flex h-12 w-full items-center rounded px-3
			{selected === item.id ? 'bg-gray-700 text-gray-200' : 'hover:bg-gray-700 hover:text-gray-300'}"
			href="{base}{item.href}"
			onclick={() => {
				selected = item.id;
			}}
		>
			<div class="flex items-center">
				<!-- svelte-ignore a11y_missing_attribute -->
				<img src="{base}{item.img}" alt={item.img} width="32" height="32" class="transition-transform group-hover:scale-125" />
				<span class="ml-2 text-sm font-medium transition-transform group-hover:scale-110" class:hidden
					>{item.label}</span
				>
			</div>
		</a>
	{/each}
	<!-- Fill Height -->
	<div class="mt-auto"></div>
	<!-- Dark Mode Switch -->
	<label class="flex cursor-pointer items-center py-2 hover:text-gray-300" class:hidden>
		<div class="ml-2">
			<input type="checkbox" class="sr-only" onchange={toggleDarkMode} checked={darkMode} />
			<div class="block h-5 w-9 rounded-full bg-gray-600 hover:bg-slate-500">
				<div
					class="relative left-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white transition dark:bg-gray-900"
					class:translate-x-full={darkMode}
				>
					<span class:text-gray-800={!darkMode}>
						<Icon src={darkMode ? AiOutlineMoon : AiOutlineSun} size="12" />
					</span>
				</div>
			</div>
		</div>
		<span class="text-nowrap px-2 text-xs" class:hidden>Toggle Dark Mode</span>
	</label>
	<!-- Separator -->
	<hr class="border-t border-gray-700" />
	<!-- Accounts -->
	<a class="group h-auto w-full bg-gray-800 hover:bg-gray-700 hover:text-gray-300" href="/accounts">
		<div class="group flex items-center px-2">
			<img
				src="{base}/icons/Icon_Character_Lumine.webp"
				class="my-2 h-10 transition-transform group-hover:scale-125"
				alt="Accounts Icon"
			/>
			<span class="ml-2 text-sm font-medium transition-transform group-hover:scale-110" class:hidden>Accounts</span>
		</div>
	</a>
</div>
