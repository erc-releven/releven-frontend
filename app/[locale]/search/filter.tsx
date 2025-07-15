import type { ReactNode } from "react";

interface FilterProps {
	canDisclose?: boolean;
	children?: ReactNode;
	description?: string;
	label: string;
}

export function Filter(props: Readonly<FilterProps>): ReactNode {
	// TODO add disclosure pattern
	const { children, label } = props;
	return (
		<div className="flex w-56 flex-col border border-gray-200">
			<div className="bg-gray-100 p-4 font-bold">{label}</div>
			<div className="p-4">{children}</div>
		</div>
	);
}
