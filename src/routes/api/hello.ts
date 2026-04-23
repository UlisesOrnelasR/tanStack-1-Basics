import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/hello")({
	server: {
		handlers: {
			GET: async () => {
				console.log("Someone hit out public API");
				return Response.json(
					{
						message: "Hello wordl!",
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
});
