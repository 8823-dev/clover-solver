import { CloverBoard } from "@/components/CloverBoard";

export default function Home() {
  return (
    <div className="clover-page min-h-screen px-4 py-4 text-foreground sm:px-8">
      <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-center justify-center">
        <CloverBoard />
      </main>
    </div>
  );
}
