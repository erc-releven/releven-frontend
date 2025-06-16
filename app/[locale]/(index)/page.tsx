import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { Image } from "@/components/image";
import { MainContent } from "@/components/ui/main-content";
import type { IntlLocale } from "@/lib/i18n/locales";
import discoverIcon from "@/public/assets/images/candle.png";
import clarin from "@/public/assets/images/clarin.png";
import coretrust from "@/public/assets/images/core-trust-seal.png";
import leaderImage from "@/public/assets/images/leader.png";
import searchIcon from "@/public/assets/images/magnifier.png";
import personImage from "@/public/assets/images/person.png";
import placeImage from "@/public/assets/images/place.png";
import researchPlatformImage from "@/public/assets/images/researchplatform.png";
import compareIcon from "@/public/assets/images/scale.png";
import textImage from "@/public/assets/images/text.png";

import { IconCard } from "./iconcard";
import { ImageCard } from "./imagecard";

interface IndexPageProps {
	params: Promise<{
		locale: IntlLocale;
	}>;
}

export async function generateMetadata(
	props: Readonly<IndexPageProps>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = await params;
	const _t = await getTranslations({ locale, namespace: "IndexPage" });

	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
		 */
		// title: undefined,
	};

	return metadata;
}

export default async function IndexPage(props: Readonly<IndexPageProps>): Promise<ReactNode> {
	const { params } = props;

	const { locale } = await params;

	setRequestLocale(locale);

	return (
		<MainContent>
			<IntroSection />
			<ResearchPlatformSection />
			<AboutSection />
			<ViewpointSection />
		</MainContent>
	);
}

function IntroSection(): ReactNode {
	const t = useTranslations("IndexPage");

	return (
		<section className="mx-auto flex w-full flex-col items-center gap-3 bg-[#FBF7F0] md:py-12 lg:flex-row">
			<div className="flex max-w-screen-lg basis-1/3 flex-col gap-6 px-8 py-5">
				<h1 className="text-3xl leading-tight font-bold tracking-tighter text-balance text-primary md:text-5xl lg:text-6xl">
					{t("title")}
				</h1>
				<div className="w-full max-w-screen-md sm:text-xl">{t("lead-in")}</div>
				<input
					className="rounded-full border border-solid border-gray-50 p-3"
					placeholder={t("search_placeholder")}
					type="search"
				/>
				<div className="flex flex-row gap-10 px-8">
					<Image alt="" src={clarin} />
					<Image alt="" src={coretrust} />
				</div>
			</div>
			<div className="basis-2/3">
				<Image alt="" className="object-cover" height={358} src={leaderImage} />
			</div>
		</section>
	);
}

function ResearchPlatformSection(): ReactNode {
	const t = useTranslations("IndexPage.researchplatform");
	const ts = useTranslations("AppHeader.navigation.items.resources");

	const cards = {
		people: { icon: personImage },
		places: { icon: placeImage },
		texts: { icon: textImage },
	};

	return (
		<section className="flex flex-col items-center py-20">
			<h2 className="text-lg font-extrabold text-primary uppercase">{t("title")}</h2>
			<span className="mb-20 text-3xl">{t("lead-in")}</span>
			<div className="flex flex-col items-center gap-4 lg:flex-row">
				{Object.entries(cards).map(([id, card]) => {
					return (
						<ImageCard
							key={id}
							description={ts(`${id}.description` as never)}
							icon={`/assets/images/${id}.svg`}
							image={card.icon}
							subtitle={ts(`${id}.subtitle` as never)}
							title={ts(`${id}.title` as never)}
						/>
					);
				})}
			</div>
		</section>
	);
}

function AboutSection() {
	const _t = useTranslations("IndexPage.about");
	return (
		<section className="flex flex-col items-center bg-[#CEA46F] p-10">
			<h2 className="text-lg font-extrabold text-primary uppercase">{_t("title")}</h2>
			<span className="block text-center text-3xl">{_t("lead-in")}</span>
			<div className="flex flex-col items-start gap-8 py-16 lg:flex-row">
				<Image alt="" className="max-w-fit" src={researchPlatformImage} />
				<div className="max-w-[31rem]">
					<p>{_t("description")}</p>
				</div>
			</div>
		</section>
	);
}

function ViewpointSection() {
	const _t = useTranslations("IndexPage.services");
	const cards = {
		related: { icon: searchIcon },
		viewpoints: { icon: compareIcon },
		relationships: { icon: discoverIcon },
	};
	return (
		<section className="flex flex-col items-center py-16">
			<h2 className="text-lg font-extrabold text-primary uppercase">{_t("title")}</h2>
			<span className="block text-center text-3xl">{_t("lead-in")}</span>
			<div className="flex flex-col gap-8 py-16 lg:flex-row">
				{Object.entries(cards).map(([id, card]) => {
					return (
						<IconCard
							key={id}
							description={_t(`${id}.description` as never)}
							icon={card.icon}
							title={_t(`${id}.title` as never)}
						/>
					);
				})}
			</div>
		</section>
	);
}
