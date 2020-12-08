import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		title: `Sam's Test Project`
	}
});

export default app;
