"use client";
import { type ReactNode, useState } from "react";
import { SearchField } from "react-aria-components";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "@/lib/navigation/navigation";

interface SearchInputProps {}

export function SearchInput(_props: Readonly<SearchInputProps>): ReactNode {
	const { replace } = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const setSearchParams = (key: string, value: string) => {
		const params = new URLSearchParams(searchParams);
		params.set(key, value);
		replace(`${pathname}?${params.toString()}`);
	};

	const [searchTerm, setSearchTerm] = useState(searchParams.get("search") ?? "");
	return (
		<SearchField className="flex flex-row">
			<Label></Label>
			<Input
				className="w-80 rounded-l-full"
				onChange={(e) => {
					setSearchTerm(e.target.value);
				}}
				placeholder="Search"
				value={searchTerm}
			/>
			<Button
				className="w-16 rounded-r-full"
				onClick={() => {
					setSearchParams("search", searchTerm);
				}}
			>
				{"🔎"}
			</Button>
		</SearchField>
	);
}
