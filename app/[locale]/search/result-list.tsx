"use client";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { getSearchResults } from "@/lib/data";
import type { SearchRecordType } from "@/lib/model";

import { LoadingDiv } from "../_components/loading-div";
import { ResultListNavigation } from "./result-list-navigation";

export interface ResultListProps {
	orderBy: string | null; // FIXME type using API paths
	page: number;
	query: string;
	type: SearchRecordType;
	setOrderBy: (arg0: string | null) => unknown;
	setPage: (arg0: number) => unknown;
	setType: (arg0: SearchRecordType) => unknown;
}

export function ResultList(props: Readonly<ResultListProps>) {
	const { orderBy, type, page, query } = props;
	const { isLoading, isError, isPlaceholderData, data, error } = useQuery({
		queryFn: () => {
			return getSearchResults(type, page, query, orderBy);
		},
		queryKey: [type, page, query, orderBy],
		placeholderData: keepPreviousData,
	});
	if (isError) {
		return <div>{new String(error)}</div>;
	} else {
		return (
			<>
				<ResultListNavigation data={data} searchProps={props} />
				{isLoading || isPlaceholderData ? (
					<LoadingDiv />
				) : data ? (
					<ul>
						{data.items.map((it) => {
							return (
								<li key={it.id}>
									<div className="mx-6 flex flex-col border-b-1 border-gray-200 py-6">
										<Link
											className="mb-2 text-lg font-medium text-primary"
											href={`/resources/${it.type}/${encodeURIComponent(it.id)}`}
										>
											<Image
												alt={it.type}
												className="inline"
												height={32}
												src={`/assets/images/${it.type}.svg`}
												width={32}
											/>{" "}
											{it.name}
										</Link>
										<p>{it.description}</p>
									</div>
								</li>
							);
						})}
					</ul>
				) : (
					<div className="m-8 text-center text-lg font-medium text-primary">
						{"your search yielded no results"}
					</div>
				)}
				<ResultListNavigation data={data} searchProps={props} />
			</>
		);
	}
}
