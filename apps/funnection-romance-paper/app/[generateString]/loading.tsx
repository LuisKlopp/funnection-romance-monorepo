export default function Loading() {
  return (
    <main className="fixed inset-0 flex h-[100dvh] w-full items-center justify-center bg-[#fff9f4]">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#8b2248] border-t-transparent" />
        <p className="text-lg font-extrabold text-[#8b2248]">Funnection</p>
      </div>
    </main>
  );
}
