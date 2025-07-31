import { EntityDetails } from "@/components/entity-details";
import { client } from "@/lib/data";

interface DetailPageProps {
	params: {
		id: string;
	};
}

export default async function PeoplePage(props: Readonly<DetailPageProps>) {
	const id = decodeURIComponent(props.params.id);
	const details = await client.GET("/text/detail", { params: { query: { id: id } } });
	return (
		<EntityDetails
			details={details.data}
			prefix="written_text"
			title={details.data?.written_text_display_name}
		/>
	);
}
