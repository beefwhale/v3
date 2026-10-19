import type { MdastPluginDefinition } from "satteri";
import { h } from "../utils/remark.ts";

/** Site-specific Markdown directives for captioned media and YouTube embeds. */
export function satteriMediaPlugin(): MdastPluginDefinition {
	return {
		name: "cactus-media",
		containerDirective(node) {
			if (node.name !== "figure") return;
			const [media, ...caption] = node.children;
			if (!media) return;
			return h("figure", { class: "post-figure" }, [
				media,
				...(caption.length ? [h("figcaption", {}, caption)] : []),
			]);
		},
		leafDirective(node) {
			if (node.name !== "youtube") return;
			const id = node.attributes?.id;
			if (!id || !/^[\w-]{11}$/.test(id))
				throw new Error("YouTube directive requires an 11-character video id.");
			const url = new URL(`https://www.youtube-nocookie.com/embed/${id}`);
			const query = node.attributes?.query;
			if (query) url.search = query;
			return h("div", { class: "post-video" }, [
				h("iframe", {
					src: url.href,
					title: node.attributes?.title || "YouTube video",
					loading: "lazy",
					allow:
						"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
					allowFullScreen: true,
					referrerPolicy: "strict-origin-when-cross-origin",
				}),
			]);
		},
	};
}
