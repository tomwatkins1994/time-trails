import { encode } from "blurhash";
import { getPixels } from "@unpic/pixels";

export async function getImageBlurhash(url: string): Promise<string> {
	const imageData = await getPixels(url);
	const data = Uint8ClampedArray.from(imageData.data);
	const blurhash = encode(data, imageData.width, imageData.height, 4, 4);

	return blurhash;
}
