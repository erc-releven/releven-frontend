import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { AppNavLink } from "@/components/app-nav-link";
import type { LinkProps } from "@/components/link";
import { createHref } from "@/lib/create-href";

export function AppFooter(): ReactNode {
	const t = useTranslations("AppFooter");

	const links = {
		imprint: { href: createHref({ pathname: "/imprint" }), label: t("links.imprint") },
		privacy: { href: createHref({ pathname: "/privacy" }), label: t("links.privacy") },
		faq: { href: createHref({ pathname: "/faq" }), label: t("links.faq") },
		about: { href: createHref({ pathname: "/about" }), label: t("links.about") },
	} satisfies Record<string, { href: LinkProps["href"]; label: string }>;

	return (
		<footer className="flex flex-col items-center border-t bg-primary text-white">
			<div className="container flex flex-col justify-between gap-4 py-6 lg:flex-row">
				<Image alt="" height={52} src="/assets/images/logo.svg" width={52} />
				<div className="w-44">
					<span>imprint</span>
					<Image alt="" height={56} src="/assets/images/oeaw.svg" width={128} />
				</div>
				<div className="w-44">
					<h2>FAQ</h2>
				</div>
				<div className="w-44">
					<h2>about</h2>
				</div>
				<div className="w-64">
					<h2>helpdesk</h2>
					<input
						className="mt-3 w-full rounded-full border border-solid border-gray-50 px-3 py-1"
						placeholder="Search Website"
						type="search"
					/>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between gap-4 py-6">
				<nav aria-label={t("navigation-secondary")}>
					<ul className="flex items-center gap-4 text-sm" role="list">
						{Object.entries(links).map(([id, link]) => {
							return (
								<li key={id}>
									<AppNavLink href={link.href}>{link.label}</AppNavLink>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</footer>
	);
}
