import { useState } from 'react';
import { useNodesState,useEdgesState, Node, Edge  } from '@xyflow/react';

import { RoomDetailDiv } from './components/RoomDetailDiv'
import Header from './components/Header'
import BasicFlow from './components/BasicFlow'
import { fetchEdgeData, fetchNodeData, createNodeData } from './FetchData';
import { RoomFormData } from './components/CreateRoomModal';
 
import '@xyflow/react/dist/style.css';



const initialNodes : Node[] = []
const initialEdges: Edge[] = [];

function App() {
  // State function to select Node
  const [initialNodeLoad, setInitialNodeLoad] = useState(true);
  const [initialEdgeLoad, setInitialEdgeLoad] = useState(true);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeID, setSelectedNodeID] = useState<string>("0");

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
      const newNode: Node = {
        id: String(result.id),
        position: { x: 0, y: 0 },
        data: {
          label: data.roomName,
          roomname: data.roomName,
          description: data.roomDescription,
          exit: exits,
        },
      };
      setNodes((prev) => [...prev, newNode]);
    }
  }

  // Attempt to load Nodes from URL
  if (initialNodeLoad) {
    setInitialNodeLoad(false);
    fetchNodeData().then(data => {
      if (!data) return;

      // Build raw node list first (all at 0,0)
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

      // BFS directional layout: position each room based on its exit direction
      // from its parent, so the map reflects real topology.
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

      const positioned: Set<string> = new Set();
      const queue: string[] = [];

      // Start from the first room (smallest numeric ID)
      const startID = Object.keys(rawNodes).sort((a, b) => parseInt(a) - parseInt(b))[0];
      if (startID) {
        rawNodes[startID].position = { x: 0, y: 0 };
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

          rawNodes[targetID].position = {
            x: current.position.x + offset.x,
            y: current.position.y + offset.y,
          };
          positioned.add(targetID);
          queue.push(targetID);
        }
      }

      setNodes(Object.values(rawNodes));
    });
  }
  
  if (initialEdgeLoad) {
    setInitialEdgeLoad(false);
    // Attempt to load Edges from URL
    fetchEdgeData().then(data => {
      let jsonarray = []
      for (const key in data) {
        let jsonitem = {
            id: data[key]["ID"],
            source: data[key]["Source"],
            target: data[key]["Target"],
            }

        jsonarray.push(jsonitem);
      }
      const newedgearray : Edge[] = jsonarray;
      setEdges(newedgearray);
    });
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
        />
      </div>
    </div>
  );
}

export default App;