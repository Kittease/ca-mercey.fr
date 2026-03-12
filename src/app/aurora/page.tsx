import AuroraApp from "./_components/aurora-app";

import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Aurora Forecast",
  description:
    "Real-time aurora borealis viewing probability based on solar wind, cloud cover, darkness, and moon conditions. Interactive 3D globe with aurora overlay.",
};

const AuroraPage = () => {
  return <AuroraApp />;
};

export default AuroraPage;
