import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { authMeThunk } from "@/modules/auth";
import logoutApi from "@/modules/auth/services/network/logoutApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pseudo = useAppSelector((state) => state.auth.user.result?.pseudo);

  const avatarLetter = (pseudo?.trim()?.[0] ?? "U").toUpperCase();

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleProfile = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logoutApi();
    void dispatch(authMeThunk());
  };

  return (
    <div
      ref={containerRef}
      className="w-[200px] flex items-center justify-end p-2 relative bg-layout-app-bg"
    >
      <Button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border-0 bg-bg hover:bg-bg px-2 py-1 transition-colors cursor-pointer "
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="w-8 h-8 rounded-full border border-button-primary-border bg-button-primary-bg text-button-primary-text inline-flex items-center justify-center text-sm font-bold">
          {avatarLetter}
        </span>
        <ChevronDown className="h-4 w-4 text-white" />
      </Button>

      {isOpen ? (
        <div className="absolute right-2 top-full mt-1 w-40 p-1 shadow-ambient-lg z-20 bg-layout-app-bg">
          <button
            type="button"
            className="w-full rounded-sm px-3 py-2 text-left text-sm border-0 hover:bg-accent hover:text-accent-foreground  bg-layout-app-bg"
            onClick={handleProfile}
          >
            Profile
          </button>
          <button
            type="button"
            className="w-full rounded-sm px-3 py-2 text-left text-sm text-destructive-500 hover:bg-danger/10 border-0  bg-layout-app-bg"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default Profile;
