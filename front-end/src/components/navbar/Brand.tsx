import NavButton from "./NavButton";

function Brand() {
  return (
    <NavButton
      label="Entropia Manager"
      route="/home"
      isBrand
      selected={false}
      adminOnly={false}
      className="h-full"
    ></NavButton>
  );
}

export default Brand;
