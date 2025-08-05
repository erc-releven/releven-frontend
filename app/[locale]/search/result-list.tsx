import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { getSearchResults } from "@/lib/data";
import type { SearchRecordType } from "@/lib/model";

import { ResultListNavigation } from "./result-list-navigation";

interface ResultListProps {
	searchParams?: {
		type?: SearchRecordType; // TODO add validation
		page?: number;
	};
}

export async function ResultList(props: Readonly<ResultListProps>) {
	const { searchParams } = props;
	try {
		const data = await getSearchResults(searchParams?.type, searchParams?.page);

		if (data.total) {
			return (
				<>
					<ResultListNavigation data={data} />
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
					<ResultListNavigation data={data} />
				</>
			);
		}
	} catch (error) {
		// error or no data
		return <div>{new String(error)}</div>;
	}
	return (
		<div className="m-8 text-center text-lg font-medium text-primary">
			{"your search yielded no results"}
		</div>
	);
}
