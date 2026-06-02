"use client";

import { ChevronRightIcon, PlusIcon, SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/app/_components/ui/responsive-dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/app/_components/ui/sidebar";
import AlbumRow from "@/app/admin/_components/album-picker/album-row";
import CreateAlbumForm from "@/app/admin/_components/album-picker/create-album-form";
import { Album } from "@/domain/photography/services/albums/types";
import { Routes } from "@/lib/routes";

interface AdminSidebarProps {
  albums: Album[];
}

const AdminSidebar = ({ albums }: AdminSidebarProps) => {
  const { isMobile } = useSidebar();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);

  const filteredAlbums = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    return trimmed
      ? albums.filter((album) => album.name.toLowerCase().includes(trimmed))
      : albums;
  }, [albums, query]);

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-6 text-center text-xl font-bold">
        ca-mercey.fr
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Photography</SidebarGroupLabel>

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                render={<a href={Routes.ADMIN_PHOTO}>Photo</a>}
                isActive={pathname === Routes.ADMIN_PHOTO}
              />
            </SidebarMenuItem>

            <DropdownMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <div className="flex flex-row items-center justify-between">
                      <a href={Routes.ADMIN_ALBUMS}>Albums</a>

                      <DropdownMenuTrigger
                        openOnHover
                        render={
                          <SidebarMenuAction>
                            <ChevronRightIcon />
                          </SidebarMenuAction>
                        }
                      />
                    </div>
                  }
                  isActive={pathname === Routes.ADMIN_ALBUMS}
                />

                <DropdownMenuContent
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                  className="w-full overflow-hidden p-0 md:w-72"
                >
                  <div className="flex items-center gap-2 border-b border-foreground/10 px-3">
                    <SearchIcon className="size-4 shrink-0 text-muted-foreground" />

                    <input
                      aria-label="Search albums"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key !== "Escape") {
                          event.stopPropagation();
                        }
                      }}
                      placeholder="Search albums…"
                      className="h-10 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="max-h-72 overflow-y-auto p-1">
                    {filteredAlbums.length > 0 ? (
                      filteredAlbums.map((album) => (
                        <DropdownMenuItem
                          key={album.id}
                          render={
                            <a href={`${Routes.ADMIN_ALBUMS}/${album.shortId}`}>
                              <AlbumRow album={album} />
                            </a>
                          }
                        />
                      ))
                    ) : (
                      <p className="px-2 py-1.5 text-xs text-muted-foreground">
                        No albums found
                      </p>
                    )}
                  </div>

                  <DropdownMenuSeparator className="mx-0 my-0" />

                  <div className="p-1">
                    <DropdownMenuItem onClick={() => setCreateOpen(true)}>
                      <PlusIcon />
                      Create new album
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </SidebarMenuItem>
            </DropdownMenu>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />

      <ResponsiveDialog open={createOpen} onOpenChange={setCreateOpen}>
        <ResponsiveDialogContent size="sm">
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Create album</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>

          <CreateAlbumForm
            onCreated={(album) => {
              setCreateOpen(false);
              toast.success(`Created “${album.name}”`);
            }}
            onCancel={() => setCreateOpen(false)}
            className="px-4 pb-4 md:px-0 md:pb-0"
          />
        </ResponsiveDialogContent>
      </ResponsiveDialog>
    </Sidebar>
  );
};

export default AdminSidebar;
