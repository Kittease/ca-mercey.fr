"use client";

import {
  ComponentProps,
  createContext,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";

import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/app/_components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveDialogContextValue {
  isMobile: boolean;
  close: () => void;
}

const ResponsiveDialogContext =
  createContext<ResponsiveDialogContextValue | null>(null);

const useResponsiveDialog = () => {
  const context = useContext(ResponsiveDialogContext);

  if (!context) {
    throw new Error(
      "useResponsiveDialog must be used within a ResponsiveDialog.",
    );
  }

  return context;
};

interface ResponsiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResponsiveDialog = ({
  open,
  onOpenChange,
  children,
}: PropsWithChildren<ResponsiveDialogProps>) => {
  const isMobile = useIsMobile();

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const value = useMemo<ResponsiveDialogContextValue>(
    () => ({ isMobile, close }),
    [isMobile, close],
  );

  return (
    <ResponsiveDialogContext.Provider value={value}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      )}
    </ResponsiveDialogContext.Provider>
  );
};

interface PrimitiveProps {
  className?: string;
  children?: ReactNode;
}

const ResponsiveDialogContent = ({
  className,
  children,
  size = "default",
}: PrimitiveProps & { size?: "default" | "sm" }) => {
  const { isMobile } = useResponsiveDialog();

  if (isMobile) {
    return <DrawerContent className={className}>{children}</DrawerContent>;
  }

  return (
    <DialogContent size={size} className={className}>
      {children}
    </DialogContent>
  );
};

const ResponsiveDialogHeader = ({ className, children }: PrimitiveProps) => {
  const { isMobile } = useResponsiveDialog();

  return isMobile ? (
    <DrawerHeader className={className}>{children}</DrawerHeader>
  ) : (
    <DialogHeader className={className}>{children}</DialogHeader>
  );
};

const ResponsiveDialogFooter = ({ className, children }: PrimitiveProps) => {
  const { isMobile } = useResponsiveDialog();

  return isMobile ? (
    <DrawerFooter className={className}>{children}</DrawerFooter>
  ) : (
    <DialogFooter className={className}>{children}</DialogFooter>
  );
};

const ResponsiveDialogTitle = ({ className, children }: PrimitiveProps) => {
  const { isMobile } = useResponsiveDialog();

  return isMobile ? (
    <DrawerTitle className={className}>{children}</DrawerTitle>
  ) : (
    <DialogTitle className={className}>{children}</DialogTitle>
  );
};

const ResponsiveDialogDescription = ({
  className,
  children,
}: PrimitiveProps) => {
  const { isMobile } = useResponsiveDialog();

  return isMobile ? (
    <DrawerDescription className={className}>{children}</DrawerDescription>
  ) : (
    <DialogDescription className={className}>{children}</DialogDescription>
  );
};

const ResponsiveDialogAction = (props: ComponentProps<typeof Button>) => {
  return <Button data-slot="responsive-dialog-action" {...props} />;
};

const ResponsiveDialogCancel = ({
  variant = "outline",
  onClick,
  ...restProps
}: ComponentProps<typeof Button>) => {
  const { close } = useResponsiveDialog();

  return (
    <Button
      data-slot="responsive-dialog-cancel"
      variant={variant}
      onClick={(event) => {
        onClick?.(event);
        close();
      }}
      {...restProps}
    />
  );
};

export {
  ResponsiveDialog,
  ResponsiveDialogAction,
  ResponsiveDialogCancel,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
};
