import { useCallback, FC } from "react";
import {
  ReactFlow,
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  OnSelectionChangeParams,
  OnNodesChange,
  OnEdgesChange
} from '@xyflow/react';

import RoomNode from "./RoomNode";

import '@xyflow/react/dist/style.css';

const nodeTypes = {
  custom: RoomNode
};

interface Props {
  nodes : Node[];
  edges : Edge[];
  setNodes : React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges : React.Dispatch<React.SetStateAction<Edge[]>>;
  onNodesChange : OnNodesChange<Node>;
  onEdgesChange : OnEdgesChange<Edge>;
  setSelectedNodeID : React.Dispatch<React.SetStateAction<string>>;
  selectedNodeID : string;
}

const BasicFlow : FC<Props> = ({nodes, edges, setNodes, setEdges, onNodesChange, onEdgesChange, setSelectedNodeID, selectedNodeID}) => {



  const onNodeSelectChange = useCallback(({ nodes, edges }: OnSelectionChangeParams)  => {   

    if (nodes[0] != null && selectedNodeID !== nodes[0].id) {
      setSelectedNodeID(nodes[0].id);
    }
  }, [setSelectedNodeID]
  );

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  return (
    <div id='roommap'>
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onSelectionChange={onNodeSelectChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      fitView
    >
    <Background />
    </ReactFlow>
    </div>
  );
};

export default BasicFlow;
