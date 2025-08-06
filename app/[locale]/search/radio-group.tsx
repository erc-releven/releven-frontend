"use client";
import type { ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup as StyledRadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { SearchRecordType } from "@/lib/model";

interface RadioGroupProps {
	defaultValue?: string;
	name: string;
	options: Array<string>;
	onValueChange: (arg0: SearchRecordType) => unknown;
}

export function RadioGroup(props: Readonly<RadioGroupProps>): ReactNode {
	return (
		<StyledRadioGroup defaultValue={props.defaultValue} onValueChange={props.onValueChange}>
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
