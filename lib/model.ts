export const searchRecordTypes = ["person", "place", "text"] as const;

export type SearchRecordType = (typeof searchRecordTypes)[number];

export interface SearchRecord {
	id: string;
	name: string;
	description: string;
	type: SearchRecordType;
}

export interface SearchRecordResult {
	items: Array<SearchRecord>;
	page: number;
	pages: number;
	total: number;
}
