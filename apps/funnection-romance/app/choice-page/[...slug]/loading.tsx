export default function Loading() {
  return (
    <main className="bg-romance-gradient text-romance-ink fixed inset-0 flex h-[100dvh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-romance-accent h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
        <p className="text-romance-accent text-lg font-extrabold">Funnection</p>
      </div>
    </main>
  );
}
