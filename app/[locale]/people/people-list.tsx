"use client";

import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

export interface PeopleListResult {
	items: Array<Item>;
	page: number;
	size: number;
	total: number;
	pages: number;
}

export interface Item {
	id: string;
	person_descriptive_name: Array<string>;
}

export function PeopleList(): ReactNode {
	const [page, setPage] = useState(1);

	const { data } = useQuery({
		queryKey: ["people", "list", { page }] as const,
		async queryFn({ queryKey }) {
			const url = createUrl({
				baseUrl: "https://releven-backend.acdh-ch-dev.oeaw.ac.at",
				pathname: "person",
				searchParams: createUrlSearchParams({
					page: queryKey[2].page,
					size: 50,
				}),
			});
			const response = await fetch(url);
			return (await response.json()) as PeopleListResult;
		},
	});
	if (data) {
		const start = data.size * (data.page - 1);
		return (
			<>
				<div>
					showing results {start + 1} - {start + data.items.length} of {data.total}
					<button
						className="m-2 border border-red-900 p-2"
						onClick={() => {
							setPage(1);
						}}
						type="button"
					>
						&lt;&lt;
					</button>
					<button
						className="m-2 border border-red-900 p-2"
						onClick={() => {
							setPage(Math.max(1, page - 1));
						}}
						type="button"
					>
						&lt;
					</button>
					<button
						className="m-2 border border-red-900 p-2"
						onClick={() => {
							setPage(Math.min(data.pages, page + 1));
						}}
						type="button"
					>
						&gt;
					</button>
					<button
						className="m-2 border border-red-900 p-2"
						onClick={() => {
							setPage(data.pages);
						}}
						type="button"
					>
						&gt;&gt;
					</button>
				</div>
				<table className="m-2 border border-black">
					{data.items.map((p) => {
						return (
							<tr key={p.id} className="p-2">
								<td className="p-1">{p.person_descriptive_name}</td>
								<td className="p-1">{p.id}</td>
							</tr>
						);
					})}
				</table>
			</>
		);
	} else {
		return null;
	}
}
