// import static_adapter from '@sveltejs/adapter-static';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel(),

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	},
	paths: {
		base: '/do-you-even-meme-bro',
		assets: '/do-you-even-meme-bro'
	}
};

export default config;
