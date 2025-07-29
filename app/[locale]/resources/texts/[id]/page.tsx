import { notFound } from "next/navigation";

import { MainContent } from "@/components/ui/main-content";
import { client } from "@/lib/data";

interface DetailPageProps {
	params: {
		id: string;
	};
}

export default async function PeoplePage(props: Readonly<DetailPageProps>) {
	const id = decodeURIComponent(props.params.id);
	const details = await client.GET("/text/detail", { params: { query: { id: id } } });
	if (details.data) {
		return (
			<MainContent className="mx-auto w-full max-w-screen-xl px-4">
				<h1>{details.data.written_text_display_name}</h1>
				<pre>{JSON.stringify(details, null, 2)}</pre>
				<div></div>
			</MainContent>
		);
	} else {
		notFound();
	}
}
