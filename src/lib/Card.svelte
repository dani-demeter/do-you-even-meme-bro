<script>
	export let selectedCard;
	export let cardText;
	export let index;

	function handleClick(e) {
		if (selectedCard != index) {
			selectedCard = index;
		} else {
			selectedCard = -1;
		}
	}
</script>

<div class="col-6">
	<div class="card ratio text-black h3 my-2" class:selected={selectedCard == index} on:click={handleClick}>
		<span class="noInteraction noselect">{cardText} {index}</span>
	</div>
</div>

<style>
	.noInteraction {
		pointer-events: none;
	}

	.card {
		--bs-aspect-ratio: 50%;
		box-sizing: border-box;
		background-color: var(--offwhite);
		border: 3px solid var(--offwhite);
	}

	.card:hover {
		border: 3px solid var(--blue);
		cursor: pointer;
	}

	.selected {
		box-shadow: 0px 0px 0.2em 0.2em rgba(40, 194, 255, 0.5);
	}

	.noselect {
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
	}
</style>
