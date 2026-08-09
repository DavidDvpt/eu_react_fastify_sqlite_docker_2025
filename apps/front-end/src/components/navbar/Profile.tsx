import { ChevronDown } from "lucide-react";
import { useState } from "react";
import logoutApi from "@/modules/auth/services/network/logoutApi";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useNavigate } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import PedCardModal from "../../shared/components/pedCardModal/PedCardModal";
import usePedCard from "@/shared/hooks/usePedcardData";
import { authMeThunk } from "@/store";

function Profile() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPedCardModalOpen, setIsPedCardModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const pseudo = useAppSelector((state) => state.auth.user.result?.pseudo);
  const { pedCard } = usePedCard();

  const avatarLetter = (pseudo?.trim()?.[0] ?? "U").toUpperCase();

  const handleProfile = () => {
    setIsOpen(false);
    navigate("/profile");
  };

  const handlePedCardSettings = () => {
    setIsOpen(false);
    setIsPedCardModalOpen(true);
  };

  const handlePedCardModalOpenChange = (open: boolean) => {
    setIsPedCardModalOpen(open);
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logoutApi();
    void dispatch(authMeThunk());
  };

  return (
    <div className="w-[200px] flex items-center justify-end p-2 ">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border-0 bg-bg px-2 py-1 transition-colors"
            aria-label="Open profile menu"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-button-primary-border bg-button-primary-bg text-sm font-bold text-button-primary-text">
              {avatarLetter}
            </span>
            <ChevronDown className="h-4 w-4 text-white" />
          </button>
        </PopoverTrigger>

        <PopoverContent align="end" className="z-20 mt-1 w-40 p-1 ">
          <button
            type="button"
            className="w-full rounded-sm border-0 px-3 py-2 text-left text-sm "
            onClick={handleProfile}
          >
            Profile
          </button>
          <button
            type="button"
            className="w-full rounded-sm border-0 px-3 py-2 text-left text-sm "
            onClick={handlePedCardSettings}
          >
            PedCard
          </button>
          <button
            type="button"
            className="w-full rounded-sm border-0 px-3 py-2 text-left text-sm text-destructive-500"
            onClick={handleLogout}
          >
            Logout
          </button>
        </PopoverContent>
      </Popover>

      <PedCardModal
        open={isPedCardModalOpen}
        onOpenChange={handlePedCardModalOpenChange}
        balance={pedCard?.balance ?? null}
        hasInitialBalance={pedCard?.hasInitialBalance ?? null}
      />
    </div>
  );
}

export default Profile;
