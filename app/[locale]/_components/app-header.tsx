import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { AppNavigation, AppNavigationMobile } from "@/app/[locale]/_components/app-navigation";
import { createHref } from "@/lib/navigation/create-href";
import type { NavigationItem } from "@/lib/navigation/navigation";

export function AppHeader(): ReactNode {
	const t = useTranslations("AppHeader");

	const label = t("navigation.label");

	const navigation = {
		home: {
			type: "link",
			href: createHref({ pathname: "/" }),
			label: t("navigation.items.home"),
		},
		resources: {
			type: "menu",
			label: t("navigation.items.resources.title"),
			children: {
				people: {
					type: "link",
					href: createHref({ pathname: "/search?type=people" }),
					label: t("navigation.items.resources.people.title"),
				},
				places: {
					type: "link",
					href: createHref({ pathname: "/search?type=places" }),
					label: t("navigation.items.resources.places.title"),
				},
				texts: {
					type: "link",
					href: createHref({ pathname: "/search?type=texts" }),
					label: t("navigation.items.resources.texts.title"),
				},
			},
		},
		about: {
			type: "menu",
			label: t("navigation.items.about.title"),
			children: {
				about: {
					type: "link",
					href: createHref({ pathname: "/about" }),
					label: t("navigation.items.about.summary"),
				},
				team: {
					type: "link",
					href: createHref({ pathname: "/about/team" }),
					label: t("navigation.items.about.team"),
				},
				casestudies: {
					type: "link",
					href: createHref({ pathname: "/about/case-studies" }),
					label: t("navigation.items.about.case-studies"),
				},
				technical: {
					type: "link",
					href: createHref({ pathname: "/about/technical" }),
					label: t("navigation.items.about.technical"),
				},
			},
		},
		publications: {
			type: "link",
			href: createHref({ pathname: "/publications" }),
			label: t("navigation.items.publications"),
		},
	} satisfies Record<string, NavigationItem>;

	return (
		<header className="layout-grid border-b border-stroke-weak bg-fill-weaker">
			<div className="flex justify-between gap-x-12">
				<AppNavigation label={label} navigation={navigation} />
				<AppNavigationMobile
					drawerCloseLabel={t("navigation.drawer.close")}
					drawerLabel={t("navigation.drawer.label")}
					drawerOpenLabel={t("navigation.drawer.open")}
					label={label}
					navigation={navigation}
				/>
			</div>
		</header>
	);
}
