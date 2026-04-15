import React, {
  ReactElement,
  FC,
  useEffect,
  useState
} from "react";

import {
  Node
} from '@xyflow/react';

import { saveNodeData } from '../FetchData';

interface Props {
    nodes : Node[];
    setNodes : React.Dispatch<React.SetStateAction<Node[]>>;
    selectedNodeID : string;
    setSelectedNodeID : React.Dispatch<React.SetStateAction<string>>;
  }



export const RoomDetailDiv : FC<Props> = ({nodes, setNodes, selectedNodeID, setSelectedNodeID}) : ReactElement => {
  const [roomName, setRoomName] = useState<string>("");
  const [roomDescription, setRoomDescription] = useState<string>("");
  const [exitN, setExitN] = useState<string>("");
  const [exitS, setExitS] = useState<string>("");
  const [exitW, setExitW] = useState<string>("");
  const [exitE, setExitE] = useState<string>("");
  const [exitU, setExitU] = useState<string>("");
  const [exitD, setExitD] = useState<string>("");

  function handleRoomNameChange(evt : React.ChangeEvent<HTMLInputElement>) {
    setRoomName(evt.target.value)
  }

  function handleSave() {
    const exitJSON = JSON.stringify({ N: exitN, S: exitS, E: exitE, W: exitW, U: exitU, D: exitD });
    saveNodeData(selectedNodeID, roomName, roomDescription, exitJSON);
  }

  function handleLinkClick(roomid : string) {
    setSelectedNodeID(roomid);
  }

  function handleRoomDescriptionChange(evt : React.ChangeEvent<HTMLTextAreaElement>) {
    setRoomDescription(evt.target.value)
  }

  function handleExitChange(evt : React.ChangeEvent<HTMLInputElement>, direction : string) {
    switch (direction) {
      case "N":
        setExitN(evt.target.value);
        break;
      case "S":
        setExitS(evt.target.value);
        break;
      case "E":
        setExitE(evt.target.value);
        break;
      case "W":
        setExitW(evt.target.value);
        break;
      case "U":
        setExitU(evt.target.value);
        break;
      case "D":
        setExitD(evt.target.value);
        break;          
      default:
        break;
    }
  }
  
  // Saves updated Room Name to Node
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNodeID) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: roomName,
            roomname: roomName
          };
        }

        return node;
      })
    );
  }, [setNodes, selectedNodeID, roomName]);

  // Save updated RoomDescription to Node
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNodeID) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            description: roomDescription
          };
        }

        return node;
      })
    );
  }, [setNodes, selectedNodeID, roomDescription]);

  // Save updated Exit[] to Node
  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === selectedNodeID) {
          // it's important that you create a new object here
          // in order to notify react flow about the change

          let nodeexit = {
              "N": "",
              "S": "",
              "W": "",
              "E": "",
              "U": "",
              "D": ""
            };

          if (exitN !== "undefined") {
            nodeexit["N"] = exitN;
          }
          if (exitS !== "undefined") {
            nodeexit["S"] = exitS;
          }
          if (exitW !== "undefined") {
            nodeexit["W"] = exitW;
          }
          if (exitE !== "undefined") {
            nodeexit["E"] = exitE;
          }
          if (exitU !== "undefined") {
            nodeexit["U"] = exitU;
          }
          if (exitD !== "undefined") {
            nodeexit["D"] = exitD;
          }

          node.data = {
            ...node.data,
            exit: nodeexit
          };
        }

        return node;
      })
    );
  }, [setNodes, selectedNodeID, exitN, exitS, exitW, exitE, exitU, exitD]);

  // Update Room Detail Pane when selected node changes
  useEffect(() => {
    nodes.map((node) => {
      if (node.id === selectedNodeID) {
        setRoomName(String(node.data["roomname"]));
        setRoomDescription(String(node.data["description"]));
        setExitN(String(Object(node.data.exit)["N"]))
        setExitS(String(Object(node.data.exit)["S"]))
        setExitW(String(Object(node.data.exit)["W"]))
        setExitE(String(Object(node.data.exit)["E"]))
        setExitU(String(Object(node.data.exit)["U"]))
        setExitD(String(Object(node.data.exit)["D"]))
      }

    })
  }, [selectedNodeID]
  )

  return <div id='roomdetaildiv'>
    <div className='update_controls'>
      <label>ID:</label>
      {selectedNodeID}
      <br/>
      <button onClick={handleSave}>Save Room</button>
      <br/>
      <label>Room Name:</label>
      <input
        value={roomName}
        onChange={(evt) => handleRoomNameChange(evt) }
      />
      <br/>
      <label>Description:</label>
      <textarea
        value={roomDescription}
        onChange={(evt) => handleRoomDescriptionChange(evt) }
        id="roomdescription"
      />
      <br/>
      <br/>
      <label><b>Exits</b></label>
      <br/>
      <label>N:  </label>
      <input
        className='directioninput'
        value={exitN}
        onChange={(evt) => handleExitChange(evt, "N") }
      />
      <button className='directionbutton' onClick={(evt) => {if (exitN !== "" && exitN !== "undefined") {handleLinkClick(exitN)}}}>Go to room</button>
      <br/>
      <label>S:  </label>
      <input
        className='directioninput'
        value={exitS}
        onChange={(evt) => handleExitChange(evt, "S") }
      />
      <button className='directionbutton' onClick={(evt) => {if (exitS !== "" && exitS !== "undefined") {handleLinkClick(exitS)}}}>Go to room</button>
      <br/>
      <label>E:  </label>
      <input
        className='directioninput'
        value={exitE}
        onChange={(evt) => handleExitChange(evt, "E") }
      />
      <button className='directionbutton' onClick={(evt) => {if (exitE !== "" && exitE !== "undefined") {handleLinkClick(exitE)}}}>Go to room</button>
      <br/>
      <label>W:  </label>
      <input
        className='directioninput'
        value={exitW}
        onChange={(evt) => handleExitChange(evt, "W") }
      />
      <button className='directionbutton' onClick={(evt) => {if (exitW !== "" && exitW !== "undefined") {handleLinkClick(exitW)}}}>Go to room</button>
      <br/>
      <label>U:  </label>
      <input
        className='directioninput'
        value={exitU}
        onChange={(evt) => handleExitChange(evt, "U") }
      />
      <button className='directionbutton' onClick={(evt) => {if (exitU !== "" && exitU !== "undefined") {handleLinkClick(exitU)}}}>Go to room</button>
      <br/>
      <label>D:  </label>
      <input
        className='directioninput'
        value={exitD}
        onChange={(evt) => handleExitChange(evt, "D") }
      />
      <button className='directionbutton' onClick={(evt) => {if (exitD !== "" && exitD !== "undefined") {handleLinkClick(exitD)}}}>Go to room</button>
      <br/>

    </div>
  </div>
}
