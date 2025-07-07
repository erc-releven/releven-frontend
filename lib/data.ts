import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { PathsWithMethod } from "openapi-typescript-helpers";

import { env } from "@/config/env.config";

import type { paths } from "./api-client/api";

const fetchClient = createFetchClient<paths>({ baseUrl: env.NEXT_PUBLIC_RDFPROXY_ENDPOINT });

export const client = createClient(fetchClient);

export function useGetQuery(path: PathsWithMethod<paths, "get">, page = 1) {
	// FIXME inferred type is: UseQueryResult<unknown, never>
	return client.useQuery("get", path, {
		params: {
			query: { page: page },
		},
	});
}
