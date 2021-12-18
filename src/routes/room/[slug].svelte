<script>
	import { page } from '$app/stores';
	import Card from '$lib/Card.svelte';

	let selectedCard = -1;

	var cards = ['This is card #1', 'This is card #2', 'Surprisingly, this is #3', 'This is card #4', 'This is card #5', 'Surprisingly, this is #6', 'This is card #7', 'Swap Cards'];

	function playSelection() {
		if (selectedCard != -1) {
		}
	}
</script>

<div class="container">
	<div class="row justify-content-center">
		<div class="col text-center">
			<div class="h5">Room: {$page.params.slug}</div>
		</div>
		<div class="col text-center">
			<a href="/" class="btn btn-secondary">Leave Room</a>
		</div>
	</div>
	<div class="row justify-content-center">
		<div class="col-12 col-lg-6 text-center">
			<div class="display-3 py-5">Template</div>
			<div class="ratio ratio-16x9">
				<img src="https://i.kym-cdn.com/entries/icons/original/000/006/026/NOTSUREIF.jpg" alt="" class="img-fluid" style="border-radius: 2vw" />
			</div>
			<div class="h1 py-5">Judge: Nat</div>
		</div>
		<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
			<div class="display-3 py-5">Your Cards</div>
			<button class="btn btn-primary mb-5" class:disabled={selectedCard == -1} on:click={playSelection}>Play Selection</button>
			<div class="row">
				{#each cards as cardText, index}
					<Card bind:cardText bind:selectedCard {index} />
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.scroll-y {
		overflow-y: auto;
	}
	.hidden-x {
		overflow-x: hidden;
	}
</style>
