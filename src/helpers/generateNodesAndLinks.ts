import * as go from "gojs";

type NodeData = {
  key: string;
  text: string;
  color: string;
  bounds: go.Rect;
};

type LinkData = {
  from: string;
  to: string;
  key: string;
  text: string;
};

const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateNodesAndLinks = (numNodes: number = 100, randomLinks = false): { nodes: NodeData[]; links: LinkData[] } => {
  const nodes: NodeData[] = [];
  const links: LinkData[] = [];
  const sqrt = Math.floor(Math.sqrt(numNodes));

  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      key: `nodeKey-${i}`,
      text: `Node ${i}`,
      color: getRandomColor(),
      bounds: new go.Rect((i % sqrt) * 140, Math.floor(i / sqrt) * 140, 70, 70),
    });

    if (i > 0) {
      links.push({
        from: `nodeKey-${i-1}`,
        to: `nodeKey-${i}`,
        key: i.toString(),
        text: `Link ${i}`,
      });
    }
  }

  // Adding random additional links to ensure network connectivity
  if (randomLinks) {
    for (let i = 0; i < numNodes; i++) {
      const from = Math.floor(Math.random() * numNodes);
      const to = Math.floor(Math.random() * numNodes);
      if (from !== to) {
        links.push({
          key: `${from}-${to}-${i}`,
          from: `nodeKey-${from}`,
          to: `nodeKey-${to}`,
          text: `Random Link ${i}`,
        });
      }
    }
  }

  return { nodes, links };
};
