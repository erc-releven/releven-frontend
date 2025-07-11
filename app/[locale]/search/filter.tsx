import type { ReactNode } from "react";

interface FilterProps {}

export function Filter(_props: Readonly<FilterProps>): ReactNode {
	// TODO add disclosure pattern
	return (
		<div className="flex w-56 flex-col border border-gray-400">
			<div className="bg-gray-200 p-4 font-bold">{"Title"}</div>
			<div className="p-6">{"UI"}</div>
		</div>
	);
}
