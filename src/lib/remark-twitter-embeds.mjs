import { transformTwitterCodeBlock } from './twitter-embed.mjs';

const visitChildren = (node) => {
  if (!node || typeof node !== 'object' || !Array.isArray(node.children)) {
    return;
  }

  node.children = node.children.map((child) => {
    const transformed = transformTwitterCodeBlock(child);
    if (transformed) {
      return transformed;
    }

    visitChildren(child);
    return child;
  });
};

export const remarkTwitterEmbeds = () => {
  return (tree) => {
    visitChildren(tree);
  };
};
