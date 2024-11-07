import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { AppNavLink } from "@/components/app-nav-link";
import { createHref } from "@/lib/create-href";

export function AppFooter(): ReactNode {
	const t = useTranslations("AppFooter");
	const linkT = useTranslations("AppFooter.links");

	return (
		<footer className="flex flex-col items-center border-t bg-primary text-white">
			<div className="container flex flex-col justify-between gap-4 py-6 lg:flex-row">
				<Image alt="" height={52} src="/assets/images/logo.svg" width={52} />

				<div className="w-44 text-sm">
					<Image alt="" className="pt-6" height={56} src="/assets/images/oeaw.svg" width={128} />
				</div>

				<div className="w-44 text-sm">
					<h2 className="text-lg font-semibold">{t("faq.title")}</h2>
					<div>{t("faq.q1")}</div>
				</div>
				<div className="w-44 text-sm">
					<h2 className="text-lg font-semibold">{t("about.title")}</h2>
					<div>{t("about.link1")}</div>
				</div>
				<div className="w-64 text-sm">
					<h2 className="text-lg font-semibold">{t("helpdesk.title")}</h2>
					<div>{t("helpdesk.leader")}</div>
					<input
						className="mt-3 w-full rounded-full border border-solid border-gray-50 px-3 py-1"
						placeholder={t("helpdesk.placeholder")}
						type="search"
					/>
				</div>
			</div>
			<div className="flex flex-row items-center justify-between gap-4 py-6">
				<nav aria-label={t("navigation-secondary")}>
					<ul
						className="flex items-center divide-x-2 divide-solid divide-white text-sm"
						role="list"
					>
						<li className="px-4">{t("copyright")}</li>
						{(["imprint", "privacy", "faq", "about"] as const).map((key) => {
							return (
								<li key={key} className="px-4">
									<AppNavLink className="text-white" href={createHref({ pathname: `/${key}` })}>
										{linkT(key)}
									</AppNavLink>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</footer>
	);
}
