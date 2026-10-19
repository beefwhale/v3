import type { MdastNode, MdastPluginDefinition, MdastVisitorContext } from "satteri";

type MathNode = Extract<MdastNode, { type: "math" | "inlineMath" }>;

/** Preserve equation labels before satteri-katex renders the math. */
export function satteriMathLabelsPlugin(): MdastPluginDefinition {
	function preserveLabels(node: Readonly<MathNode>, context: MdastVisitorContext) {
		// MathJax-style labels become linkable anchors; KaTeX does not parse \label.
		const labels: string[] = [];
		const equation = node.value.replace(/\\label\{([^{}]+)\}/g, (_, label: string) => {
			labels.push(
				label
					.replaceAll("&", "&amp;")
					.replaceAll('"', "&quot;")
					.replaceAll("<", "&lt;")
					.replaceAll(">", "&gt;"),
			);
			return "";
		});
		if (!labels.length) return;
		context.insertBefore(node, {
			type: "html",
			value: labels.map((label) => `<span id="${label}"></span>`).join(""),
		});
		context.setProperty(node, "value", equation);
	}
	return {
		name: "cactus-math-labels",
		math: preserveLabels,
		inlineMath: preserveLabels,
	};
}
