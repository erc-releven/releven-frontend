import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Collection } from "react-aria-components";
import ReactPaginate from "react-paginate";

import { ListBox, ListBoxItem } from "@/components/ui/listbox";
import { Popover } from "@/components/ui/popover";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SearchRecordResult } from "@/lib/model";

import type { ResultListProps } from "./result-list";

interface ResultListNavigationProps {
	data?: SearchRecordResult;
	searchProps: ResultListProps;
}

export function ResultListNavigation(props: Readonly<ResultListNavigationProps>): ReactNode {
	const t = useTranslations("SearchPage.result-list");

	const { data, searchProps } = props;
	const sort = [
		// TODO handle null default more nicely
		// {
		// 	id: "",
		// 	name: "",
		// },
		{
			id: "person_display_name",
			name: t("sort-by.people.person_display_name"),
		},
		// { id: "assertion_count", name: "relevance" },
	];

	return data ? (
		<div className="mx-6 my-4 flex items-center justify-between">
			<div>
				{data.total} {"Result(s)"}
			</div>
			<ReactPaginate
				activeLinkClassName="bg-primary text-white"
				breakClassName="flex items-center px-3 py-3 text-gray-300"
				containerClassName="flex flex-row items-center"
				disableInitialCallback={true}
				// hrefBuilder={buildHref}
				forcePage={searchProps.page - 1}
				marginPagesDisplayed={2}
				nextLabel={">"}
				nextLinkClassName="flex items-center px-3 py-3 text-gray-300"
				onPageChange={({ selected }) => {
					searchProps.setPage(selected + 1);
				}}
				pageCount={data.pages}
				pageLinkClassName="border-1 border-gray-100 flex items-center mx-1 min-w-10 px-2 py-2 rounded-1 text-gray-500 justify-center"
				pageRangeDisplayed={2}
				previousLabel={"<"}
				previousLinkClassName="flex items-center px-3 py-2 text-gray-300"
			/>
			<Select
				onSelectionChange={(key) => {
					searchProps.setOrderBy(key as string);
				}}
			>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<Popover>
					<ListBox>
						<Collection items={sort}>
							{(item) => {
								return (
									<ListBoxItem key={item.id} textValue={item.name}>
										{item.name}
									</ListBoxItem>
								);
							}}
						</Collection>
					</ListBox>
				</Popover>
			</Select>
		</div>
	) : null;
}
