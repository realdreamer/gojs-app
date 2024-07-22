import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import { memo, useEffect, useRef } from 'react';
import { useDiagramStore } from '../../store';

import './Diagram.css';
import useQuadtree from './hooks/useQuadTree';
import useInitDiagram from './hooks/useInitDiagram';

type Props = {
  saveData: () => void;
};

function Diagram({ saveData }: Props) {
  const diagramRef = useRef<ReactDiagram>(null);
  const {
    nodes: nodeDataArray,
    model: myWholeModel,
    setDiagramRef,
  } = useDiagramStore();

  const myWholeQuadTree = useQuadtree(nodeDataArray);
  const initDiagram = useInitDiagram();

  function addNode(diagram: go.Diagram, data: go.ObjectData) {
    const model = diagram.model;
    if (model.containsNodeData(data)) return;
    model.addNodeData(data);
    const n = diagram.findNodeForData(data);
    if (n !== null) n.ensureBounds();
  }

  function onViewportChanged(e: go.DiagramEvent) {
    const diagram = e.diagram;
    const viewb = diagram.viewportBounds;
    const model = diagram.model;

    const oldskips = diagram.skipsUndoManager;
    diagram.skipsUndoManager = true;

    const b = new go.Rect();
    const ndata = myWholeQuadTree.intersecting(viewb);
    for (let i = 0; i < ndata.length; i++) {
      const n = ndata[i] as go.ObjectData;
      if (model.containsNodeData(n)) continue;
      if (!n.bounds) continue;
      if (n.bounds.intersectsRect(viewb)) {
        addNode(diagram, n);
      }
    }

    if (model instanceof go.GraphLinksModel) {
      const ldata = myWholeModel.linkDataArray;
      for (let i = 0; i < ldata.length; i++) {
        const l = ldata[i];
        if (model.containsLinkData(l)) continue;

        const fromKey = myWholeModel.getFromKeyForLinkData(l);
        if (fromKey === undefined) continue;
        const from = myWholeModel.findNodeDataForKey(fromKey);
        if (from === null || !from.bounds) continue;

        const toKey = myWholeModel.getToKeyForLinkData(l);
        if (toKey === undefined) continue;
        const to = myWholeModel.findNodeDataForKey(toKey);
        if (to === null || !to.bounds) continue;

        b.set(from.bounds);
        b.unionRect(to.bounds);
        if (b.intersectsRect(viewb)) {
          addNode(diagram, from);
          addNode(diagram, to);
          model.addLinkData(l);
          const link = diagram.findLinkForData(l);
          if (link !== null) {
            link.updateRoute();
          }
        }
      }
    }

    diagram.skipsUndoManager = oldskips;
  }

  function onModelChanged(e: go.ChangedEvent) {
    if (!e.model || e.model.skipsUndoManager || !e.object) return;

    if (e.change === go.ChangeType.Property && e.propertyName === 'bounds') {
      myWholeQuadTree.move(e.object, e.newValue.bounds.x, e.newValue.bounds.y);
    } else if (e.change === go.ChangeType.Insert) {
      if (e.propertyName === 'nodeDataArray') {
        myWholeModel.addNodeData(e.newValue);
        myWholeQuadTree.add(e.newValue, e.newValue.bounds);
      } else if (e.propertyName === 'linkDataArray') {
        myWholeModel.addLinkData(e.newValue);
      }
    } else if (e.change === go.ChangeType.Remove) {
      if (e.propertyName === 'nodeDataArray') {
        myWholeModel.removeNodeData(e.oldValue);
        myWholeQuadTree.remove(e.oldValue);
      } else if (e.propertyName === 'linkDataArray') {
        myWholeModel.removeLinkData(e.oldValue);
      }
    }
    if (!e.isTransactionFinished) return;
    saveData();
  }

  useEffect(() => {
    if (!diagramRef.current) return;

    setDiagramRef(diagramRef);

    const diagram = diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ViewportBoundsChanged', onViewportChanged);
      diagram.addModelChangedListener(onModelChanged);
    }

    return () => {
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener('ViewportBoundsChanged', onViewportChanged);
        diagram.removeModelChangedListener(onModelChanged);
      }
    };
  }, []);

  return (
    <div>
      <ReactDiagram
        ref={diagramRef}
        initDiagram={initDiagram}
        divClassName='diagram-component'
        nodeDataArray={[]}
        linkDataArray={[]}
      />
    </div>
  );
}

export default memo(Diagram)
