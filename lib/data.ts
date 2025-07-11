import createClient from "openapi-fetch";

import { env } from "@/config/env.config";

import type { components, paths } from "./api-client/api";
import type { SearchRecord, SearchRecordResult, SearchRecordType } from "./model";

export const client = createClient<paths>({ baseUrl: env.NEXT_PUBLIC_RDFPROXY_ENDPOINT });

export interface SearchParams {
	type?: SearchRecordType;
	page?: number;
}

export async function getSearchResults(params: SearchParams): Promise<SearchRecordResult> {
	const type = params.type ?? "person";
	const data = (await client.GET("/person", { params: { query: { page: params.page ?? 1 } } }))
		.data;
	if (data && data.items instanceof Array) {
		return {
			items: data.items.map((i: components["schemas"]["Person"]): SearchRecord => {
				return {
					id: i.id,
					name: i.person_display_name!,
					description: `described by ${i.person_display_name!}`,
					type: type,
				};
			}),
			page: data.page,
			pages: data.pages,
			total: data.total,
		};
	} else {
		return { items: [], page: 0, pages: 0, total: 0 };
	}
}
