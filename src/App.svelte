<script>
	import colours from "./colours";
	export let title;

	let prev = null, colour = null, hex = null, visible = false;

	function handleInput() {
		const input = this.value.replace(/\W/g, "");
		if (!input.length) prev = null;

		const output = getColour(input.toLowerCase() || prev);

		if (output) {
			colour = output.name_formatted;
			hex = output.hex;
			prev = output;
		}

		visible = !!output ? "is-visible" : "";
	}

	function getColour(input) {
		if (!input.length) return null;

		const chars = [...input],
			expression = chars.map(d => `.*${d}`).join(""),
			regEx = new RegExp(expression, "i"),
			results = colours.filter(d => regEx.test(d.name_formatted));

		if (!results.length) return null;

		const withProps = results.map(d => {
      const { name_formatted } = d,
      	[match] = name_formatted.match(regEx),
				start = name_formatted.indexOf(chars[0]),
				end = match.length,
				sub = name_formatted.substring(start, end),
				len = sub.length,
				r = { str: name_formatted, index: 0 };

				const con = Math.max(
        	...chars
          	.reduce(createConsecutive, r)
          	.str.match(/(~+)/g, "")
          	.map(v => v.length)
      	);

				return { ...d, len, con };
			});

			withProps.sort((a, b) => {
	      // most consequetive
	      const c = a.con - b.con;
	      if (c !== 0) return c;

	      // shortest total
	      const n = b.len - a.len;
	      if (n !== 0) return n;

	      // lowest index
	      return +b.number - +a.number;
    	});

			const top = withProps.pop();
    	const r = { str: top.name_formatted, index: 0 };
    	// top.marked = chars.reduce(createMark, r).str;

    	return top;
	}

	function createConsecutive(prev, cur) {
		const pre = prev.str.substring(0, prev.index),
			after = prev.str.substring(prev.index, prev.str.length),
			end = after.toLowerCase().indexOf(cur),
			inject = after.substring(0, end),
			post = after.substring(end + 1),
			str = `${pre}${inject}~${post}`,
			index = str.length - post.length;

			return { str, index };
	}
</script>

<main>
	<h1>{title}!</h1>
	<input on:input={handleInput} placeholder="Enter your name" />

	<div class="output {visible}">
		<div class="hex" style="background-color: {hex}"></div>
    <p class="colour" style="color: {hex}">{colour}</p>
  </div>
</main>

<style>
	main {
		margin: 0 auto;
		padding: 1em;
		width: 100%;
		max-width: 640px;
		text-align: center;
	}

	h1 {
		color: #ff3e00;
		font-size: 4em;
		font-weight: 100;
	}

	p {
		margin: 0;
	}

	.output {
		opacity: 0;
		transition: 500ms;
		transform: translate(0, -25px);
	}

	.is-visible {
		opacity: 1;
		transform: translate(0, 0);
	}

	.colour {
		font-size: 24px;
	}

	.hex {
		margin: 32px auto 8px;
		height: 64px;
		width: 64px;
		border-radius: 50%;
	}
</style>
