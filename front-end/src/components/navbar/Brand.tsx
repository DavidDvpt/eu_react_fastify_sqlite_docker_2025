import { useNavigate } from "react-router-dom";

function Brand() {
  const navigate = useNavigate();

  return (
    <div
      className="w-[200px] flex items-center p-2 cursor-pointer"
      onClick={() => navigate("/home")}
    >
      Entropia Manager
    </div>
  );
}

export default Brand;
