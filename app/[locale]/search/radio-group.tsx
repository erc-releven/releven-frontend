"use client";

import type { ReactNode } from "react";
import { RadioGroup as AriaRadioGroup } from "react-aria-components";

interface RadioGroupProps {
	children: ReactNode;
	defaultValue?: string;
	name: string;
}

export function RadioGroup(props: Readonly<RadioGroupProps>): ReactNode {
	return (
		<AriaRadioGroup className="flex flex-col" defaultValue={props.defaultValue}>
			{props.children}
		</AriaRadioGroup>
	);
}
