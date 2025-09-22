import ClassroomLoading from "@/components/ClassroomLoading";

type LoadingGridProps = {
  count?: number; // nombre d'items skeleton
};

export default function LoadingGrid({ count = 3 }: LoadingGridProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ClassroomLoading key={i} />
      ))}
    </>
  );
}
