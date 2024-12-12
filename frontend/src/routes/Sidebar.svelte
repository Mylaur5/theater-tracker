<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import { RiWeatherBlazeFill } from 'svelte-icons-pack/ri';
	import { BsPersonVcard, BsUpload, BsPersonCircle } from 'svelte-icons-pack/bs';
	import UIImaginariumTheater from '$lib/images/UI_Imaginarium_Theater.png';

	// Define a type for menu items
	type MenuItem = {
		id: string;
		label: string;
		icon: any;
		href: string;
	};

	const menuItems: MenuItem[] = [
		{
			id: 'seasons',
			label: 'Seasons',
			icon: RiWeatherBlazeFill,
			href: '/seasons'
		},
		{
			id: 'characters',
			label: 'Characters',
			icon: BsPersonVcard,
			href: '/characters'
		},
		{
			id: 'uploads',
			label: 'Uploads',
			icon: BsUpload,
			href: '/uploads'
		}
	];

	let hidden: boolean = $state(true);
	let selected: string = $state('');

	function openSidebar() {
		hidden = false;
	}

	function closeSidebar() {
		hidden = true;
	}
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div
	role="menu"
	class="flex h-full {hidden ? 'w-16' : 'w-60'} flex-col overflow-hidden bg-gray-900 text-gray-400 transition-all duration-300 ease-in-out"
	onmouseover={openSidebar}
	onmouseout={closeSidebar}
	tabindex="0"
>
	<a class="group mt-3 flex w-full items-center px-3" href="/">
		<img
			alt="UI Imaginarium Theater"
			src={UIImaginariumTheater}
			decoding="async"
			loading="lazy"
			width="30"
			height="30"
			data-image-name="UI Imaginarium Theater.png"
			data-image-key="UI_Imaginarium_Theater.png"
			data-relevant="0"
			class="transition-transform duration-300 group-hover:scale-125"
		/>
		<span class="ml-2 text-nowrap text-sm font-bold transition-all duration-300 group-hover:scale-110 group-hover:text-white" class:hidden>
			Theater Tracker
		</span>
	</a>
	<hr class="mt-3 flex flex-col items-center border-t border-gray-700" />
	{#each menuItems as item}
		<a
			class="group mt-2 flex h-12 w-full items-center rounded px-4
		{selected === item.id ? '' : 'hover:'}bg-gray-700
		{selected === item.id ? '' : 'hover:'}text-gray-{selected === item.id ? '200' : '300'}"
			href={item.href}
			onclick={() => {
				selected = item.id;
			}}
		>
			<div class="group flex justify-center items-center group-hover:scale-110">
				<Icon src={item.icon} size={24}/>
				<span class="ml-2 text-sm font-medium" class:hidden>{item.label}</span>
			</div>
		</a>
	{/each}
	<a class="group mt-auto flex h-16 w-full items-center bg-gray-800 px-4 hover:bg-gray-700 hover:text-gray-300" href="#">
		<div class="group flex justify-center items-center group-hover:scale-110">
			<Icon src={BsPersonCircle} size="24"/>
			<span class="ml-2 text-sm font-medium" class:hidden>Accounts</span>
		</div>
	</a>
</div>
