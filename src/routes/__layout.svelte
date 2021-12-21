<script>
	import '../app.css';

	let mounted = false;
	import { onMount } from 'svelte';
	onMount(() => {
		mounted = true;
	});
</script>

<!-- <Navbar /> -->

{#if mounted}
	<main>
		<slot />
	</main>
{:else}
	<div class="row justify-content-center align-items-center" style="height: 100vh;">
		<div id="spinner" />
	</div>
{/if}

<!-- 
<footer>
	<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer> -->
<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		margin: 0 auto;
		box-sizing: border-box;
	}
	#spinner {
		border: 3px solid hsla(185, 100%, 62%, 0.2);
		border-top-color: var(--mint);
		border-radius: 50%;
		width: 3em;
		height: 3em;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
