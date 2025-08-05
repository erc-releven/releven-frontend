"use client";
import { type ReactNode, useState } from "react";
import { SearchField } from "react-aria-components";

import { Image } from "@/components/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import searchIcon from "@/public/assets/images/magnifier.png";

interface SearchInputProps {
	searchTerm: string;
	setSearchTerm: (arg0: string) => unknown;
}

export function SearchInput(props: Readonly<SearchInputProps>): ReactNode {
	const { searchTerm, setSearchTerm } = props;
	const [localTerm, setLocalTerm] = useState(searchTerm);
	return (
		<div className="flex flex-row">
			<SearchField
				onChange={setLocalTerm}
				onSubmit={() => {
					setSearchTerm(localTerm);
				}}
			>
				<Label></Label>
				<Input className="w-80 rounded-l-full" placeholder="Search" value={localTerm} />
			</SearchField>
			<Button
				className="w-16 rounded-r-full"
				onClick={() => {
					setSearchTerm(localTerm);
				}}
				type="submit"
			>
				<Image
					alt={"search"}
					className="brightness-[1000] saturate-[0]"
					height={24}
					src={searchIcon}
					width={24}
				/>
			</Button>
		</div>
	);
}
