import type { ReactNode } from "react";

import { ListBox, ListBoxItem } from "@/components/ui/listbox";
import { Popover } from "@/components/ui/popover";
import { Select, SelectTrigger } from "@/components/ui/select";
import type { SearchRecordResult } from "@/lib/model";

interface ResultListNavigationProps {
	data: SearchRecordResult;
	sortBy?: string;
	sortOptions?: Array<string>;
}

export function ResultListNavigation(props: Readonly<ResultListNavigationProps>): ReactNode {
	const { data } = props;
	const sort = ["name", "relevance"]; // TODO
	return (
		<div className="flex justify-between">
			<div>
				{data.total} {"Result(s)"}
			</div>
			<div>
				{data.page} / {data.pages}
			</div>
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
