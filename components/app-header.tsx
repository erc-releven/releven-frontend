import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { AppNavLink } from "@/components/app-nav-link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { createHref } from "@/lib/create-href";

export function AppHeader(): ReactNode {
	const t = useTranslations("AppHeader");

	return (
		<header className="border-b">
			<div className="container flex items-center justify-between gap-4 py-6">
				<Image alt="" height={62} src="/assets/images/releven.svg" width={120} />
				<div className="flex items-center gap-4">
					<nav aria-label={t("navigation-primary")}>
						<ul className="flex items-center gap-4 text-sm" role="list">
							<li>
								<AppNavLink href={createHref({ pathname: "/about" })}>
									{t("links.about")}
								</AppNavLink>
							</li>
							<li>
								<AppNavLink href={createHref({ pathname: "/faq" })}>{t("links.faq")}</AppNavLink>
							</li>
							<li>
								<AppNavLink href={createHref({ pathname: "/login" })}>
									{t("links.login")}
								</AppNavLink>
							</li>
						</ul>
					</nav>

					<LocaleSwitcher />
				</div>
			</div>
		</header>
	);
}
