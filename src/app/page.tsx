import { CloverBoard } from "@/components/CloverBoard";

export default function Home() {
  return (
    <div className="wood-page min-h-screen px-4 py-6 text-foreground sm:px-8">
      <main className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col items-center justify-center gap-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-emerald-900/70 uppercase">
            clover-solver
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-stone-950 sm:text-4xl">
            ことばのクローバー！回答生成
          </h1>
        </div>

        <CloverBoard />
      </main>
    </div>
  );
}
