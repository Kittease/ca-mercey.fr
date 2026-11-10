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

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/app/_components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResponsiveAlertDialogContextValue {
  isMobile: boolean;
  close: () => void;
}

const ResponsiveAlertDialogContext =
  createContext<ResponsiveAlertDialogContextValue | null>(null);

const useResponsiveAlertDialog = () => {
  const context = useContext(ResponsiveAlertDialogContext);

  if (!context) {
    throw new Error(
      "useResponsiveAlertDialog must be used within a ResponsiveAlertDialog.",
    );
  }

  return context;
};

// The underlying primitive must never close itself: on desktop this swallows
// the Escape key, and on mobile `dismissible={false}` already blocks swipe /
// outside-press / Escape. Closing is driven exclusively by the controlled
// `open` prop via the explicit Cancel / Action buttons, so the drawer matches
// the alert dialog's must-confirm behavior.
const ignoreDismissal = () => undefined;

interface ResponsiveAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ResponsiveAlertDialog = ({
  open,
  onOpenChange,
  children,
}: PropsWithChildren<ResponsiveAlertDialogProps>) => {
  const isMobile = useIsMobile();

  const close = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const value = useMemo<ResponsiveAlertDialogContextValue>(
    () => ({ isMobile, close }),
    [isMobile, close],
  );

  return (
    <ResponsiveAlertDialogContext.Provider value={value}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={ignoreDismissal} dismissible={false}>
          {children}
        </Drawer>
      ) : (
        <AlertDialog open={open} onOpenChange={ignoreDismissal}>
          {children}
        </AlertDialog>
      )}
    </ResponsiveAlertDialogContext.Provider>
  );
};

interface PrimitiveProps {
  className?: string;
  children?: ReactNode;
}

const ResponsiveAlertDialogContent = ({
  className,
  children,
  size = "default",
}: PrimitiveProps & { size?: "default" | "sm" }) => {
  const { isMobile } = useResponsiveAlertDialog();

  if (isMobile) {
    return (
      <DrawerContent role="alertdialog" className={className}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <AlertDialogContent size={size} className={className}>
      {children}
    </AlertDialogContent>
  );
};

const ResponsiveAlertDialogHeader = ({
  className,
  children,
}: PrimitiveProps) => {
  const { isMobile } = useResponsiveAlertDialog();

  return isMobile ? (
    <DrawerHeader className={className}>{children}</DrawerHeader>
  ) : (
    <AlertDialogHeader className={className}>{children}</AlertDialogHeader>
  );
};

const ResponsiveAlertDialogFooter = ({
  className,
  children,
}: PrimitiveProps) => {
  const { isMobile } = useResponsiveAlertDialog();

  return isMobile ? (
    <DrawerFooter className={className}>{children}</DrawerFooter>
  ) : (
    <AlertDialogFooter className={className}>{children}</AlertDialogFooter>
  );
};

const ResponsiveAlertDialogTitle = ({
  className,
  children,
}: PrimitiveProps) => {
  const { isMobile } = useResponsiveAlertDialog();

  return isMobile ? (
    <DrawerTitle className={className}>{children}</DrawerTitle>
  ) : (
    <AlertDialogTitle className={className}>{children}</AlertDialogTitle>
  );
};

const ResponsiveAlertDialogDescription = ({
  className,
  children,
}: PrimitiveProps) => {
  const { isMobile } = useResponsiveAlertDialog();

  return isMobile ? (
    <DrawerDescription className={className}>{children}</DrawerDescription>
  ) : (
    <AlertDialogDescription className={className}>
      {children}
    </AlertDialogDescription>
  );
};

const ResponsiveAlertDialogAction = (props: ComponentProps<typeof Button>) => {
  return <Button data-slot="responsive-alert-dialog-action" {...props} />;
};

const ResponsiveAlertDialogCancel = ({
  variant = "outline",
  onClick,
  ...restProps
}: ComponentProps<typeof Button>) => {
  const { close } = useResponsiveAlertDialog();

  return (
    <Button
      data-slot="responsive-alert-dialog-cancel"
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
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
};
