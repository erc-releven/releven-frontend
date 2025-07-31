import { EntityDetails } from "@/components/entity-details";
import { client } from "@/lib/data";

interface DetailPageProps {
	params: {
		id: string;
	};
}

export default async function PeoplePage(props: Readonly<DetailPageProps>) {
	const id = decodeURIComponent(props.params.id);
	const details = await client.GET("/people/detail", { params: { query: { id: id } } });
	return (
		<EntityDetails
			details={details.data}
			prefix="person"
			title={details.data?.person_display_name}
		/>
	);
}
