import { Image } from "@/components/image";
import { Link } from "@/components/link";
import { getCachedSearchResults, type SearchParams } from "@/lib/data";

import { ResultListNavigation } from "./result-list-navigation";

interface ResultListProps {
	searchParams?: SearchParams;
}

export async function ResultList(props: Readonly<ResultListProps>) {
	const { searchParams } = props;
	const data = await getCachedSearchResults(searchParams);

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
	} else {
		return <div className="m-auto text-lg font-medium text-primary">{"no results found"}</div>;
	}
}
