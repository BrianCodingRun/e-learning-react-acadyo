export default function DotLoading() {
  return (
    <div className="flex text-3xl">
      <span className="animate-loading">.</span>
      <span className="animate-loading delay-150">.</span>
      <span className="animate-loading delay-300">.</span>
    </div>
  );
}
