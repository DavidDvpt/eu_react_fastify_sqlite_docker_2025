import ChatLogSetupModal from './ChatLogSetupModal';
import InGameUsernameSetupModal from './InGameUsernameSetupModal';
import useChatLogSetup from '../hooks/useChatLogSetup';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authActions, getauthState } from '@/store';
import { ApiStatus } from '@/lib/axios/ApiStatus';
import { useState } from 'react';
import { useUpdateInGameUsernameApiV2AuthInGameUsernamePut } from '@/api/generated/react-query/entropiaManagerAPI';

function ChatLogSetupGate() {
  const setup = useChatLogSetup();
  const dispatch = useAppDispatch();
  const { isLoggued, user } = useAppSelector(getauthState);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const updateUsername = useUpdateInGameUsernameApiV2AuthInGameUsernamePut();
  const needsUsername =
    isLoggued &&
    user.status === ApiStatus.FULFILLED &&
    !user.result?.inGameUsername?.trim();

  const saveUsername = async ({
    inGameUsername,
  }: {
    inGameUsername: string;
  }) => {
    try {
      setUsernameError(null);
      const response = await updateUsername.mutateAsync({
        data: { inGameUsername: inGameUsername.trim() },
      });
      dispatch(authActions.setInGameUsername(response.inGameUsername));
    } catch (error) {
      console.error("Impossible d'enregistrer le pseudo en jeu", error);
      setUsernameError("Impossible d'enregistrer le pseudo en jeu.");
    }
  };

  return (
    <>
      <InGameUsernameSetupModal
        isOpen={needsUsername}
        error={usernameError}
        onSubmit={saveUsername}
      />
      <ChatLogSetupModal {...setup} isBlocked={needsUsername} />
    </>
  );
}

export default ChatLogSetupGate;
