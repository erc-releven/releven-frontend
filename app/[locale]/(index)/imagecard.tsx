import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useTranslations } from "next-intl";
import { type ReactNode, Suspense } from "react";

import { Link } from "@/components/link";
import { ServerImage } from "@/components/server-image";
import { Button } from "@/components/ui/button";
import type { paths } from "@/lib/api-client/api";

import { DataCount } from "./data-count";

interface ImageCardProps {
	icon: string | StaticImport;
	image: string | StaticImport;
	title: string;
	countPath: keyof paths;
	description: string;
	href: string;
}

export function ImageCard(props: Readonly<ImageCardProps>): ReactNode {
	const t = useTranslations("IndexPage");
	return (
		<div className="grid w-[19rem] grid-cols-1 grid-rows-[4.5rem_12rem_1fr_3rem] overflow-hidden border border-gray-500 text-ellipsis">
			<div className="flex flex-row items-center justify-start gap-4 p-4">
				<ServerImage
					alt=""
					className="size-10 rounded-full bg-[#0000001e] p-2"
					height={40}
					src={props.icon}
					width={40}
				/>
				<div className="w-full text-nowrap">
					<span className="block text-lg font-medium">{props.title}</span>
					<span className="block">
						<Suspense>
							<DataCount path={props.countPath} />
						</Suspense>
					</span>
				</div>
			</div>
			<div className="relative">
				<ServerImage alt="" className="object-cover" fill={true} src={props.image} />
			</div>
			<div className="p-4">{props.description}</div>
			<div className="relative w-full">
				<Link href={props.href}>
					<Button className="absolute right-2 bottom-3 uppercase">{t("try_it_out")}</Button>
				</Link>
			</div>
		</div>
	);
}
