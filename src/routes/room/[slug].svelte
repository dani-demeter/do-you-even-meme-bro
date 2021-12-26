<!-- ACTUAL GAME PAGE -->
<script>
	import { page } from "$app/stores";
	import "$lib/chance.js";
	import Card from "$lib/Card.svelte";
	import SwapCard from "$lib/SwapCardsCard.svelte";
	import JudgingCard from "$lib/JudgingCard.svelte";
	import data from "$lib/data.json";
	import { onMount } from "svelte";
	import { app } from "$lib/firebase";
	import {
		getDatabase,
		ref,
		child,
		get,
		onValue,
		set,
		update,
	} from "firebase/database";

	let roomRef;
	let db;
	let playerID = "";
	let username = "";
	onMount(() => {
		db = getDatabase(
			app,
			"https://meme-3d972-default-rtdb.europe-west1.firebasedatabase.app"
		);

		const usernameCookieName = "meme-username";
		let cookieUsername = getCookie(usernameCookieName);
		if (cookieUsername != null) {
			username = cookieUsername;
		}
		const roomIDCookieName = `meme-id-${$page.params.slug}`;
		let cookieID = getCookie(roomIDCookieName);
		if (cookieID != null) {
			playerID = cookieID;
		} else {
			playerID = makeid(7);
			setCookie(roomIDCookieName, playerID);
		}

		roomRef = child(ref(db), $page.params.slug);

		onValue(roomRef, (snapshot) => {
			//if created new room
			if (snapshot.exists() || connected2db) {
				if (snapshot.exists()) {
					const snap = snapshot.val();
					//if existing room, but new to room
					if (snap?.players?.[playerID] !== undefined) {
						//if existing room, and rejoined => set active only at end of prev round
						if (
							!snap?.players?.[playerID].active &&
							snap.state == states.declaringWinner
						) {
							set(
								child(roomRef, `players/${playerID}/active`),
								true
							);
						}
						judgePlayerID = snap.judge;
						currentState = snap.state;
						template = snap.template;
						players = snap.players;
						activePlayerIDs = Object.keys(players)
							.filter((pid) => players[pid].active)
							.sort();
						playedCards = {};
						for (var pid in players) {
							if (
								players[pid].active &&
								players[pid].playedCard !== undefined
							) {
								playedCards[pid] = players[pid].playedCard;
							}
						}
						if (snap.chance !== undefined) {
							chance = new Chance(snap.chance);
						}
						if (snap.deckChance !== undefined) {
							deckChance = new Chance(snap.deckChance);
						}
						if (snap.nextDeckCard !== undefined) {
							nextDeckCard = snap.nextDeckCard;
						}

						if (snap.currentlyJudging !== undefined) {
							currentlyJudgingPlayerID = snap.currentlyJudging;
						}
						if (snap.roundWinner !== undefined) {
							roundWinner = snap.roundWinner;
						}

						if (
							playerID == judgePlayerID &&
							currentState == states.playingCards &&
							Object.keys(playedCards).length ==
								activePlayerIDs.length - 1
						) {
							let updates = {};
							playerIDsLeftToJudge = activePlayerIDs.filter(
								(pid) =>
									players[pid]?.playedCard !== undefined &&
									players[pid]?.playedCard >= 0
							);
							if (playerIDsLeftToJudge.length > 0) {
								let ind2Judge = getRandomInt(
									playerIDsLeftToJudge.length
								);
								currentlyJudgingPlayerID =
									playerIDsLeftToJudge.splice(
										ind2Judge,
										1
									)[0];
								updates["currentlyJudging"] =
									currentlyJudgingPlayerID;
								setState(states.judgingSingle);
							} else {
								setState(states.declaringWinner);
							}
							updates[`state`] = currentState;
							update(roomRef, updates);
						}

						if (
							currentState == states.judgingAll ||
							currentState == states.declaringWinner
						) {
							shuffledPlayedCards = chance.shuffle(
								Object.values(playedCards)
							);
						} else {
							shuffledPlayedCards = [];
						}
					} else {
						set(child(roomRef, `players/${playerID}`), {
							active: true,
							name: username,
							score: 0,
						});
					}
				} else {
					//room closed
					setState(states.roomClosed);
				}
			} else {
				let newRoomObj = {
					chance: getRandomInt(10),
					deckChance: getRandomInt(10000),
					nextDeckCard: 0,
					judge: playerID,
					state: 0,
					template: getRandomInt(data.Templates.length),
					players: {
						[playerID]: {
							active: true,
							name: username,
							score: 0,
						},
					},
				};
				console.log(newRoomObj);
				set(roomRef, newRoomObj);
			}
			connected2db = true;
		});
	});

	function makeid(length) {
		var result = "";
		var characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(
				Math.floor(Math.random() * charactersLength)
			);
		}
		return result;
	}

	let roundWinner = null;

	let states = Object.freeze({
		roomClosed: -1,
		waitingForPlayers: 0,
		choosingTemplate: 1,
		playingCards: 2,
		judgingSingle: 3,
		judgingAll: 4,
		declaringWinner: 5,
	});
	let currentState = states.waitingForPlayers;

	let selectedCard = -1;
	let playedCard = -1;

	let judgePlayerID;

	let template = 0;

	let playerIDsLeftToJudge = [];
	let currentlyJudgingPlayerID = -1;

	let playedCards = {};
	let shuffledPlayedCards = [];

	let players = {};
	var activePlayerIDs = Object.keys(players)
		.filter((pid) => players[pid].active)
		.sort();

	let chance = null;
	let deckChance = null;
	let nextDeckCard = 0;

	function getCookie(cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(";");
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == " ") {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return "";
	}

	function setCookie(name, value) {
		var expires = "";
		var date = new Date();
		date.setTime(date.getTime() + 1000 * 24 * 60 * 60 * 1000);
		expires = "; expires=" + date.toUTCString();
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	function playSelection() {
		if (selectedCard != -1) {
			playedCard = selectedCard;
			selectedCard = -1;
			if (playedCard == -2) {
				//swapping all cards
				let updates = {};
				updates[`players/${playerID}/playedCard`] = playedCard;
				updates[`players/${playerID}/hand`] = null;
				update(roomRef, updates);
			} else {
				set(
					child(roomRef, `players/${playerID}/playedCard`),
					playedCard
				);
			}
		}
	}

	function judgeNext() {
		if (playerIDsLeftToJudge.length > 0) {
			let ind2Judge = getRandomInt(playerIDsLeftToJudge.length);
			currentlyJudgingPlayerID = playerIDsLeftToJudge.splice(
				ind2Judge,
				1
			)[0];
			set(child(roomRef, `currentlyJudging`), currentlyJudgingPlayerID);
		} else {
			shuffledPlayedCards = chance.shuffle(Object.values(playedCards));
			setState(states.judgingAll);
			let updates = {};
			updates["state"] = currentState;
			updates["currentlyJudging"] = null;
			update(roomRef, updates);
		}
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * max);
	}

	function chooseAsWinner() {
		roundWinner = findPlayerWhoPlayedCard(
			shuffledPlayedCards[selectedCard]
		);

		setState(states.declaringWinner);
		let updates = {};
		updates["state"] = currentState;
		updates["roundWinner"] = roundWinner;
		updates["currentlyJudging"] = null;
		updates[`players/${roundWinner}/score`] =
			players[roundWinner]?.score + 1;
		update(roomRef, updates);
	}

	function setState(newState) {
		currentState = newState;
	}

	function startGame() {
		setState(states.choosingTemplate);
		template = getRandomInt(data.Templates.length);

		let updates = {};
		updates["template"] = template;
		updates["state"] = currentState;
		updates["chance"] = getRandomInt(10);
		drawUntilAllFull(updates);
		console.log(updates);
		update(roomRef, updates);
	}

	function startNextRound() {
		judgePlayerID =
			activePlayerIDs[
				(activePlayerIDs.indexOf(playerID) + 1) % activePlayerIDs.length
			];
		shuffledPlayedCards = []; //unnecessary
		playedCards = {}; //unnecessary
		selectedCard = -1;
		playedCard = -1;
		roundWinner = -1; //unnecessary
		setState(states.choosingTemplate);

		let updates = {};
		updates["judge"] = judgePlayerID;
		updates["template"] = getRandomInt(data.Templates.length);
		updates["state"] = currentState;
		for (var pid in players) {
			updates[`players/${pid}/playedCard`] = null;
		}
		updates["roundWinner"] = null;
		updates["chance"] = getRandomInt(10);
		drawUntilAllFull(updates);
		update(roomRef, updates);
	}

	function drawUntilAllFull(updates) {
		let cardArray = [...Array(data.Cards.length).keys()];
		let shuffledCardArray = deckChance.shuffle(cardArray);
		let need2updateDeckChance = false;
		let deckChanceP = null;
		for (var pid in players) {
			if (players[pid].active) {
				let playerHand = players[pid]?.hand || [];
				console.log(playerHand);
				while (playerHand.length < 7) {
					playerHand.push(shuffledCardArray[nextDeckCard++]);
					if (nextDeckCard >= data.Cards.length) {
						nextDeckCard = 0;
						deckChanceP = getRandomInt(10000);
						need2updateDeckChance = true;
						deckChance = new Chance(deckChanceP);
					}
				}
				updates[`players/${pid}/hand`] = playerHand;
			}
		}
		if (need2updateDeckChance) {
			updates["deckChance"] = deckChanceP;
		}
		updates["nextDeckCard"] = nextDeckCard;
	}

	function findPlayerWhoPlayedCard(val) {
		for (var pid in playedCards) {
			if (playedCards[pid] == val) {
				return pid;
			}
		}
		return -1;
	}

	function rerollTemplate() {
		if (playerID == judgePlayerID) {
			let newTemplate = getRandomInt(data.Templates.length);
			while (newTemplate == template) {
				newTemplate = getRandomInt(data.Templates.length);
			}
			template = newTemplate;
			set(child(roomRef, "template"), template);
		}
	}

	function chooseTemplate() {
		if (playerID == judgePlayerID) {
			setState(states.playingCards);
			set(child(roomRef, "state"), currentState);
		}
	}

	let connected2db = false;

	function leaveRoom() {
		if (activePlayerIDs.length <= 3) {
			set(roomRef, null);
		} else {
			let updates = {};
			if (playerID == judgePlayerID) {
				updates[`state`] = states.choosingTemplate;
				updates[`currentlyJudging`] = null;
				updates["judge"] =
					activePlayerIDs[
						(activePlayerIDs.indexOf(playerID) + 1) %
							activePlayerIDs.length
					];
				updates["template"] = getRandomInt(data.Templates.length);
				updates["state"] = currentState;
				for (var pid in players) {
					updates[`players/${pid}/playedCard`] = null;
				}
				updates["roundWinner"] = null;
				updates["chance"] = getRandomInt(10);
				drawUntilAllFull(updates);
			}
			updates[`players/${playerID}/active`] = false;
			update(roomRef, updates);
		}
		location.href = "/";
	}
</script>

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
				<h5 class="modal-title" id="scoresModalLabel">Scores</h5>
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
						<li>{players[pid]?.name}: {players[pid]?.score}</li>
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
					data-bs-target="#scoresModal">Scores</button
				>

				<button class="btn btn-secondary mx-3" on:click={leaveRoom}
					>Leave Room</button
				>
			</ul>
		</div>
	</div>
</nav>
<div class="container">
	<div class="row justify-content-center">
		{#if currentState == states.roomClosed}
			<div class="col-12 text-center">
				<span class="display-3 py-3">Room Closed</span>
				<span class="display-4 py-3">Thank you for playing.</span>
			</div>
		{:else if currentState == states.waitingForPlayers}
			<div class="col-12 text-center">
				{#if playerID == judgePlayerID}
					<div>
						<button
							class="btn btn-primary"
							class:disabled={activePlayerIDs.length <= 2}
							on:click={startGame}>Start Game</button
						>
					</div>
				{/if}
				<span class="display-3 py-3">Players in Lobby</span>
				<ul>
					{#each Object.values(players) as player}
						<li>{player.name}</li>
					{/each}
				</ul>
			</div>
		{:else}
			<!-- LEFT -->
			<div class="col-12 col-lg-6 text-center">
				<div class="display-3 py-3">Template</div>
				{#if playerID == judgePlayerID && currentState == states.choosingTemplate}
					<button
						class="btn btn-secondary mb-3"
						on:click={rerollTemplate}>Reroll</button
					>
					<button
						class="btn btn-primary mb-3"
						on:click={chooseTemplate}>Choose</button
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
				{#if playerID == judgePlayerID}
					<div class="h1 py-3">You are the judge!</div>
				{:else}
					<div class="h1 py-3">
						Judge: {players[judgePlayerID]?.name}
					</div>
				{/if}
			</div>
			<!-- RIGHT -->
			{#if currentState == states.playingCards}
				{#if playerID != judgePlayerID && playedCard == -1}
					<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
						<div class="display-3 py-5">Your Cards</div>
						<button
							class="btn btn-primary mb-5"
							class:disabled={selectedCard == -1}
							on:click={playSelection}>Play Selection</button
						>
						<div class="row">
							{#each players[playerID].hand as cardID, index}
								<Card
									cardText={data.Cards[cardID]}
									bind:selectedCard
									{index}
									interactable={true}
								/>
							{/each}
							<SwapCard
								bind:selectedCard
								index={players[playerID].hand.length}
							/>
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
					{#if playerID == judgePlayerID}
						<button
							class="btn btn-primary mb-5"
							on:click={judgeNext}
						>
							{#if playerIDsLeftToJudge.length > 0}
								View Next
							{:else}
								Choose Winner
							{/if}
						</button>
					{/if}
					<div class="row justify-content-center align-items-center">
						<JudgingCard
							cardText={data.Cards[
								playedCards[currentlyJudgingPlayerID]
							]}
						/>
					</div>
				</div>
			{:else if currentState == states.judgingAll}
				<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
					<div class="display-3 py-5">Played Cards</div>
					{#if playerID == judgePlayerID}
						<button
							class="btn btn-primary mb-5"
							class:disabled={selectedCard == -1}
							on:click={chooseAsWinner}
							>Choose as Winner
						</button>
					{/if}
					<div class="row">
						{#each shuffledPlayedCards as cardInd, index}
							<Card
								cardText={data.Cards[cardInd]}
								bind:selectedCard
								{index}
								interactable={playerID == judgePlayerID}
							/>
						{/each}
					</div>
				</div>
			{:else if currentState == states.declaringWinner}
				<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
					<div class="display-3 py-5">
						Winner: {players[roundWinner]?.name || "No Winner"}
					</div>
					{#if playerID == judgePlayerID}
						<button
							class="btn btn-primary mb-5"
							on:click={startNextRound}
						>
							Start Next Round
						</button>
					{/if}
					{#if roundWinner !== undefined}
						<div
							class="row justify-content-center align-items-center"
						>
							<JudgingCard
								cardText={data.Cards[
									players[roundWinner].playedCard
								]}
							/>
						</div>
					{/if}
				</div>
			{:else if currentState == states.choosingTemplate}
				<div class="col-12 col-lg-6 text-center scroll-y hidden-x">
					<div class="h1 py-5">
						Hang tight while the Judge chooses a template
					</div>
				</div>
			{/if}
		{/if}
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
