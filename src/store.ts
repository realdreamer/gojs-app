import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { RefObject } from 'react';
import { create } from 'zustand';

interface ModelPayload {
  nodes: go.ObjectData[];
  links: go.ObjectData[];
}

interface DiagramState {
  nodes: go.ObjectData[];
  links: go.ObjectData[];
  model: go.GraphLinksModel;
  diagramRef: null | RefObject<ReactDiagram | null>;
  initModel: (payload: ModelPayload) => void;
  setNodes: (nodes: go.ObjectData[]) => void;
  setLinks: (links: go.ObjectData[]) => void;
  setDiagramRef: (diagramRef: RefObject<ReactDiagram | null>) => void;
}

export const useDiagramStore = create<DiagramState>((set) => ({
  nodes: [],
  links: [],
  model: new go.GraphLinksModel(),
  diagramRef: null,
  initModel: (payload: ModelPayload) => {
    const model = new go.GraphLinksModel();
    model.nodeDataArray = payload.nodes;
    model.linkDataArray = payload.links;
    model.linkKeyProperty = 'key';
    set({ model });
  },
  setNodes: (nodes) => set((_) => ({ nodes })),
  setLinks: (links) => set((_) => ({ links })),
  setDiagramRef: (diagramRef: RefObject<ReactDiagram | null>) => set((_) => ({ diagramRef })),
}));
