export const searchRecordTypes = ["people", "places", "texts"] as const;

export type SearchRecordType = (typeof searchRecordTypes)[number];

export interface SearchRecord {
	id: string;
	name: string;
	description?: string;
	n_assertions?: number;
	type: SearchRecordType;
}

export interface SearchRecordResult {
	items: Array<SearchRecord>;
	page: number;
	pages: number;
	total: number;
}
