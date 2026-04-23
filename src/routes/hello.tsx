import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/hello")({
	// 1. The server API Endpoint
	server: {
		handlers: {
			POST: async ({ request }) => {
				console.log("Someone hit out public API");

				const body = await request.json();

				return Response.json(
					{
						message: `Hello, ${body.name}`,
					},
					{
						headers: {
							"Cache-Control": "public, s-maxage=60",
							"Access-Control-Allow-Origin": "*",
						},
					},
				);
			},
		},
	},
	// 2.- The react UI
	component: HelloComponent,
});

function HelloComponent() {
	const [reply, setReply] = useState("");

	return (
		<main className="p-10">
			<button
				type="button"
				className="bg-blue-500 text-white p-2 rounded"
				onClick={() => {
					// This button manually fetches its own route´s POST handler!
					fetch("/hello", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ name: "Tanstacker" }),
					})
						.then((res) => res.json())
						.then((data) => setReply(data.message));
				}}
			>
				Say Hello {reply && `- ${reply}`}
			</button>
		</main>
	);
}
