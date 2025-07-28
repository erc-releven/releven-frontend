"use client";
import type { ReactNode } from "react";
import ReactPaginate from "react-paginate";

import { ListBox, ListBoxItem } from "@/components/ui/listbox";
import { Popover } from "@/components/ui/popover";
import { Select, SelectTrigger } from "@/components/ui/select";
import type { SearchRecordResult } from "@/lib/model";
import { usePathname, useRouter, useSearchParams } from "@/lib/navigation/navigation";

interface ResultListNavigationProps {
	data: SearchRecordResult;
	sortBy?: string;
	sortOptions?: Array<string>;
}

export function ResultListNavigation(props: Readonly<ResultListNavigationProps>): ReactNode {
	const { data } = props;
	const sort = ["name", "relevance"]; // TODO

	const pathname = usePathname();
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	const { push } = useRouter();

	const buildHref = (pageIndex: number) => {
		params.set("page", pageIndex.toString());
		return `${pathname}?${params.toString()}`;
	};

	return (
		<div className="mx-6 my-4 flex items-center justify-between">
			<div>
				{data.total} {"Result(s)"}
			</div>
			<ReactPaginate
				activeLinkClassName="bg-primary text-white"
				breakClassName="flex items-center px-3 py-3 text-gray-300"
				containerClassName="flex flex-row items-center"
				disableInitialCallback={true}
				hrefBuilder={buildHref}
				initialPage={data.page - 1}
				marginPagesDisplayed={2}
				nextLabel={">"}
				nextLinkClassName="flex items-center px-3 py-3 text-gray-300"
				onPageChange={({ selected }) => {
					push(buildHref(selected + 1));
				}}
				pageCount={data.pages}
				pageLinkClassName="border-1 border-gray-100 flex items-center mx-1 min-w-10 px-2 py-2 rounded-1 text-gray-500 justify-center"
				pageRangeDisplayed={2}
				previousLabel={"<"}
				previousLinkClassName="flex items-center px-3 py-2 text-gray-300"
			/>
			<Select>
				<SelectTrigger>{`sort by: ${sort[0]!}`}</SelectTrigger>
				<Popover>
					<ListBox>
						{sort.map((option) => {
							return (
								<ListBoxItem key={option} textValue={""}>
									{option}
								</ListBoxItem>
							);
						})}
					</ListBox>
				</Popover>
			</Select>
		</div>
	);
}
