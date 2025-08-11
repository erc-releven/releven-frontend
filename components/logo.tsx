import type { ReactNode } from "react";

import logo from "@/public/assets/images/releven-logo.png";

import { Image } from "./image";

interface LogoProps {
	className?: string;
}

export function Logo(props: Readonly<LogoProps>): ReactNode {
	const { className } = props;

	return <Image alt={""} aria-hidden={true} className={className} height={48} src={logo} />;
}
