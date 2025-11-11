import { ChevronRightIcon } from "lucide-react";
import { Button, Disclosure, DisclosurePanel, Heading } from "react-aria-components";

interface PreDisclosureProps {
	label?: string;
	content: string;
}

export function PreDisclosure(props: Readonly<PreDisclosureProps>) {
	const { label, content } = props;
	return (
		<Disclosure className="m-8">
			<Heading>
				<Button slot="trigger">
					{label ?? "show/hide raw data"}
					<ChevronRightIcon aria-hidden={true} data-slot="icon" size={12} />
				</Button>
			</Heading>
			<DisclosurePanel>
				<pre className="mt-4 w-full border-1 p-2">{content}</pre>
			</DisclosurePanel>
		</Disclosure>
	);
}
