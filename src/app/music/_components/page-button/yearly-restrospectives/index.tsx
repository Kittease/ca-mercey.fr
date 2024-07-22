"use client";

import { CalendarHeart } from "lucide-react";

import PageButton from "..";

const YearlyRestrospectivesButton = () => {
  return (
    <PageButton
      onClick={() =>
        // eslint-disable-next-line no-alert
        alert("La page des rétrospectives annuelles arrive très bientôt !")
      }
      Icon={CalendarHeart}
      text={"Rétrospectives\nannuelles"}
    />
  );
};

export default YearlyRestrospectivesButton;
