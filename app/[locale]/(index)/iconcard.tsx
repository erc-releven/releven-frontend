import type { StaticImport } from "next/dist/shared/lib/get-img-props";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { Link } from "@/components/link";
import { ServerImage } from "@/components/server-image";
import { Button } from "@/components/ui/button";

interface IconCardProps {
	description: string;
	href?: string;
	icon: string | StaticImport;
	isExternal?: boolean;
	title: string;
}

const buttonClassName =
	"absolute right-2 bottom-3 interactive isolate inline-flex items-center justify-center gap-x-2 border border-transparent text-center outline-transparent transition hover:hover-overlay focus-visible:focus-outline pressed:press-overlay shadow-raised min-h-12 px-4 py-2.5 rounded-2 text-small font-strong bg-fill-brand-strong text-text-inverse-strong uppercase hover:cursor-pointer";

interface CardLinkProps {
	href: string;
	isExternal?: boolean;
	children: ReactNode;
}

function CardLink(props: Readonly<CardLinkProps>): ReactNode {
	const { href, isExternal, children } = props;

	if (isExternal) {
		return (
			<a className={buttonClassName} href={href} rel="noopener noreferrer" target="_blank">
				{children}
			</a>
		);
	}

	return (
		<Link href={href}>
			<Button className="absolute right-2 bottom-3 uppercase hover:cursor-pointer">
				{children}
			</Button>
		</Link>
	);
}

export async function IconCard(props: Readonly<IconCardProps>): Promise<ReactNode> {
	const { description, href, icon, isExternal, title } = props;
	const t = await getTranslations("IconCard");

	return (
		<div className="grid w-[19rem] grid-cols-1 grid-rows-[7rem_0rem_19rem] overflow-hidden border border-gray-500">
			<div className="bg-[#0000001e]"></div>
			<ServerImage
				alt=""
				className="relative left-[calc(50%-3rem)] size-24 self-center rounded-full bg-white p-4"
				src={icon}
			/>
			<div className="flex flex-col bg-[#FBF7F0] px-6 pt-16">
				<div className="flex-1">
					<span className="block text-lg font-bold text-primary">{title}</span>
					<div className="py-6">{description}</div>
				</div>
				<div className="relative w-full">
					{href ? (
						<CardLink href={href} isExternal={isExternal}>
							{t("explore")}
						</CardLink>
					) : (
						<Button className="absolute right-2 bottom-3 uppercase" isDisabled={true}>
							{t("coming-soon")}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
