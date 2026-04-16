import { useState, useEffect, useCallback } from 'react';
import { useNodesState,useEdgesState, Node, Edge  } from '@xyflow/react';

import { RoomDetailDiv } from './components/RoomDetailDiv'
import Header from './components/Header'
import BasicFlow from './components/BasicFlow'
import { fetchEdgeData, fetchNodeData, createNodeData } from './FetchData';
import { RoomFormData } from './components/CreateRoomModal';
 
import '@xyflow/react/dist/style.css';



const initialNodes : Node[] = []
const initialEdges: Edge[] = [];

const STEP_X = 220;
const STEP_Y = 180;
const dirOffset: Record<string, { x: number; y: number }> = {
  N: { x: 0,       y: -STEP_Y },
  S: { x: 0,       y:  STEP_Y },
  E: { x:  STEP_X, y: 0       },
  W: { x: -STEP_X, y: 0       },
  U: { x:  STEP_X, y: -STEP_Y },
  D: { x: -STEP_X, y:  STEP_Y },
};

function buildLayout(data: Record<string, any>): Node[] {
  const rawNodes: Record<string, Node> = {};
  for (const key in data) {
    rawNodes[key] = {
      id: key,
      position: { x: 0, y: 0 },
      data: {
        label: data[key]["Name"],
        roomname: data[key]["Name"],
        description: data[key]["Description"],
        exit: JSON.parse(data[key]["ExitJSON"] || "{}"),
      },
    };
  }

  const positioned: Set<string> = new Set();
  const occupiedPos = new Map<string, boolean>();
  const posKey = (x: number, y: number) => `${x},${y}`;

  function findFreePos(idealX: number, idealY: number): { x: number; y: number } {
    if (!occupiedPos.has(posKey(idealX, idealY))) return { x: idealX, y: idealY };
    for (let i = 1; i < 1000; i++) {
      const candidates = [
        { x: idealX + i * STEP_X, y: idealY },
        { x: idealX - i * STEP_X, y: idealY },
        { x: idealX, y: idealY + i * STEP_Y },
      ];
      for (const c of candidates) {
        if (!occupiedPos.has(posKey(c.x, c.y))) return c;
      }
    }
    return { x: idealX, y: idealY };
  }

  const queue: string[] = [];
  const startID = Object.keys(rawNodes).sort((a, b) => parseInt(a) - parseInt(b))[0];
  if (startID) {
    rawNodes[startID].position = { x: 0, y: 0 };
    occupiedPos.set(posKey(0, 0), true);
    positioned.add(startID);
    queue.push(startID);
  }

  while (queue.length > 0) {
    const currentID = queue.shift()!;
    const current = rawNodes[currentID];
    const exits = current.data.exit as Record<string, string | number>;

    for (const [dir, targetVal] of Object.entries(exits)) {
      const targetID = String(targetVal);
      if (!targetID || targetID === "0" || positioned.has(targetID) || !rawNodes[targetID]) continue;

      const offset = dirOffset[dir];
      if (!offset) continue;

      const pos = findFreePos(current.position.x + offset.x, current.position.y + offset.y);
      rawNodes[targetID].position = pos;
      occupiedPos.set(posKey(pos.x, pos.y), true);
      positioned.add(targetID);
      queue.push(targetID);
    }
  }

  const unpositioned = Object.keys(rawNodes)
    .filter((id) => !positioned.has(id))
    .sort((a, b) => parseInt(a) - parseInt(b));
  unpositioned.forEach((id, i) => {
    const pos = findFreePos(i * STEP_X, 600);
    rawNodes[id].position = pos;
    occupiedPos.set(posKey(pos.x, pos.y), true);
  });

  return Object.values(rawNodes);
}

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeID, setSelectedNodeID] = useState<string>("0");

  const loadWorldData = useCallback(async () => {
    const [nodeData, edgeData] = await Promise.all([fetchNodeData(), fetchEdgeData()]);

    if (nodeData) {
      setNodes(buildLayout(nodeData));
    }

    if (edgeData) {
      const newEdges: Edge[] = Object.values(edgeData).map((e: any) => ({
        id: e["ID"],
        source: e["Source"],
        target: e["Target"],
      }));
      setEdges(newEdges);
    }
  }, [setNodes, setEdges]);

  useEffect(() => {
    loadWorldData();
  }, [loadWorldData]);

  async function handleCreateRoom(data: RoomFormData) {
    const exits: Record<string, number> = {};
    const dirMap: Record<string, string> = { N: data.exitN, S: data.exitS, E: data.exitE, W: data.exitW, U: data.exitU, D: data.exitD };
    for (const [dir, val] of Object.entries(dirMap)) {
      const id = parseInt(val);
      if (!isNaN(id) && id > 0) exits[dir] = id;
    }
    const exitJSON = JSON.stringify(exits);
    const result = await createNodeData(data.roomName, data.roomDescription, exitJSON);
    if (result && result.id) {
      await loadWorldData();
    }
  }

  return (
    <div id='fullpage'>
      <Header title='World Creator' onCreateRoom={handleCreateRoom} />
      <div id='container' style={{ width: '100vw', height: '100vh' }}>
        <BasicFlow
            setNodes={setNodes}
            nodes={nodes}
            edges={edges}
            setEdges={setEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            setSelectedNodeID={setSelectedNodeID}
            selectedNodeID={selectedNodeID}
        />
        <RoomDetailDiv
          nodes={nodes}
          setNodes={setNodes}
          setSelectedNodeID={setSelectedNodeID}
          selectedNodeID={selectedNodeID}
          onRefresh={loadWorldData}
        />
      </div>
    </div>
  );
}

export default App;