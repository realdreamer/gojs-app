// src/hooks/useQuadtree.ts
import { useEffect, useRef } from 'react';
import { Quadtree } from '../../../helpers/QuadTree';

const useQuadtree = (nodeDataArray: go.ObjectData[]) => {
  const quadtree = useRef(new Quadtree()).current;

  useEffect(() => {
    quadtree.clear();
    nodeDataArray.forEach((n) => {
      quadtree.add(n, n.bounds);
    });
  }, [nodeDataArray, quadtree]);

  return quadtree;
};

export default useQuadtree;
