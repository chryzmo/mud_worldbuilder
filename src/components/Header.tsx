import { ReactElement, FC, useState } from "react";
import { CreateRoomModal, RoomFormData } from "./CreateRoomModal";

interface Props {
    title: String;
    onCreateRoom?: (data: RoomFormData) => void;
}

const Header: FC<Props> = ({ title, onCreateRoom }): ReactElement => {
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);

    return (
        <div className='header'>
            <div id="headerbar">
                {title}
                <button onClick={() => setShowCreateRoomModal(true)}>Create Room</button>
            </div>
            <CreateRoomModal
                isShown={showCreateRoomModal}
                hide={() => setShowCreateRoomModal(false)}
                onCreate={onCreateRoom}
            />
        </div>
    )
};
 
export default Header;