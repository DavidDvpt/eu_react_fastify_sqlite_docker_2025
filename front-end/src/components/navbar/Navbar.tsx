import Brand from "./Brand";
import Nav from "./Nav";
import Profile from "./Profile";

function Navbar() {
  return (
    <div className="flex h-full">
      <Brand />
      <Nav />
      <Profile />
    </div>
  );
}

export default Navbar;
