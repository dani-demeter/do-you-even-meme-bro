<script>
	export let cardText;
</script>

<div class="col-6">
	<div class="card ratio text-black h5 my-2">
		<span class="noInteraction noselect">{cardText}</span>
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
