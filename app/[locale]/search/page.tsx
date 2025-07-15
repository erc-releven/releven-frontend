import { Suspense } from "react";

import { MainContent } from "@/components/ui/main-content";
import { type SearchRecordType, searchRecordTypes } from "@/lib/model";

import { Filter } from "./filter";
import { Radio } from "./radio";
import { RadioGroup } from "./radio-group";
import { ResultList } from "./result-list";
import { SearchInput } from "./search-input";

interface SearchPageProps {
	searchParams?: Promise<{
		page?: number;
		type?: SearchRecordType;
	}>;
}

export default async function SearchPage(props: Readonly<SearchPageProps>) {
	const searchParams = await props.searchParams;
	return (
		<MainContent className="mx-auto flex w-full max-w-screen-2xl flex-col">
			<div className="flex basis-36 flex-col items-center justify-center bg-[#FBF7F0] bg-[linear-gradient(to_right,rgba(251,247,240,1),rgba(251,247,240,0)),url('/assets/images/leader.png')] bg-contain bg-right bg-no-repeat">
				<SearchInput />
			</div>
			<div className="flex w-full flex-row gap-6 bg-gray-100 px-8 pt-8">
				<div className="flex flex-col gap-4 bg-white p-6">
					<span className="text-sm font-bold uppercase">{"Refine your search"}</span>
					<Filter label={"Category"}>
						<RadioGroup defaultValue={searchParams?.type} name={"type"}>
							{searchRecordTypes.map((type) => {
								return <Radio key={type} label={type} name={"type"} value={type} />;
							})}
						</RadioGroup>
					</Filter>
					<Filter label={"Years active"} />
				</div>
				<div className="grow bg-white p-6">
					<Suspense>
						<ResultList searchParams={searchParams} />
					</Suspense>
				</div>
			</div>
		</MainContent>
	);
}
