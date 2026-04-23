import { createServerFn } from "@tanstack/react-start";

const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";

export const getPokemonFn = createServerFn({
	method: "GET",
}).handler(async () => {
	console.log("Executing a secure database/API call on the server...");

	const response = await fetch(POKEMON_API_URL);
	const data = await response.json();

	console.log("Data successfully fetched on the server!", data);
	return data;
});

export const saveFavoritePokemonFn = createServerFn({
	method: "POST",
})
	.inputValidator((name: string) => name)
	.handler(async ({ data }) => {
		console.log("Saving data to our secure database...");

		await new Promise((resolve) => setTimeout(resolve, 1500));
		return {
			success: true,
			saved: data,
		};
	});
