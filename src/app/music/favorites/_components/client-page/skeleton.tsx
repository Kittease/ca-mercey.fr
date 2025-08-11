const ProjectsSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="h-8 w-48 animate-pulse rounded bg-stone-100/50" />

        <div className="grid size-fit grid-cols-1 justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex size-64 animate-pulse flex-col justify-end bg-stone-800">
            <div className="h-1/3 animate-pulse bg-stone-700" />
          </div>

          <div className="flex size-64 animate-pulse flex-col justify-end bg-stone-800">
            <div className="h-1/3 animate-pulse bg-stone-700" />
          </div>

          <div className="flex size-64 animate-pulse flex-col justify-end bg-stone-800">
            <div className="h-1/3 animate-pulse bg-stone-700" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="h-8 w-48 animate-pulse rounded bg-stone-100/50" />

        <div className="grid size-fit grid-cols-1 justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex size-64 animate-pulse flex-col justify-end bg-stone-800">
            <div className="h-1/3 animate-pulse bg-stone-700" />
          </div>

          <div className="flex size-64 animate-pulse flex-col justify-end bg-stone-800">
            <div className="h-1/3 animate-pulse bg-stone-700" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectsSkeleton;
