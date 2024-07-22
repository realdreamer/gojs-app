// src/hooks/useContextMenu.ts
import * as go from 'gojs';
import { useCallback } from 'react';

const useContextMenu = () => {
  const $ = go.GraphObject.make;

  const changeFontSize = useCallback((_e: go.InputEvent, obj: go.GraphObject) => {
    const adornment = obj.part;
    if (adornment instanceof go.Adornment) {
      const node = adornment.adornedPart;
      if (node instanceof go.Node) {
        const diagram = node.diagram;
        if (diagram) {
          diagram.startTransaction('change font size');
          const textBlock = node.findObject('TEXT') as go.TextBlock;
          if (textBlock) {
            const fontSizeMatch = textBlock.font.match(/\d+/);
            if (fontSizeMatch) {
              const fontSize = parseInt(fontSizeMatch[0], 10);
              // TODO: change only font size
              textBlock.font = `${fontSize * 2}px sans-serif`;
            }
          }
          diagram.commitTransaction('change font size');
        }
      } else if (node instanceof go.Link) {
          const diagram = node.diagram;
          if (diagram) {
            diagram.startTransaction('change font size of link');
            const textBlock = node.findObject('TEXT') as go.TextBlock;
            if (textBlock) {
              const fontSizeMatch = textBlock.font.match(/\d+/);
              if (fontSizeMatch) {
                const fontSize = parseInt(fontSizeMatch[0], 10);
                // TODO: change only font size
                textBlock.font = `${fontSize / 2}px sans-serif`;
              }
            }
            diagram.commitTransaction('change font size of link');
          }
        }
    }
  }, []);

  const nodeContextMenu = $(
    go.Adornment,
    'Vertical',
    $('ContextMenuButton', $(go.TextBlock, 'Change Font Size'), { click: changeFontSize })
  );

  const linkContextMenu = $(
    go.Adornment,
    'Vertical',
    $('ContextMenuButton', $(go.TextBlock, 'Change Font Size'), { click: changeFontSize })
  );

  return { nodeContextMenu, linkContextMenu };
};

export default useContextMenu;
