import { useEffect, useMemo } from 'react';
import Diagram from '../Diagram/Diagram';
import { generateNodesAndLinks } from '../../helpers/generateNodesAndLinks';
import { useDiagramStore } from '../../store';
import useSaveData from '../../hooks/useSaveData';
import Header from '../Header/Header';

function App() {
  const { nodes: initialNodes, links: initialLinks } = useMemo(() => generateNodesAndLinks(10000), []);

  const {
    loading,
    saveData,
  } = useSaveData();

  const {
    setNodes,
    setLinks,
    initModel,
    model,
  } = useDiagramStore();


  useEffect(() => {
    setNodes(initialNodes);
    setLinks(initialLinks);
    initModel({
      nodes: initialNodes,
      links: initialLinks,
    });
  }, [initialNodes, initialLinks, setNodes, setLinks, initModel]);

  return (
    <div className="App">
      <Header saveInProgress={loading} />
      {model.nodeDataArray.length > 0 && <Diagram saveData={saveData} />}
    </div>
  );
}

export default App;
