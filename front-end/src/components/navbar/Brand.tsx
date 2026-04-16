import NavButton from "./NavButton";

function Brand() {
  return (
    <NavButton
      content="Entropia Manager"
      route="/home"
      isBrand
      selected={false}
      adminOnly={false}
      className="h-full"
      variant="navHorizontal"
    ></NavButton>
  );
}

export default Brand;
