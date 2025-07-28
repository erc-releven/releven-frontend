"use client";
import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup as StyledRadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePathname, useRouter, useSearchParams } from "@/lib/navigation/navigation";

interface RadioGroupProps {
	defaultValue?: string;
	name: string;
	options: Array<string>;
}

export function RadioGroup(props: Readonly<RadioGroupProps>): ReactNode {
	const { push } = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const setSearchParams = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams);
		params.set(key, value);
		push(`${pathname}?${params.toString()}`);
	};
	return (
		<StyledRadioGroup
			defaultValue={props.defaultValue}
			onValueChange={(value) => {
				setSearchParams(props.name, value);
			}}
		>
			{props.options.map((l) => {
				return (
					<div key={l}>
						<RadioGroupItem value={l}>{l}</RadioGroupItem>
						<Label className="ml-3 capitalize">{l}</Label>
					</div>
				);
			})}
		</StyledRadioGroup>
	);
}
