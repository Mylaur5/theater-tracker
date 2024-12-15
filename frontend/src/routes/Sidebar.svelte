<script lang="ts">
	import { RiWeatherBlazeFill } from 'svelte-icons-pack/ri';
	import { BsPersonVcard, BsUpload } from 'svelte-icons-pack/bs';

	// Define a type for menu items
	type MenuItem = {
		id: string;
		label: string;
		icon: any;
		href: string;
		img: string;
	};

	const menuItems: MenuItem[] = [
		{
			id: 'seasons',
			label: 'Seasons',
			icon: RiWeatherBlazeFill,
			href: '/seasons',
			img: 'icons/Imaginarium_Theater_Emblem.png'
		},
		{
			id: 'characters',
			label: 'Characters',
			icon: BsPersonVcard,
			href: '/characters',
			img: 'icons/Icon_Party_Setup.webp'
		},
		{
			id: 'uploads',
			label: 'Uploads',
			icon: BsUpload,
			href: '/uploads',
			img: 'icons/Icon_Archive.webp'
		}
	];

	let hidden: boolean = $state(false);
	let selected: string = $state('');

	function toggleSidebar() {
		hidden = !hidden;
	}
</script>

<!-- svelte-ignore a11y_mouse_events_have_key_events -->
<div
	role="menu"
	class="flex h-full {hidden
		? 'w-16'
		: 'w-60'} flex-col overflow-hidden bg-gray-900 text-gray-400 transition-all duration-300 ease-in-out"
	tabindex="0"
>
	<a class="group mt-3 flex w-full items-center px-3" href="/" onclick={toggleSidebar}>
		<img
			alt="System_Imaginarium_Theater"
			src="/icons/System_Imaginarium_Theater.webp"
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
			<div class="group flex items-center justify-center group-hover:scale-110">
				<img src={item.img} width="32" height="32" />
				<span class="ml-2 text-sm font-medium" class:hidden>{item.label}</span>
			</div>
		</a>
	{/each}
	<a
		class="group flex h-auto w-full items-center bg-gray-800 px-4 hover:bg-gray-700 hover:text-gray-300"
		href="/accounts"
	>
		<div class="group flex items-center justify-center group-hover:scale-110">
			<img src="icons/Icon_Character_Lumine.webp" class="m-2 h-10" alt="Accounts Icon" />
			<span class="ml-2 text-sm font-medium" class:hidden>Accounts</span>
		</div>
	</a>
</div>
