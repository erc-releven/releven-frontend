import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface IconCardProps {
	icon: string | StaticImport;
	title: string;
	description: string;
}

export function IconCard(props: IconCardProps): ReactNode {
	return (
		<div className="grid w-[19rem] grid-rows-[7rem_0rem_19rem] border border-gray-500">
			<div className="bg-[#0000001e]"></div>
			<Image
				alt=""
				className="relative left-[calc(50%-3rem)] size-24 self-center rounded-full bg-white p-4"
				src={props.icon}
			/>
			<div className="bg-[#FBF7F0] px-6 pt-16">
				<span className="block text-lg font-bold text-primary">{props.title}</span>
				<div className="py-6">{props.description}</div>
				<div className="relative">
					<Button className="absolute right-4">try it out</Button>
				</div>
			</div>
		</div>
	);
}
