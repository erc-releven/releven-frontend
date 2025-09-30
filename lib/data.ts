/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import createClient from "openapi-fetch";

import { env } from "@/config/env.config";

import type { components, paths } from "./api-client/api";
import type { SearchRecord, SearchRecordResult, SearchRecordType } from "./model";

export const client = createClient<paths>({
	baseUrl: env.NEXT_PUBLIC_RDFPROXY_ENDPOINT,
	cache: "force-cache", // TODO reconsider this?
});

function wrapPerson(item: components["schemas"]["People"]): SearchRecord {
	const names = item.person_name_of_person_assertion
		.map(({ person_name_of_person_is }) => {
			return person_name_of_person_is;
		})
		.filter((v) => {
			return v;
		});
	return {
		type: "people",
		id: item.id,
		name: item.person_display_name!,
		description: names.length ? ` known as ${names.join(", ")}.` : undefined,
		n_assertions: item.n_assertions,
	};
}

function wrapPlace(item: components["schemas"]["Place"]): SearchRecord {
	return {
		type: "places",
		id: item.id,
		name: item.place_display_name!,
	};
}

function wrapText(item: components["schemas"]["Text"]): SearchRecord {
	return {
		type: "texts",
		id: item.id,
		name: item.written_text_display_name!,
	};
}

const typesToEndpoints: Record<
	SearchRecordType,
	{ path: keyof paths; wrapper: (data: never) => SearchRecord }
> = {
	people: { path: "/people", wrapper: wrapPerson },
	places: { path: "/place", wrapper: wrapPlace },
	texts: { path: "/text", wrapper: wrapText },
};

export async function getSearchResults(
	type: SearchRecordType = "people",
	page = 1,
	query = "",
	orderBy: string | null = null,
): Promise<SearchRecordResult> {
	const data = (
		await client.GET(typesToEndpoints[type].path, {
			params: {
				query: {
					page: page,
					query: query,
					order_by: orderBy as any,
					desc: orderBy === "n_assertions" ? true : undefined,
				},
			},
		})
	).data as any;
	return {
		page: data.page,
		pages: data.pages,
		total: data.total,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		items: data.items.map(typesToEndpoints[type].wrapper),
	};
}
