"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryState } from "nuqs";

import { searchRecordTypes } from "@/lib/model";

import { Filter } from "./filter";
import { RadioGroup } from "./radio-group";
import { ResultList } from "./result-list";
import { SearchInput } from "./search-input";

const queryClient = new QueryClient();

interface SearchInterfaceProps {}

export function SearchInterface(_props: Readonly<SearchInterfaceProps>) {
	const [searchTerm, setSearchTerm] = useQueryState("q", parseAsString.withDefault(""));
	const [type, setType] = useQueryState(
		"type",
		parseAsStringLiteral(searchRecordTypes).withDefault(searchRecordTypes[0]),
	);
	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
	return (
		<>
			<div className="flex basis-36 flex-col items-center justify-center bg-[#FBF7F0] bg-[linear-gradient(to_right,rgba(251,247,240,1),rgba(251,247,240,0)),url('/assets/images/leader.png')] bg-contain bg-right bg-no-repeat">
				<SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
			</div>
			<div className="flex w-full grow flex-row gap-6 bg-gray-100 p-8">
				<div className="flex flex-col gap-4 bg-white p-6">
					<span className="text-sm font-bold uppercase">{"Refine your search"}</span>
					<Filter label={"Category"}>
						<RadioGroup
							defaultValue={type}
							name={"type"}
							options={searchRecordTypes as unknown as Array<string>}
						/>
					</Filter>
					<Filter label={"Years active"} />
				</div>
				<div className="grow bg-white p-6">
					<QueryClientProvider client={queryClient}>
						<ResultList
							page={page}
							query={searchTerm}
							setPage={setPage}
							setType={setType}
							type={type}
						/>
					</QueryClientProvider>
				</div>
			</div>
		</>
	);
}
