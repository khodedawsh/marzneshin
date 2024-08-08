import { type FC, type PropsWithChildren, useEffect } from "react";
import {
  ScrollArea,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@marzneshin/components";
import { useTranslation } from "react-i18next";

export interface SettingsDialogProps {
  onOpenChange: (state: boolean) => void;
  open: boolean;
  onClose?: () => void;
}

export const SettingsDialog: FC<SettingsDialogProps & PropsWithChildren> = ({
  open,
  onOpenChange,
  children,
  onClose = () => null,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) onClose();
  }, [open, onClose]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:min-w-full md:min-w-[700px] space-y-5">
        <SheetHeader>
          <SheetTitle>{t("settings")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col gap-4 h-full max-h-[40rem]">
          {children}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
