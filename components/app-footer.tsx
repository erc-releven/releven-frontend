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
		privacy: { href: createHref({ pathname: "/imprint" }), label: t("links.imprint") },
		faq: { href: createHref({ pathname: "/imprint" }), label: t("links.imprint") },
		about: { href: createHref({ pathname: "/imprint" }), label: t("links.imprint") },
	} satisfies Record<string, { href: LinkProps["href"]; label: string }>;

	return (
		<footer className="border-t">
			<div className="container flex items-center justify-between gap-4 py-6">
				<Image alt="" height={52} src="/assets/logo.svg" width={52} />
				<div>imprint</div>
				<div>FAQ</div>
				<div>about</div>
				<div>helpdesk</div>
			</div>
			<div className="container flex items-center justify-between gap-4 py-6">
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
