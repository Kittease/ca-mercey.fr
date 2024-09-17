"use client";

import { Search } from "lucide-react";
import { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/app/_components/ui/input";

const SearchBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname() as Route;
  const { replace } = useRouter();

  const handleSearch = (term: string) => {
    const trimmedTerm = term.trim();

    const params = new URLSearchParams(searchParams);

    if (trimmedTerm) {
      params.set("query", trimmedTerm);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <Input
        className="h-auto bg-stone-900 py-4 pl-8 pr-[calc(3*theme(spacing.6))] text-lg md:text-2xl"
        placeholder="Recherchez un album par nom, id, lien de partage..."
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <Search className="absolute inset-y-0 right-6 my-auto size-6" />
    </div>
  );
};

export default SearchBar;
