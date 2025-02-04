import { writable } from 'svelte/store';

export let selectedFile = writable('');

export async function fetchData() {
    return fetch('http://localhost:5000/uploads')
        .then((res) => res.json())
        .catch((error) => {
            console.error('Fetch error:', error);
        });
}
