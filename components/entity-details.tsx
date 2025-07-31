"use client";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Disclosure, DisclosurePanel, Heading } from "react-aria-components";

import { Button } from "./ui/button";
import { MainContent } from "./ui/main-content";

interface EntityDetailsProps {
	title?: string | null;
	details?: object;
	prefix?: string;
}

function keyToNiceLabel(key: string): string {
	return key.replaceAll("_", " ");
}

function wrapKeyValue(key: string, value: ReactNode) {
	return (
		<>
			<span className="text-sm font-medium text-primary uppercase">{key}</span>: {value}
		</>
	);
}

function objectToReactNode(o: unknown, prefix = ""): ReactNode | undefined {
	if (o instanceof Object) {
		const nodes = Object.entries(o)
			.map<[string, ReactNode] | undefined>(([k, v]) => {
				if (String(v).startsWith("https://r11.eu/")) {
					return undefined;
				}
				const child = objectToReactNode(v, k);
				return child ? ([keyToNiceLabel(k.replace(prefix, "")), child] as const) : undefined;
			})
			.filter((o) => {
				return o !== undefined;
			});
		switch (nodes.length) {
			case 0:
				return undefined;
			case 1:
				return nodes[0]![1];
			default:
				if (o instanceof Array) {
					return (
						<ol className="my-2 ml-4 list-decimal">
							{nodes.map(([k, v]) => {
								// TODO include link to rdf id
								return <li key={k}>{v}</li>;
							})}
						</ol>
					);
				} else {
					return (
						<ul className="my-2 ml-4 list-disc">
							{nodes.map(([k, v]) => {
								return <li key={k}>{wrapKeyValue(k, v)}</li>;
							})}
						</ul>
					);
				}
		}
	} else {
		return o ? <pre className="ml-2 inline">{new String(o)}</pre> : undefined;
	}
}

export function EntityDetails(props: Readonly<EntityDetailsProps>): ReactNode {
	const { title, details, prefix } = props;
	if (details) {
		return (
			<MainContent className="mx-auto w-full max-w-screen-xl px-8">
				<h1>{title}</h1>
				<div>{objectToReactNode(details, prefix)}</div>
				<Disclosure className="m-8">
					<Heading>
						<Button slot="trigger">
							{"show raw data"}
							<ChevronRight aria-hidden={true} data-slot="icon" size={12} />
						</Button>
					</Heading>
					<DisclosurePanel>
						<pre className="mt-4 border-1 p-2">{JSON.stringify(details, null, 2)}</pre>
					</DisclosurePanel>
				</Disclosure>
			</MainContent>
		);
	} else {
		notFound();
	}
}
