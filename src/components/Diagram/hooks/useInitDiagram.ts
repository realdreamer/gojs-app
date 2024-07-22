import * as go from 'gojs';
import { LinkShiftingTool } from '../../../helpers/LinkShiftingTool';
import { useDiagramStore } from '../../../store';
import useContextMenu from './useContextMenu';

const useInitDiagram = () => {
  const { nodeContextMenu, linkContextMenu } = useContextMenu();
  const $ = go.GraphObject.make;
  const { model: myWholeModel } = useDiagramStore();

  const computeDocumentBounds = () => {
    const b = new go.Rect();
    const ndata = myWholeModel.nodeDataArray;
    for (let i = 0; i < ndata.length; i++) {
      const d = ndata[i];
      if (!d.bounds) continue;
      if (b.isEmpty()) b.set(d.bounds);
      else b.unionRect(d.bounds);
    }
    return b;
  };


  const virtualUniqueKey = (_model: go.Model, data: go.ObjectData) => {
    myWholeModel.makeNodeDataKeyUnique(data);
    return myWholeModel.getKeyForNodeData(data);
  };

  const initDiagram = () => {
    const myDiagram = new go.Diagram({
      initialDocumentSpot: go.Spot.Center,
      initialViewportSpot: go.Spot.Center,
      'undoManager.isEnabled': true,
      'animationManager.isEnabled': false,
      layout: $(go.Layout, { isInitial: false, isOngoing: false }),
    });

    myDiagram.model = new go.GraphLinksModel();
    (myDiagram.model as go.GraphLinksModel).linkKeyProperty = 'key';
    myDiagram.model.makeUniqueKeyFunction = virtualUniqueKey;
    myDiagram.toolManager.mouseDownTools.add($(LinkShiftingTool));

    myDiagram.isVirtualized = true;

    myDiagram.nodeTemplate = $(
      go.Node,
      'Auto',
      {
        isLayoutPositioned: false,
        resizable: true,
        contextMenu: nodeContextMenu,
      },
      new go.Binding('position', 'bounds', (b) => b.position).makeTwoWay(
        (p, d) => new go.Rect(p.x, p.y, d.bounds.width, d.bounds.height)
      ),
      { width: 70, height: 70 },
      $(
        go.Shape,
        'Rectangle',
        {
          portId: '',
          cursor: 'pointer',
          fromSpot: go.Spot.AllSides,
          toSpot: go.Spot.AllSides,
          fromLinkable: true,
          toLinkable: true,
        },
        new go.Binding('fill', 'color'),
        new go.Binding('stroke', 'isHighlighted', (h) => (h ? 'red' : 'black')),
        new go.Binding('strokeWidth', 'isHighlighted', (h) => (h ? '3px' : '1px'))
      ),
      $(go.TextBlock, { margin: 2, name: 'TEXT' }, new go.Binding('text', 'text'))
    );

    myDiagram.linkTemplate = $(
      go.Link,
      {
        relinkableFrom: true,
        relinkableTo: true,
        contextMenu: linkContextMenu,
        isLayoutPositioned: false,
      }
    )
      .bindTwoWay('points')
      .bindTwoWay('fromSpot', 'fromSpot', go.Spot.parse, go.Spot.stringify)
      .bindTwoWay('toSpot', 'toSpot', go.Spot.parse, go.Spot.stringify)
      .add(
        new go.Shape({ name: 'LINK', strokeWidth: 1 }),
        new go.Shape({ toArrow: 'Standard' }),
        new go.TextBlock({ name: 'TEXT' }).bind('text', 'text')
      );

    myDiagram.animationManager.isEnabled = true;
    myDiagram.fixedBounds = computeDocumentBounds();
    return myDiagram;
  };

  return initDiagram;
};

export default useInitDiagram;
