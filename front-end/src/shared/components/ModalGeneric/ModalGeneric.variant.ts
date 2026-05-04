const MODAL_GENERIC_VARIANTS = {
  default:
    "w-full min-w-[400px] max-w-[500px] min-h-[320px] max-h-[360px] overflow-y-auto bg-[var(--color-modal-bg)] border-[var(--color-modal-border)] text-[var(--color-modal-text)] rounded-[var(--radius-md)]",
  confirmation:
    "w-full min-w-[400px] max-w-[500px] min-h-[320px] max-h-[360px] overflow-y-auto bg-[var(--color-modal-bg)] border-[var(--color-modal-border)] text-[var(--color-modal-text)] rounded-[var(--radius-md)]",
  error:
    "w-full min-w-[400px] max-w-[500px] min-h-[320px] max-h-[360px] overflow-y-auto bg-[var(--color-modal-bg)] border-[var(--color-modal-border)] text-[var(--color-modal-text)] rounded-[var(--radius-md)]",
} as const;

type ModalGenericVariant = keyof typeof MODAL_GENERIC_VARIANTS;

export { MODAL_GENERIC_VARIANTS };
export type { ModalGenericVariant };
