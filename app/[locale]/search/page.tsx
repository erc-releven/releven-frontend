import { MainContent } from "@/components/ui/main-content";

import { Filter } from "./filter";
import { ResultList } from "./result-list";

interface SearchPageProps {
	searchParams?: Promise<{
		page?: number;
	}>;
}

export default async function SearchPage(props: Readonly<SearchPageProps>) {
	const searchParams = await props.searchParams;
	return (
		<MainContent className="mx-auto flex w-4xl flex-col">
			<div className="basis-36 bg-[#FBF7F0] bg-[linear-gradient(to_right,rgba(251,247,240,1),rgba(251,247,240,0)),url('/assets/images/leader.png')] bg-contain bg-right bg-no-repeat"></div>
			<div className="flex w-full flex-row gap-6 bg-gray-100 px-8 pt-8">
				<div className="flex flex-col gap-4 bg-white p-6">
					{"Refine your search"}
					<Filter />
					<Filter />
				</div>
				<div className="grow bg-white p-6">
					<ResultList searchParams={searchParams} />
				</div>
			</div>
		</MainContent>
	);
}
