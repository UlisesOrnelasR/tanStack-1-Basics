import { createFileRoute, notFound, useRouter } from "@tanstack/react-router";
import SkillCard from "#/components/SkillCard";
import { getPokemonFn } from "#/server/pokemon";

export const Route = createFileRoute("/")({
	component: App,
	pendingComponent: () => (
		<div className="p-14 text-center">Loading pokemon...</div>
	),
	pendingMs: 300,
	loader: async () => {
		const data = await getPokemonFn();
		return data;
	},
	errorComponent: ({ error }) => {
		const router = useRouter();
		return (
			<div className="p-14 text-red-500">
				<p>Ups! Error {error.message}!</p>
				<button onClick={() => router.invalidate()} type="button">
					Try again
				</button>
			</div>
		);
	},
	notFoundComponent: () => {
		return <div className="p-14 text-green-500">Nothing found here!</div>;
	},
});

function App() {
	const data = Route.useLoaderData();

	return (
		<main className="page-wrap px-4 pb-8 pt-14">
			<h1>Hello World from Tanstack</h1>

			<ul className="mt-6 list-none p-0 space-y-5">
				{data.results.map((pokemon: { name: string }) => (
					<li key={pokemon.name}>
						<SkillCard name={pokemon.name} />
					</li>
				))}
			</ul>
		</main>
	);
}
