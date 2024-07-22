import { StarIcon } from "@radix-ui/react-icons";

import ImageCarousel from "@/app/_components/image-carousel";
import { cn } from "@/lib/tailwind";

const FavoriteAlbumsButton = () => {
  const coversRowOne = [
    "https://i.scdn.co/image/ab67616d0000b27378314563e242098560e45b4b",
    "https://i.scdn.co/image/ab67616d0000b273dd4e37113bd1826a7138da89",
    "https://i.scdn.co/image/ab67616d0000b273947c0eddb9b875fd0bb018a8",
    "https://i.scdn.co/image/ab67616d0000b2734fc850dcf4f77dd5b19c8718",
    "https://i.scdn.co/image/ab67616d0000b273ce63dcfcd57154183cb59c97",
    "https://i.scdn.co/image/ab67616d0000b27302bcde023896ac28593c7fe5",
    "https://i.scdn.co/image/ab67616d0000b27322e2eba9f3f5066cce5a636d",
  ];

  const coversRowTwo = [
    "https://i.scdn.co/image/ab67616d0000b273f01f2d9cf1b33641c8d58e7b",
    "https://i.scdn.co/image/ab67616d0000b273e86be8b546a2ba322ad1374f",
    "https://i.scdn.co/image/ab67616d0000b2734a46921606acdba4d1029140",
    "https://i.scdn.co/image/ab67616d0000b2733ef33302c9beb9f994a322d7",
    "https://i.scdn.co/image/ab67616d0000b27321ba6e14555ef1ce803e63be",
    "https://i.scdn.co/image/ab67616d0000b273de28aea81ea634589f80c8ae",
    "https://i.scdn.co/image/ab67616d0000b27331ac0ae08eb470692364f8b3",
  ];

  const coversRowThree = [
    "https://i.scdn.co/image/ab67616d0000b2739127367ad406522575a673d5",
    "https://i.scdn.co/image/ab67616d0000b273d924c058e689565def593211",
    "https://i.scdn.co/image/ab67616d0000b273ff8a4276b3be31c839557439",
    "https://i.scdn.co/image/ab67616d0000b273a0b52b22d6d6a89aff2eac02",
    "https://i.scdn.co/image/ab67616d0000b273805ae6e215ce80d74f51329b",
    "https://i.scdn.co/image/ab67616d0000b2735fddad380606f98aa6f1a3da",
    "https://i.scdn.co/image/ab67616d0000b273d93ab7dac95ec7322fbc7249",
  ];

  const coversRowFour = [
    "https://i.scdn.co/image/ab67616d0000b273a2d8391f5021568d253a4eef",
    "https://i.scdn.co/image/ab67616d0000b273196c4e2bda5ff5f2a0b0dd71",
    "https://i.scdn.co/image/ab67616d0000b273fcb013f45837c1d42f38de7b",
    "https://i.scdn.co/image/ab67616d0000b2736433d39592f86a9645794f01",
    "https://i.scdn.co/image/ab67616d0000b2739d02377d6b273142b23f9eb0",
    "https://i.scdn.co/image/ab67616d0000b273ed99e5f3188da1027ccb357b",
    "https://i.scdn.co/image/ab67616d0000b2733e0d05346299e86c58f75123",
  ];

  return (
    <div
      className={cn(
        "group relative flex size-fit items-center overflow-hidden rounded-xl border bg-stone-800",
        "border-stone-600 drop-shadow-md transition-all ease-in-out hover:border-stone-500 hover:drop-shadow-lg"
      )}
    >
      <div className="absolute z-0 flex origin-center -rotate-12 flex-col gap-y-4">
        {[coversRowOne, coversRowTwo, coversRowThree, coversRowFour].map(
          (covers, i) => (
            <ImageCarousel
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              imageUrls={covers}
              imageProps={{ width: 64, height: 64 }}
              speed={0.5}
              defaultState="paused"
              {...(i % 2 === 0
                ? {
                    reverse: true,
                    className:
                      "left-[calc(-1*(theme(spacing.16)+theme(spacing.6))/2)] w-[calc(100%+(theme(spacing.16)+theme(spacing.6))/2)]",
                  }
                : {})}
            />
          )
        )}
      </div>

      <div
        className={cn(
          "relative z-10 max-w-96 px-16 py-12",
          "before:absolute before:inset-0 before:z-0 before:bg-gradient-to-tr before:from-stone-950/95 before:to-stone-700/90",
          "before:opacity-100 before:transition-all before:ease-in-out hover:before:opacity-95"
        )}
      >
        <div className="relative z-10 flex flex-col items-center justify-center gap-y-6">
          <StarIcon className="size-12 text-stone-50" />
          <p className="text-center text-3xl text-stone-50">
            Mes albums favoris
          </p>
        </div>
      </div>
    </div>
  );
};

export default FavoriteAlbumsButton;
