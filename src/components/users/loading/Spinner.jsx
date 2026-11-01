
import { BeatLoader, ClipLoader } from 'react-spinners';

const Spinner = ({ size = 60, color = "#1BC688" }) => {
    return (
        <div className="">
            {/* <BeatLoader size={size} color={color} /> */}
            <ClipLoader size={size} color={color} />
        </div>
    );
};

export default Spinner;
