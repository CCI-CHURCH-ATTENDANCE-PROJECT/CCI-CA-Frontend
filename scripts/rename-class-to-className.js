/**
 * Rename JSX attribute `class` to `className`
 */
module.exports = function transform(file, api) {
	const j = api.jscodeshift;
	const root = j(file.source);

	root
		.find(j.JSXAttribute, (attr) => {
			return attr?.name?.type === "JSXIdentifier" && attr.name.name === "class";
		})
		.forEach((p) => {
			p.node.name = j.jsxIdentifier("className");
		});

	return root.toSource({ quote: "double", reuseWhitespace: false });
};

// Command to run this script for components/ui directory
//pnpm dlx jscodeshift -t scripts/rename-class-to-className.js src/components/ui/**/*.tsx --parser=tsx
