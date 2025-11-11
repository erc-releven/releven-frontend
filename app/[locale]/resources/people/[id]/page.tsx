import notFound from "@/app/not-found";
import { EntityDetails } from "@/components/entity-details";
import { client } from "@/lib/data";

import { PeopleTabs } from "./people-tabs";

interface DetailPageProps {
	params: {
		id: string;
	};
}

export default async function PeoplePage(props: Readonly<DetailPageProps>) {
	const id = decodeURIComponent(props.params.id);
	const details = await client.GET("/people/detail", { params: { query: { id: id } } });

	if (details.error) {
		if (details.response.status === 404) {
			void notFound();
		}
		throw new Error(details.error as string);
	}

	return (
		<EntityDetails details={details.data} prefix="person" title={details.data.person_display_name}>
			<PeopleTabs data={details.data} />
		</EntityDetails>
	);
}
