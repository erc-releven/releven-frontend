import { Link } from "@/components/link";
import { getSearchResults, type SearchParams } from "@/lib/data";

import { ResultListNavigation } from "./result-list-navigation";

interface ResultListProps {
	searchParams?: SearchParams;
}

export async function ResultList(props: Readonly<ResultListProps>) {
	const { searchParams } = props;
	const page = searchParams!.page ?? 1;
	const data = await getSearchResults({ page: page });

	return (
		<>
			<ResultListNavigation data={data} />
			<ul>
				{data.items.map((it) => {
					return (
						<li key={it.id}>
							<div>
								<Link href={`/${it.type}/${it.id}`}>{it.name}</Link>
							</div>
						</li>
					);
				})}
			</ul>
			<ResultListNavigation data={data} />
		</>
	);
}
