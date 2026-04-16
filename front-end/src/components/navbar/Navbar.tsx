import Brand from "@/components/Navbar/Brand";
import Nav from "@/components/Navbar/Nav";
import Profile from "@/components/Navbar/Profile";

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
