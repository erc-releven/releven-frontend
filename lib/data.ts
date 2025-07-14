/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import createClient from "openapi-fetch";
import { cache } from "react";

import { env } from "@/config/env.config";

import type { components, paths } from "./api-client/api";
import type { SearchRecord, SearchRecordResult, SearchRecordType } from "./model";

export const client = createClient<paths>({ baseUrl: env.NEXT_PUBLIC_RDFPROXY_ENDPOINT });

export interface SearchParams {
	type?: SearchRecordType; // TODO add validation
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

function wrapPlace(item: components["schemas"]["Place"]): SearchRecord {
	return {
		type: "place",
		id: item.id,
		name: "no",
		description: "no",
	};
}

function wrapText(item: components["schemas"]["Written_text"]): SearchRecord {
	return {
		type: "text",
		id: item.id,
		name: item.written_text_display_name!,
		description: "",
	};
}

const typesToEndpoints: Record<
	SearchRecordType,
	{ path: keyof paths; wrapper: (data: never) => SearchRecord }
> = {
	person: { path: "/person", wrapper: wrapPerson },
	place: { path: "/place", wrapper: wrapPlace },
	text: { path: "/written_text", wrapper: wrapText },
};

export async function getSearchResults(params?: SearchParams): Promise<SearchRecordResult> {
	const page = params?.page ?? 1;
	const type = params?.type ?? "person";
	const data = (
		await client.GET(typesToEndpoints[type].path, { params: { query: { page: page } } })
	).data as any;
	return {
		page: data.page!,
		pages: data.pages!,
		total: data.total!,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		items: data.items!.map(typesToEndpoints[type].wrapper),
	};
}

export const getCachedSearchResults = cache(getSearchResults);
