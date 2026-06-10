import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
	forceCenter,
	forceCollide,
	forceLink,
	forceManyBody,
	forceSimulation,
	type SimulationLinkDatum,
	type SimulationNodeDatum,
} from "d3-force";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/ui/main-content";
import type { IntlLocale } from "@/lib/i18n/locales";

import {
	type EdgeAttestation,
	type GraphEdge,
	type GraphNode,
	type GraphRelation,
	RelationshipGraph,
} from "./_components/relationship-graph";

interface RelationshipsPageProps {
	params: Promise<{ locale: IntlLocale }>;
}

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("AppHeader");
	return { title: t("navigation.items.resources.social-relationships.title") };
}

interface Row {
	relation_assertion_by_name: string;
	related_person_name: string;
	source_passage_content: string;
	source_passage_reference_string: string;
	social_relationship_type: string;
	person_name: string;
	count: number;
}

function parseCsv(text: string): Array<Row> {
	const lines = text.split("\n");
	const counts = new Map<string, number>();
	const seen = new Map<string, Row>();

	for (let i = 1; i < lines.length; i++) {
		const line = lines[i]!.trim();
		if (!line) continue;

		const fields: Array<string> = [];
		let current = "";
		let inQuotes = false;

		for (let j = 0; j < line.length; j++) {
			const ch = line[j]!;
			if (ch === '"') {
				if (inQuotes && line[j + 1] === '"') {
					current += '"';
					j++;
				} else {
					inQuotes = !inQuotes;
				}
			} else if (ch === "," && !inQuotes) {
				fields.push(current);
				current = "";
			} else {
				current += ch;
			}
		}
		fields.push(current);

		if (fields.length >= 6 && fields[5] !== "" && fields[1] !== "") {
			const key = fields.join("\0");
			counts.set(key, (counts.get(key) ?? 0) + 1);
			if (!seen.has(key)) {
				seen.set(key, {
					relation_assertion_by_name: fields[0]!,
					related_person_name: fields[1]!,
					source_passage_content: fields[2]!,
					source_passage_reference_string: fields[3]!,
					social_relationship_type: fields[4]!,
					person_name: fields[5]!,
					count: 0,
				});
			}
		}
	}

	for (const [key, row] of seen) {
		row.count = counts.get(key)!;
	}

	return Array.from(seen.values());
}

interface ForceNode extends SimulationNodeDatum {
	id: string;
}

interface ForceLink extends SimulationLinkDatum<ForceNode> {
	source: string | ForceNode;
	target: string | ForceNode;
}

function computeLayout(rows: Array<Row>): { nodes: Array<GraphNode>; edges: Array<GraphEdge> } {
	const personSet = new Set<string>();
	for (const row of rows) {
		personSet.add(row.person_name);
		personSet.add(row.related_person_name);
	}

	// Build per-person relation lists, preserving directionality.
	// Key structure: Map<person → Map<related_person → { outgoing: Set<type>, incoming: Set<type> }>>
	const relationsMap = new Map<
		string,
		Map<string, { outgoing: Set<string>; incoming: Set<string> }>
	>();
	const ensureEntry = (subject: string, related: string) => {
		if (!relationsMap.has(subject)) relationsMap.set(subject, new Map());
		const byPerson = relationsMap.get(subject)!;
		if (!byPerson.has(related)) byPerson.set(related, { outgoing: new Set(), incoming: new Set() });
		return byPerson.get(related)!;
	};
	for (const row of rows) {
		ensureEntry(row.person_name, row.related_person_name).outgoing.add(
			row.social_relationship_type,
		);
		ensureEntry(row.related_person_name, row.person_name).incoming.add(
			row.social_relationship_type,
		);
	}

	// Merge rows with the same person pair (normalised by alphabetical sort) into one edge
	const edgeGroups = new Map<
		string,
		{ source: string; target: string; attestations: Array<EdgeAttestation> }
	>();
	for (const row of rows) {
		const [a, b] =
			row.person_name < row.related_person_name
				? [row.person_name, row.related_person_name]
				: [row.related_person_name, row.person_name];
		const key = `${a}\0${b}`;
		if (!edgeGroups.has(key)) {
			edgeGroups.set(key, {
				source: row.person_name,
				target: row.related_person_name,
				attestations: [],
			});
		}
		edgeGroups.get(key)!.attestations.push({
			label: row.social_relationship_type,
			count: row.count,
			assertedBy: row.relation_assertion_by_name,
			reference: row.source_passage_reference_string,
			sourcePassage: row.source_passage_content,
		});
	}

	const forceNodes: Array<ForceNode> = Array.from(personSet).map((id) => {
		return { id };
	});
	const forceLinks: Array<ForceLink> = Array.from(edgeGroups.values()).map(({ source, target }) => {
		return {
			source,
			target,
		};
	});

	const simulation = forceSimulation<ForceNode>(forceNodes)
		.force(
			"link",
			forceLink<ForceNode, ForceLink>(forceLinks)
				.id((d) => {
					return d.id;
				})
				.distance(120)
				.strength(0.3),
		)
		.force("charge", forceManyBody<ForceNode>().strength(-250))
		.force("center", forceCenter(0, 0))
		.force("collide", forceCollide<ForceNode>(55))
		.stop();

	// tick to convergence without running in the browser
	const iterations = Math.ceil(
		Math.log(simulation.alphaMin()) / Math.log(1 - simulation.alphaDecay()),
	);
	simulation.tick(iterations);

	const positionById = new Map<string, { x: number; y: number }>();
	for (const node of forceNodes) {
		positionById.set(node.id, { x: node.x ?? 0, y: node.y ?? 0 });
	}

	const nodes: Array<GraphNode> = forceNodes.map((n) => {
		const byPerson = relationsMap.get(n.id);
		const relations: Array<GraphRelation> = [];
		if (byPerson) {
			for (const [person, dirs] of byPerson) {
				for (const type of dirs.outgoing) relations.push({ person, type, direction: "outgoing" });
				for (const type of dirs.incoming) relations.push({ person, type, direction: "incoming" });
			}
		}
		// Outgoing first, then incoming; alphabetical within each group
		relations.sort((a, b) => {
			if (a.direction !== b.direction) return a.direction === "outgoing" ? -1 : 1;
			return a.person.localeCompare(b.person);
		});
		return { id: n.id, x: n.x ?? 0, y: n.y ?? 0, relations };
	});

	const edges: Array<GraphEdge> = Array.from(edgeGroups.values()).map(
		({ source, target, attestations }, i) => {
			return {
				id: `e-${String(i)}`,
				source,
				target,
				totalCount: attestations.reduce((sum, a) => {
					return sum + a.count;
				}, 0),
				attestations,
			};
		},
	);

	return { nodes, edges };
}

export default async function RelationshipsPage(
	props: Readonly<RelationshipsPageProps>,
): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;

	setRequestLocale(locale);

	const t = await getTranslations("AppHeader");
	const title = t("navigation.items.resources.social-relationships.title");

	const csvPath = join(process.cwd(), "content", "socialrelationships.csv");
	const csvText = await readFile(csvPath, "utf-8");
	const rows = parseCsv(csvText);
	const { nodes, edges } = computeLayout(rows);

	const stats = [
		{ label: "Persons", value: nodes.length },
		{ label: "Relationships", value: rows.length },
		{
			label: "Relationship types",
			value: new Set(
				rows.map((r) => {
					return r.social_relationship_type;
				}),
			).size,
		},
		{
			label: "Source references",
			value: new Set(
				rows.map((r) => {
					return r.source_passage_reference_string;
				}),
			).size,
		},
		{
			label: "Asserters",
			value: new Set(
				rows.map((r) => {
					return r.relation_assertion_by_name;
				}),
			).size,
		},
	];

	return (
		<MainContent className="layout-grid content-start">
			<section className="relative layout-subgrid grid gap-y-6 bg-fill-weaker py-16 xs:py-20">
				<div className="grid max-w-text gap-y-4">
					<h1 className="font-heading text-heading-1 font-strong text-balance text-text-strong">
						{title}
					</h1>
				</div>
				<dl className="flex flex-wrap gap-x-8 gap-y-4">
					{stats.map(({ label, value }) => {
						return (
							<div key={label} className="grid gap-y-1">
								<dt className="text-small text-text-weak">{label}</dt>
								<dd className="font-heading text-heading-3 font-strong text-text-strong tabular-nums">
									{value.toLocaleString()}
								</dd>
							</div>
						);
					})}
				</dl>
			</section>

			<section
				className="relative border-t border-stroke-weak"
				style={{ height: "calc(100vh - 260px)" }}
			>
				<RelationshipGraph edges={edges} nodes={nodes} />
			</section>
		</MainContent>
	);
}
