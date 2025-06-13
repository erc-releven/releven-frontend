import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { ServerImage } from "@/components/server-image";
import { Button } from "@/components/ui/button";

interface IconCardProps {
	icon: string | StaticImport;
	title: string;
	description: string;
}

export function IconCard(props: Readonly<IconCardProps>): ReactNode {
	const t = useTranslations("IndexPage");
	return (
		<div className="grid w-[19rem] grid-cols-1 grid-rows-[7rem_0rem_19rem] overflow-hidden border border-gray-500">
			<div className="bg-[#0000001e]"></div>
			<ServerImage
				alt=""
				className="relative left-[calc(50%-3rem)] size-24 self-center rounded-full bg-white p-4"
				src={props.icon}
			/>
			<div className="bg-[#FBF7F0] px-6 pt-16">
				<span className="block text-lg font-bold text-nowrap text-primary">{props.title}</span>
				<div className="py-6">{props.description}</div>
				<div className="relative">
					<Button className="absolute right-6 uppercase">{t("try_it_out")}</Button>
				</div>
			</div>
		</div>
	);
}
