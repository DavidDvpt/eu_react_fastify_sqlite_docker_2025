import { Brand, Nav } from "@/components/navbar";
import Profile from "./Profile";

function NavBar() {
  return (
    <header className="h-[80px] flex">
      <Brand />
      <Nav />
      <Profile />
    </header>
  );
}

export default NavBar;
