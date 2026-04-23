import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { saveFavoritePokemonFn } from "#/server/pokemon";

export const Route = createFileRoute("/favorite")({
	component: Favorite,
});

function Favorite() {
	const [name, setName] = useState("");
	const [status, setStatus] = useState("");

	const savePokemon = useServerFn(saveFavoritePokemonFn);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("Saving...");

		await savePokemon({ data: name });
		setStatus(`Successfully saved ${name}`);
		setName("");
	};

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<h1>Save a Pokemon</h1>
			<form onSubmit={handleSubmit} className="mt-6 space-x-4">
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="border p-2 rounded"
					placeholder="pikachuuu"
				/>
				<button type="submit" className="bg-blue-500 text-white p-2 rounded">
					Save
				</button>
			</form>
			<p className="mt-4">{status}</p>
		</main>
	);
}
