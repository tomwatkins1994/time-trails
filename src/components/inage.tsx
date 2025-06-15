import { blurhashToCssGradientString } from "@unpic/placeholder";
import type { ComponentProps } from "react";

export interface ImageProps extends ComponentProps<"img"> {
	blurhash?: string | null;
}

export function Image({ blurhash, alt, ...props }: ImageProps) {
	const background = blurhash ? blurhashToCssGradientString(blurhash) : "";

	return <img style={{ background }} {...props} alt={alt} />;
}
