export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <main className="w-full max-w-2xl">
        <p className="text-sm font-medium text-emerald-700">clover-solver</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">
          ことばのクローバー！回答生成
        </h1>
        <p className="mt-4 text-base leading-7 text-zinc-600">
          Next.js、TypeScript、Tailwind CSS の開発環境を準備しています。
        </p>
      </main>
    </div>
  );
}
