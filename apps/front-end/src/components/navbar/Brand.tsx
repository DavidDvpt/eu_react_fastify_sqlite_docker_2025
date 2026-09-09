import { Link } from "react-router-dom";

import brand from "@/assets/brand.png";

function Brand() {
  return (
    <div className="flex items-center gap-2">
      <Link to="/" aria-label="Accueil">
        <img
          src={brand}
          alt="Entropia Manager"
          className="h-[80px] w-auto object-contain "
        />
      </Link>
    </div>
  );
}

export default Brand;
