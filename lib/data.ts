import createClient from "openapi-fetch";
import { cache } from "react";

import { env } from "@/config/env.config";

import type { components, paths } from "./api-client/api";
import type { SearchRecord, SearchRecordResult, SearchRecordType } from "./model";

export const client = createClient<paths>({ baseUrl: env.NEXT_PUBLIC_RDFPROXY_ENDPOINT });

export interface SearchParams {
	type?: SearchRecordType;
	page?: number;
}

function wrapPerson(item: components["schemas"]["Person"]): SearchRecord {
	const names = item.person_name_of_person_assertion.map(({ person_name_of_person_is }) => {
		return person_name_of_person_is;
	});
	return {
		type: "person",
		id: item.id,
		name: item.person_display_name!,
		description: `known as ${names.join(", ")}`,
	};
}

export async function getSearchResults(params: SearchParams): Promise<SearchRecordResult> {
	const _type = params.type ?? "person";
	const data =
		// const data = (await client.GET("/place", { params: { query: { page: params.page ?? 1 } } }))
		(await client.GET("/person", { params: { query: { page: params.page ?? 1 } } })).data;
	if (data) {
		return {
			items: data.items.map(wrapPerson),
			page: data.page,
			pages: data.pages,
			total: data.total,
		};
	} else {
		return { items: [], page: 0, pages: 0, total: 0 };
	}
}

export const getCachedSearchResults = cache(getSearchResults);
