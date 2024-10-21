import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

interface ImageCardProps {
	icon: string | StaticImport;
	image: string | StaticImport;
	title: string;
	subtitle: string;
	description: string;
}

export function ImageCard(props: ImageCardProps): ReactNode {
	return (
		<div className="grid w-[19rem] grid-rows-[4.5rem_12rem_4.5rem_3rem] border border-gray-500">
			<div className="flex flex-row items-center justify-start gap-4 p-4">
				<Image
					alt=""
					className="size-10 rounded-full bg-[#0000001e] p-2"
					height={40}
					src={props.icon}
					width={40}
				/>
				<div>
					<span className="block text-lg font-medium">{props.title}</span>
					<span className="block">{props.subtitle}</span>
				</div>
			</div>
			<div className="relative">
				<Image alt="" className="object-cover" fill={true} src={props.image} />
			</div>
			<div className="p-4">{props.description}</div>
			<div className="relative">
				<Button className="absolute right-4">try it out</Button>
			</div>
		</div>
	);
}
