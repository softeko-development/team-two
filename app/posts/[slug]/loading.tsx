export default function PostRouteLoading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-12">
      <div className="mb-8 h-5 w-24 rounded bg-zinc-200" />

      <div className="space-y-8">
        <header className="space-y-4 border-b border-zinc-200 pb-6">
          <div className="flex gap-3">
            <div className="h-6 w-24 rounded-full bg-zinc-200" />
            <div className="h-6 w-40 rounded bg-zinc-200" />
          </div>
          <div className="space-y-3">
            <div className="h-10 w-3/4 rounded bg-zinc-200" />
            <div className="h-5 w-64 rounded bg-zinc-200" />
          </div>
        </header>

        <div className="space-y-3">
          <div className="h-5 w-full rounded bg-zinc-200" />
          <div className="h-5 w-11/12 rounded bg-zinc-200" />
          <div className="h-5 w-4/5 rounded bg-zinc-200" />
        </div>
      </div>
    </main>
  );
}
