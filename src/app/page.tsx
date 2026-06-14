import { CloverBoard } from "@/components/CloverBoard";

export default function Home() {
  return (
    <div className="clover-page min-h-screen px-4 py-4 text-foreground sm:px-8">
      <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-stone-950 sm:text-4xl">
            ことばのクローバー！回答生成
          </h1>
        </div>

        <CloverBoard />
      </main>
    </div>
  );
}
