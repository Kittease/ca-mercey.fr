"use client";

import { CalendarHeart } from "lucide-react";

import PageButton from "..";

const YearlyRestrospectivesButton = () => {
  return (
    <PageButton
      onClick={() =>
        alert("La page des rétrospectives annuelles arrive très bientôt !")
      }
      Icon={CalendarHeart}
      text={"Rétrospectives\nannuelles"}
      className="opacity-25 cursor-default"
    />
  );
};

export default YearlyRestrospectivesButton;
