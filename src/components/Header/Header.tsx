import * as go from 'gojs';
import { useCallback } from "react";
import { useDiagramStore } from "../../store";
import VirtualizedSelect from "../Select/Select";
import LoadingIcon from '../../assets/loading.svg?react';
import SavedIcon from '../../assets/saved.svg?react';

import './Header.css';

export default function Header({
  saveInProgress
}: { saveInProgress: boolean }) {
  const {
    model,
    diagramRef,
  } = useDiagramStore();

  const focusOnNode = useCallback((value?: string) => {
    if (!diagramRef?.current || !value) return;

    const diagram = diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      const node = model.findNodeDataForKey(value);
      if (!node) return;

      diagram.scrollToRect(node.bounds);
      const diagramNode = diagram.findNodeForData(node);

      if (!diagramNode) return;

      diagram.select(diagramNode);

      const focus1 = diagramNode.copy();
      focus1.layerName = 'Tool';
      focus1.isInDocumentBounds = false;
      focus1.locationSpot = go.Spot.Center;
      focus1.location = diagramNode.actualBounds.center;
      const anim = new go.Animation();
      anim.addTemporaryPart(focus1, diagram);
      anim.add(focus1, 'scale', 2, 1.0);
      anim.duration = diagram.animationManager.duration + 500;
      anim.start();
    }
  }, [diagramRef, model]);

  return (
    <div className="header">
      <VirtualizedSelect onChange={focusOnNode} />
      {saveInProgress ?
        <LoadingIcon width="32" height="32" className="loading-icon" />
        : <SavedIcon width="32" height="32" />
      }
    </div>
  );
}
