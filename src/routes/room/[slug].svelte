<!-- ACTUAL GAME PAGE -->
<script>
	import { page } from "$app/stores";
	import Card from "$lib/Card.svelte";
	import SwapCard from "$lib/SwapCardsCard.svelte";
	import JudgingCard from "$lib/JudgingCard.svelte";
	import data from "$lib/data.json";

	let playerID = 0;
	const cookieName = `meme-${$page.params.slug}`;

	let roundWinner = -1;

	let states = Object.freeze({
		playingCards: 0,
		judgingSingle: 1,
		judgingAll: 2,
		declaringWinner: 3,
		choosingTemplate: 4,
	});
	let currentState = states.choosingTemplate;

	// TODO: incorporate backend
	let selectedCard = -1;
	let playedCard = -1;

	let playerNum = 0;
	let judgePlayerNum = 0;

	let template = 0;

	let playerNumsLeftToJudge = [];
	let currentlyJudgingPlayerNum = -1;

	let scores = {
		0: 3,
		1: 4,
		2: 2,
		3: 5,
		4: 0,
	};

	var cards = [
		"This is card #1",
		"This is card #2",
		"Surprisingly, this is #3",
		"This is card #4",
		"This is card #5",
		"Surprisingly, this is #6",
		"This is card #7",
	];
	var activePlayerIDs = [0, 1, 2, 3, 4];
	var ids2names = {
		0: "zero",
		1: "one",
		2: "two",
		3: "three",
		4: "four",
	};
	let playedCards = {};
	let shuffledPlayedCards = [];

	function getCookie(name) {
		var cookie = document.cookie;
		var prefix = name + "=";
		var begin = cookie.indexOf("; " + prefix);
		if (begin == -1) {
			begin = cookie.indexOf(prefix);
			if (begin != 0) return null;
		} else {
			begin += 2;
			var end = document.cookie.indexOf(";", begin);
			if (end == -1) {
				end = cookie.length;
			}
		}
		return unescape(cookie.substring(begin + prefix.length, end));
	}

	function setCookie(name, value) {
		console.log(document.cookie);
		document.cookie = `${name}=${value}`;
	}

	function playSelection() {
		if (selectedCard != -1) {
			//TODO: send update to backend
			playedCard = selectedCard;
			selectedCard = -1;
		}
	}

	function judgeNext() {
		if (playerNumsLeftToJudge.length > 0) {
			let ind2Judge = getRandomInt(playerNumsLeftToJudge.length);
			currentlyJudgingPlayerNum = playerNumsLeftToJudge.splice(
				ind2Judge,
				1
			)[0];
		} else {
			// FIXME: change on db
			shuffledPlayedCards = shuffle(Object.values(playedCards));
			setState(states.judgingAll);
			// judgingAll = true;
		}
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	function chooseAsWinner() {
		//TODO: send to backend
		roundWinner = findPlayerWhoPlayedCard(
			shuffledPlayedCards[selectedCard]
		);

		//FIXME: client cannot change state locally, only on db
		setState(states.declaringWinner);
	}

	function setState(newState) {
		currentState = newState;
	}

	function shuffle(array) {
		let currentIndex = array.length,
			randomIndex;

		// While there remain elements to shuffle...
		while (currentIndex != 0) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex--;

			// And swap it with the current element.
			[array[currentIndex], array[randomIndex]] = [
				array[randomIndex],
				array[currentIndex],
			];
		}

		return array;
	}

	function startNextRound() {
		judgePlayerNum = (activePlayerIDs.indexOf(playerID)+1)%activePlayerIDs.length; //put on db
		shuffledPlayedCards = [];
		playedCards = {};
		selectedCard = -1;
		roundWinner = -1; //put on db
		setState(states.choosingTemplate);
	}

	//DEV
	document.onkeydown = function (event) {
		let c = typeof event !== "undefined" ? event.keyCode : event.which;
		// console.log(c);
		if (c == 192) {
			playedCards[1] = "This card was played by p0";
			playerNumsLeftToJudge.push(0);
			if (Object.keys(playedCards).length == activePlayerIDs.length - 1) {
					let ind2Judge = getRandomInt(playerNumsLeftToJudge.length);
					currentlyJudgingPlayerNum = playerNumsLeftToJudge.splice(
						ind2Judge,
						1
					)[0];
				setState(states.judgingSingle);
			}
		} else if (c == 49) {
			playedCards[1] = "This card was played by p1";
			playerNumsLeftToJudge.push(1);
			if (Object.keys(playedCards).length == activePlayerIDs.length - 1) {
				if (playerNum == judgePlayerNum) {
					let ind2Judge = getRandomInt(playerNumsLeftToJudge.length);
					currentlyJudgingPlayerNum = playerNumsLeftToJudge.splice(
						ind2Judge,
						1
					)[0];
				}
				setState(states.judgingSingle);
			}
		} else if (c == 50) {
			playedCards[2] = "This card was played by p2";
			playerNumsLeftToJudge.push(2);
			if (Object.keys(playedCards).length == activePlayerIDs.length - 1) {
				if (playerNum == judgePlayerNum) {
					let ind2Judge = getRandomInt(playerNumsLeftToJudge.length);
					currentlyJudgingPlayerNum = playerNumsLeftToJudge.splice(
						ind2Judge,
						1
					)[0];
				}
				setState(states.judgingSingle);
			}
		} else if (c == 51) {
			playedCards[3] = "This card was played by p3";
			playerNumsLeftToJudge.push(3);
			if (Object.keys(playedCards).length == activePlayerIDs.length - 1) {
				if (playerNum == judgePlayerNum) {
					let ind2Judge = getRandomInt(playerNumsLeftToJudge.length);
					currentlyJudgingPlayerNum = playerNumsLeftToJudge.splice(
						ind2Judge,
						1
					)[0];
				}
				setState(states.judgingSingle);
			}
		} else if (c == 52) {
			playedCards[4] = "This card was played by p4";
			playerNumsLeftToJudge.push(4);
			if (Object.keys(playedCards).length == activePlayerIDs.length - 1) {
				if (playerNum == judgePlayerNum) {
					let ind2Judge = getRandomInt(playerNumsLeftToJudge.length);
					currentlyJudgingPlayerNum = playerNumsLeftToJudge.splice(
						ind2Judge,
						1
					)[0];
				}
				setState(states.judgingSingle);
			}
		}else if (c == 53) {
			setState(states.playingCards);
		}
	};

	function findPlayerWhoPlayedCard(val) {
		for (var pn in playedCards) {
			if (playedCards[pn] == val) {
				return pn;
			}
		}
		return -1;
	}

	function rerollTemplate() {
		if (playerNum == judgePlayerNum) {
			let newTemplate = getRandomInt(data.Templates.length);
			while (newTemplate == template) {
				newTemplate = getRandomInt(data.Templates.length);
			}
			template = newTemplate;
		}
	}

	function chooseTemplate() {
		if (playerNum == judgePlayerNum) {
			setState(states.playingCards);
		}
	}
</script>

<div class="container">
	<div
		class="modal fade text-black"
		id="scoresModal"
		tabindex="-1"
		aria-labelledby="scoresModalLabel"
		aria-hidden="true"
	>
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title" id="scoresModalLabel">
						Modal title
					</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
					/>
				</div>
				<div class="modal-body">
					<ul>
						{#each activePlayerIDs as pid}
							<li>{ids2names[pid]}: {scores[pid]}</li>
						{/each}
					</ul>
				</div>
				<div class="modal-footer">
					<button
						type="button"
						class="btn btn-primary"
						data-bs-dismiss="modal">Close</button
					>
				</div>
			</div>
		</div>
	</div>
</div>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
	<div class="container-fluid justify-content-start">
		<span class="navbar-brand">Room: {$page.params.slug}</span>
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#game-navbar"
			aria-controls="game-navbar"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<div class="collapse navbar-collapse" id="game-navbar">
			<ul class="navbar-nav me-auto mb-2 mb-lg-0 justify-content-center">
				<button
					class="btn btn-primary mx-3"
					data-bs-toggle="modal"
					data-bs-target="#scoresModal">Scores</button>

				<button class="btn btn-secondary mx-3">Leave Room</button>
			</ul>
		</div>
	</div>
</nav>
<div class="row justify-content-center">
	<!-- LEFT -->
	<div class="col-12 col-lg-6 text-center">
		<div class="display-3 py-3">Template</div>
		{#if playerNum == judgePlayerNum && currentState == states.choosingTemplate}
			<button class="btn btn-secondary mb-3" on:click={rerollTemplate}
				>Reroll</button
			>
			<button class="btn btn-primary mb-3" on:click={chooseTemplate}
				>Choose</button
			>
		{/if}
		<div class="ratio ratio-16x9">
			<img
				src={data.Templates[template].image}
				alt=""
				class="img-fluid"
				style="border-radius: 2vw"
			/>
		</div>
		<div class="mt-3">
			<a href={data.Templates[template].help} target="_blank"
				>Template Help</a
			>
		</div>
		{#if playerNum == judgePlayerNum}
			<div class="h1 py-3">You are the judge!</div>
		{:else}
			<div class="h1 py-3">Judge: Nat</div>
		{/if}
	</div>
	<!-- RIGHT -->
	{#if currentState == states.playingCards}
		{#if playerNum != judgePlayerNum && playedCard == -1}
			<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
				<div class="display-3 py-5">Your Cards</div>
				<button
					class="btn btn-primary mb-5"
					class:disabled={selectedCard == -1}
					on:click={playSelection}>Play Selection</button
				>
				<div class="row">
					{#each cards as cardText, index}
						<Card
							bind:cardText
							bind:selectedCard
							{index}
							interactable={true}
						/>
					{/each}
					<SwapCard bind:selectedCard index={cards.length} />
				</div>
			</div>
		{:else}
			<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
				<div class="display-3 py-5">
					Waiting on cards ({Object.keys(playedCards)
						.length}/{activePlayerIDs.length - 1})
				</div>
			</div>
		{/if}
	{:else if currentState == states.judgingSingle}
		<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
			<div class="display-3 py-5">Played Card</div>
			<button class="btn btn-primary mb-5" on:click={judgeNext}>
				{#if playerNumsLeftToJudge.length > 0}
					View Next
				{:else}
					Choose Winner
				{/if}
			</button>
			<div class="row justify-content-center align-items-center">
				<JudgingCard
					cardText={playedCards[currentlyJudgingPlayerNum]}
				/>
			</div>
		</div>
	{:else if currentState == states.judgingAll}
		<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
			<div class="display-3 py-5">Played Cards</div>
			{#if playerNum == judgePlayerNum}
				<button
					class="btn btn-primary mb-5"
					class:disabled={selectedCard == -1}
					on:click={chooseAsWinner}>Choose as Winner</button
				>
			{/if}
			<div class="row">
				{#each shuffledPlayedCards as cardText, index}
					<Card
						bind:cardText
						bind:selectedCard
						{index}
						interactable={playerNum == judgePlayerNum}
					/>
				{/each}
			</div>
		</div>
	{:else if currentState == states.declaringWinner}
		<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
			<div class="display-3 py-5">Winner: {ids2names[roundWinner]}</div>
			{#if playerNum == judgePlayerNum}
				<button class="btn btn-primary mb-5" on:click={startNextRound}>
					Start Next Round
				</button>
			{/if}
			<div class="row justify-content-center align-items-center">
				<JudgingCard cardText={shuffledPlayedCards[selectedCard]} />
			</div>
		</div>
	{:else if currentState == states.choosingTemplate}
		<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
			<div class="h1 py-5">
				Hang tight while the Judge chooses a template
			</div>
		</div>
	{/if}
</div>

<style>
	.scroll-y {
		overflow-y: auto;
	}
	.hidden-x {
		overflow-x: hidden;
	}
</style>
