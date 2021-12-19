<!-- ACTUAL GAME PAGE -->
<script>
	import { page } from '$app/stores';
	import Card from '$lib/Card.svelte';
	import SwapCard from '$lib/SwapCardsCard.svelte';
	import JudgingCard from '$lib/JudgingCard.svelte';
	// TODO: incorporate backend
	let selectedCard = -1;

	let playerNum = 0;
	let judgePlayerNum = 0;

	let playerNumsLeftToJudge = [1, 2, 3, 4];
	let currentlyJudgingPlayerNum = 1;

	var cards = ['This is card #1', 'This is card #2', 'Surprisingly, this is #3', 'This is card #4', 'This is card #5', 'Surprisingly, this is #6', 'This is card #7'];
	var playerIDs = [0, 1, 2, 3, 4];
	var playedCards = {
		1: 'This card was played by player 1',
		2: 'This card was played by player 2',
		3: 'This card was played by player 3',
		4: 'This card was played by player 4',
	};

	function playSelection() {
		if (selectedCard != -1) {
			//TODO: send update to backend
		}
	}

	function judgeNext() {
		if (playerNumsLeftToJudge.length > 0) {
			let ind2Judge = getRandomInt(playerNumsLeftToJudge.length);
		} else {
		}
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
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
			{#if playerNum == judgePlayerNum}
				<div class="h1 py-5">You are the judge!</div>
			{:else}
				<div class="h1 py-5">Judge: Nat</div>
			{/if}
		</div>
		{#if Object.keys(playedCards).length != playerIDs.length - 1}
			{#if playerNum != judgePlayerNum}
				<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
					<div class="display-3 py-5">Your Cards</div>
					<button class="btn btn-primary mb-5" class:disabled={selectedCard == -1} on:click={playSelection}>Play Selection</button>
					<div class="row">
						{#each cards as cardText, index}
							<Card bind:cardText bind:selectedCard {index} />
						{/each}
						<SwapCard bind:selectedCard index={cards.length} />
					</div>
				</div>
			{:else}
				<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
					<div class="display-3 py-5">Waiting on cards</div>
				</div>
			{/if}
		{:else}
			<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
				<div class="display-3 py-5">Played Cards</div>
				<button class="btn btn-primary mb-5" on:click={judgeNext}>
					{#if playerNumsLeftToJudge.length > 0} View Next {:else} Choose Winner {/if}
				</button>
				<div class="row justify-content-center align-items-center">
					<JudgingCard cardText={playedCards[currentlyJudgingPlayerNum]} />
				</div>
			</div>
		{/if}

		<!-- {#if playerNum != judgePlayerNum}
			<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
				<div class="display-3 py-5">Your Cards</div>
				<button class="btn btn-primary mb-5" class:disabled={selectedCard == -1} on:click={playSelection}>Play Selection</button>
				<div class="row">
					{#each cards as cardText, index}
						<Card bind:cardText bind:selectedCard {index} />
					{/each}
					<SwapCard bind:selectedCard index={cards.length} />
				</div>
			</div>
		{:else if Object.keys(playedCards).length == playerIDs.length - 1}
			<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
				<div class="display-3 py-5">View Played Cards</div>
			</div>
		{:else}
			<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
				<div class="display-3 py-5">Waiting on cards</div>
			</div>
		{/if} -->
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
