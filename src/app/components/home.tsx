import { useNavigate } from 'react-router-dom';
import { Path } from "../constants.ts";


export function Home() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(Path.About);
    };
    return (
        <div className="h-screen w-full flex flex-col justify-center items-center">
            <p>I am the Home page!!</p>
            <button className="rounded shadow-lg border-2 border-green-300 p-2" onClick={handleClick}>
                跳到About页面
            </button>

        </div>
    );
}
