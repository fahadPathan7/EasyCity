import { useNavigate } from "react-router-dom";
import { CaretLeftOutlined } from "@ant-design/icons";
import "./BackButton.css";

export default function BackButton() {

    const navigate = useNavigate();

    return <>
        <button className="bck-btn-comp" onClick={()=>{navigate(-1)}}>
            <CaretLeftOutlined /> &nbsp; পেছনে যান
        </button>
    </>;

}