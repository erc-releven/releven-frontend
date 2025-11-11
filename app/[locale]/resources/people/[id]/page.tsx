import { getTranslations } from "next-intl/server";

import notFound from "@/app/not-found";
import { EntityDetails } from "@/components/entity-details";
import { client } from "@/lib/data";

interface DetailPageProps {
	params: {
		id: string;
	};
}

export default async function PeoplePage(props: Readonly<DetailPageProps>) {
	const t = await getTranslations("ResourcesPage");
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
			<div className="flex flex-col gap-6 p-6">
				{details.data.person_name_of_person_assertion.length ? (
					<table className="w-full table-fixed">
						<thead>
							<tr>
								<th>{t("PeoplePage.name")}</th>
								<th>{t("according_to")}</th>
								<th>{t("based_on")}</th>
								<th>{t("mentioned_in")}</th>
							</tr>
						</thead>
						<tbody>
							{details.data.person_name_of_person_assertion.map((a, i) => {
								return (
									<tr key={i}>
										<td>{a.person_name_of_person_is}</td>
										<td>{a.person_name_of_person_by?.person_display_name}</td>
										<td>{a.person_name_of_person_based}</td>
										<td>{a.person_name_of_person_src?.passage_reference_string}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				) : null}
				{details.data.person_religious_affiliation.length ? (
					<table className="w-full table-fixed">
						<thead>
							<tr>
								<th>{t("PeoplePage.religious_affiliation")}</th>
								<th>{t("according_to")}</th>
								<th>{t("based_on")}</th>
								<th>{t("mentioned_in")}</th>
							</tr>
						</thead>
						<tbody>
							{details.data.person_religious_affiliation.map((_a, i) => {
								return (
									<tr key={i}>
										<td>{"TODO"}</td>
										<td>{"TODO"}</td>
										<td>{"TODO"}</td>
										<td>{"TODO"}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				) : null}
				{details.data.person_legal_role.length ? (
					<table className="w-full table-fixed">
						<thead>
							<tr>
								<th>{t("PeoplePage.legal_role")}</th>
								<th>{t("according_to")}</th>
								<th>{t("based_on")}</th>
								<th>{t("mentioned_in")}</th>
							</tr>
						</thead>
						<tbody>
							{details.data.person_legal_role.map((a, i) => {
								return (
									<tr key={i}>
										<td>{a}</td>
										<td>{"TODO"}</td>
										<td>{"TODO"}</td>
										<td>{"TODO"}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				) : null}
				{details.data.person_gender_assignment.length ? (
					<table className="w-full table-fixed">
						<thead>
							<tr>
								<th>{t("PeoplePage.gender_assignment")}</th>
								<th>{t("according_to")}</th>
								<th>{t("based_on")}</th>
								<th>{t("mentioned_in")}</th>
							</tr>
						</thead>
						<tbody>
							{details.data.person_gender_assignment.map((assignment, i) => {
								return (
									<tr key={i}>
										<td>
											{assignment.person_gender_assignment_gender_assertion
												.map((assertion) => {
													return assertion.person_gender_assignment_gender_is?.gender_display_name;
												})
												.join(", ")}
										</td>
										<td></td>
										<td></td>
										<td></td>
									</tr>
								);
							})}
						</tbody>
					</table>
				) : null}
			</div>
		</EntityDetails>
	);
}
