import type { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { MainContent } from "@/components/main-content";
import type { Locale } from "@/config/i18n.config";
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
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: IndexPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
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

export default function IndexPage(props: IndexPageProps): ReactNode {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("IndexPage");

	return (
		<MainContent className="container w-full">
			<section className="mx-auto grid w-full grid-cols-[1fr_2fr] items-start justify-items-center gap-3 bg-[#FBF7F0] md:py-12">
				<div className="flex max-w-screen-lg flex-col gap-6 px-8 py-5">
					<h1 className="text-balance text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
						{t("title")}
					</h1>
					<div className="w-full max-w-screen-md text-on-muted sm:text-xl">{t("lead-in")}</div>
					<input
						className="rounded-full border border-solid border-gray-50 p-3"
						placeholder="Search"
						type="search"
					/>
					<div className="flex flex-row gap-10 px-8">
						<Image alt="" src={clarin} />
						<Image alt="" src={coretrust} />
					</div>
				</div>
				<div>
					<Image alt="" src={leaderImage} />
				</div>
			</section>

			<section className="flex flex-col items-center py-20">
				<h2 className="text-lg font-extrabold uppercase text-primary">research platform</h2>
				<span className="mb-20 text-3xl">Discover Resources from the 11th century</span>
				<div className="flex flex-row items-center gap-4">
					<ImageCard
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
						icon="/assets/images/person.svg"
						image={personImage}
						subtitle="Lorem ipsum"
						title="Persons"
					/>
					<ImageCard
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
						icon="/assets/images/place.svg"
						image={placeImage}
						subtitle="Lorem ipsum"
						title="Places"
					/>
					<ImageCard
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
						icon="/assets/images/text.svg"
						image={textImage}
						subtitle="Lorem ipsum"
						title="Texts"
					/>
				</div>
			</section>
			<section className="flex flex-col items-center bg-[#CEA46F] p-10">
				<h2 className="text-lg font-extrabold uppercase text-primary">About Us</h2>
				<span className="block text-center text-3xl">Discover more about Releven</span>
				<div className="flex flex-row items-start gap-8 py-16">
					<Image alt="" className="max-w-fit" src={researchPlatformImage} />
					<div className="max-w-[31rem]">
						<p>
							Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget
							dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes,
							nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium
							quis, sem. Nulla consequat massa quis enim.
						</p>
						<p>
							Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
							Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat
							massa quis enim.
						</p>
					</div>
				</div>
			</section>
			<section className="flex flex-col items-center py-16">
				<h2 className="text-lg font-extrabold uppercase text-primary">Services</h2>
				<span className="block text-center text-3xl">Find and compare viewpoints</span>
				<div className="flex flex-row gap-8 py-16">
					<IconCard
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
						icon={searchIcon}
						title="Find related entities"
					/>
					<IconCard
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
						icon={compareIcon}
						title="Compare viewpoints"
					/>
					<IconCard
						description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
						icon={discoverIcon}
						title="Discover new relationships"
					/>
				</div>
			</section>
		</MainContent>
	);
}
