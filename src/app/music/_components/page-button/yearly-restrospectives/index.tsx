"use client";

import { CalendarHeart } from "lucide-react";

import PageButton from "@/app/music/_components/page-button";

const YearlyRestrospectivesButton = () => {
  return (
    <PageButton
      onClick={() => {
        alert("La page des rétrospectives annuelles arrive très bientôt !");
      }}
      Icon={CalendarHeart}
      text={"Rétrospectives\nannuelles"}
      className="cursor-default opacity-25"
    />
  );
};

export default YearlyRestrospectivesButton;
