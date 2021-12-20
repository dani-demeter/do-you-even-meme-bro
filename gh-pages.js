import { publish } from 'gh-pages';

publish(
 'build', // path to public directory
 {
  branch: 'main',
  repo: 'https://github.com/dani-demeter/do-you-even-meme-bro.git', // Update to point to your repository
  user: {
   name: 'Dani Demeter', // update to use your name
   email: 'demeter.dani.13@gmail.com' // Update to use your email
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);