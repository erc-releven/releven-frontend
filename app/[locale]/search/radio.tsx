"use client";
import type { ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "@/lib/navigation/navigation";

interface RadioProps {
	name: string;
	label: string;
	value: string;
}

export function Radio(props: Readonly<RadioProps>): ReactNode {
	const { label, value, name } = props;

	const { push } = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const setSearchParams = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams);
		params.set(key, value);
		push(`${pathname}?${params.toString()}`);
	};
	return (
		<Label className="flex flex-row items-center justify-between capitalize">
			{label}{" "}
			<Input
				name={name}
				onChange={(e) => {
					setSearchParams(props.name, e.target.value);
				}}
				type="radio"
				value={value}
			/>
		</Label>
	);
}
