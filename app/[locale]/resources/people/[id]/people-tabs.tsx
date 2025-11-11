"use client";
import { useTranslations } from "next-intl";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";

import type { components } from "@/lib/api-client/api";

export function PeopleTabs(props: Readonly<{ data: components["schemas"]["PeopleDetail"] }>) {
	const t = useTranslations("ResourcesPage");
	const { data } = props;
	return (
		<Tabs>
			<TabList>
				<Tab id="identity">{t("PeoplePage.tabs.identity")}</Tab>
				<Tab id="life_events">{t("PeoplePage.tabs.life_events")}</Tab>
				<Tab id="cursus">{t("PeoplePage.tabs.cursus")}</Tab>
				<Tab id="viewpoints">{t("PeoplePage.tabs.viewpoints")}</Tab>
			</TabList>
			<TabPanel id="identity">
				{data.person_name_of_person_assertion.length ? (
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
							{data.person_name_of_person_assertion.map((a, i) => {
								return (
									<tr key={i}>
										<td>{a.person_name_of_person_is}</td>
										<td>{a.person_name_of_person_by?.person_display_name}</td>
										<td>{a.person_name_of_person_based}</td>
										<td>
											{a.person_name_of_person_src?.passage_content
												? `"${a.person_name_of_person_src.passage_content}"`
												: null}{" "}
											{a.person_name_of_person_src?.passage_reference_string
												? `(${a.person_name_of_person_src.passage_reference_string})`
												: null}
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				) : null}
				{data.person_religious_affiliation.length ? (
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
							{data.person_religious_affiliation.map((_a, i) => {
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
				{data.person_legal_role.length ? (
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
							{data.person_legal_role.map((a, i) => {
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
				{data.person_gender_assignment.length ? (
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
							{data.person_gender_assignment.map((assignment, i) => {
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
			</TabPanel>
			<TabPanel id="life_events"></TabPanel>
			<TabPanel id="cursus"></TabPanel>
			<TabPanel id="viewpoints"></TabPanel>
		</Tabs>
	);
}
