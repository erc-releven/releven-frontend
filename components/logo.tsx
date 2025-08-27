import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";

import { Image } from "./image";

interface LogoProps {
	className?: string;
	image: StaticImageData;
}

export function Logo(props: Readonly<LogoProps>): ReactNode {
	const { className, image } = props;

	return <Image alt={""} aria-hidden={true} className={className} height={56} src={image} />;
}
