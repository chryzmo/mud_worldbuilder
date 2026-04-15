import { FC, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface RoomFormData {
    roomName: string;
    roomDescription: string;
    exitN: string;
    exitS: string;
    exitE: string;
    exitW: string;
    exitU: string;
    exitD: string;
}

interface Props {
    isShown: boolean;
    hide: () => void;
    onCreate?: (data: RoomFormData) => void;
}

export const CreateRoomModal: FC<Props> = ({ isShown, hide, onCreate }) => {
    const [roomName, setRoomName] = useState("");
    const [roomDescription, setRoomDescription] = useState("");
    const [exitN, setExitN] = useState("");
    const [exitS, setExitS] = useState("");
    const [exitE, setExitE] = useState("");
    const [exitW, setExitW] = useState("");
    const [exitU, setExitU] = useState("");
    const [exitD, setExitD] = useState("");

    const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isShown) {
            hide();
        }
    };

    useEffect(() => {
        isShown
            ? (document.body.style.overflow = "hidden")
            : (document.body.style.overflow = "unset");
        document.addEventListener("keydown", onKeyDown, false);
        return () => {
            document.removeEventListener("keydown", onKeyDown, false);
        };
    }, [isShown]);

    function handleExitChange(evt: React.ChangeEvent<HTMLInputElement>, direction: string) {
        switch (direction) {
            case "N": setExitN(evt.target.value); break;
            case "S": setExitS(evt.target.value); break;
            case "E": setExitE(evt.target.value); break;
            case "W": setExitW(evt.target.value); break;
            case "U": setExitU(evt.target.value); break;
            case "D": setExitD(evt.target.value); break;
        }
    }

    function handleCreate() {
        if (!roomName.trim()) return;
        if (onCreate) {
            onCreate({ roomName, roomDescription, exitN, exitS, exitE, exitW, exitU, exitD });
        }
        // Reset form fields after creation
        setRoomName("");
        setRoomDescription("");
        setExitN(""); setExitS(""); setExitE("");
        setExitW(""); setExitU(""); setExitD("");
        hide();
    }

    const modal = (
        <div className="createroommodal">
            <div className="createroommodalheader">Create a Room</div>
            <br />
            <div className="update_controls">
                <label>Room Name:</label>
                <input
                    value={roomName}
                    onChange={(evt) => setRoomName(evt.target.value)}
                />
                <br />
                <label>Description:</label>
                <textarea
                    value={roomDescription}
                    onChange={(evt) => setRoomDescription(evt.target.value)}
                    id="roomdescription"
                />
                <br /><br />
                <label><b>Exits</b></label>
                <br />
                <label>N: </label>
                <input className="directioninput" value={exitN} onChange={(evt) => handleExitChange(evt, "N")} />
                <br />
                <label>S: </label>
                <input className="directioninput" value={exitS} onChange={(evt) => handleExitChange(evt, "S")} />
                <br />
                <label>E: </label>
                <input className="directioninput" value={exitE} onChange={(evt) => handleExitChange(evt, "E")} />
                <br />
                <label>W: </label>
                <input className="directioninput" value={exitW} onChange={(evt) => handleExitChange(evt, "W")} />
                <br />
                <label>U: </label>
                <input className="directioninput" value={exitU} onChange={(evt) => handleExitChange(evt, "U")} />
                <br />
                <label>D: </label>
                <input className="directioninput" value={exitD} onChange={(evt) => handleExitChange(evt, "D")} />
                <br /><br />
                <button onClick={handleCreate}>Create Room</button>
                <button onClick={hide}>Close</button>
            </div>
        </div>
    );

    return isShown ? createPortal(modal, document.body) : null;
};
