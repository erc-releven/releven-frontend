import { Suspense } from "react";

import { MainContent } from "@/components/ui/main-content";

import { LoadingDiv } from "../_components/loading-div";
import { SearchInterface } from "./search-interface";

interface SearchPageProps {}

export default function SearchPage(_props: Readonly<SearchPageProps>) {
	return (
		<MainContent className="mx-auto flex w-full max-w-screen-2xl flex-col">
			<Suspense fallback={<LoadingDiv />}>
				<SearchInterface />
			</Suspense>
		</MainContent>
	);
}
