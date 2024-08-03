"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "@/app/_components/ui/input";

const SearchBar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
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
        className="h-auto bg-stone-900 px-8 py-4 text-2xl"
        placeholder="Recherchez un album..."
        defaultValue={searchParams.get("query") ?? ""}
        onChange={(e) => handleSearch(e.target.value)}
      />

      <Search className="absolute inset-y-0 right-8 my-auto size-8" />
    </div>
  );
};

export default SearchBar;
