<script context="module">
	export const prerender = true;
</script>

<script>
	import UsernameSelect from '$lib/UsernameSelect.svelte';
	import RoomJoiner from '$lib/RoomJoiner.svelte';

	let username = '';
</script>

{#if username != ''}
	<div class="container">
		<div class="row align-items-center">
			<div class="col-12 col-md-6 py-5">
				<RoomJoiner {username} />
			</div>
			<div class="col-12 col-md-6 text-center py-5">
				<div id="rulebook-parent" class="mb-3">
					<h1>Rulebook</h1>
				</div>
				<div>1. There are no rules.</div>
			</div>
		</div>
	</div>
{:else}
	<UsernameSelect bind:username />
{/if}

<svelte:head>
	<title>Lobby</title>
</svelte:head>

<style>
	#rulebook-parent {
		width: 80%;
		height: 80%;
		border: 2px solid var(--offwhite);
		margin-left: 10%;
		margin-right: 10%;
	}
</style>
