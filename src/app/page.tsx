import { CloverBoard } from "@/components/CloverBoard";
import { GenerateAnswerPanel } from "@/components/GenerateAnswerPanel";

export default function Home() {
  return (
    <div className="clover-page min-h-screen px-4 py-4 text-foreground sm:px-8">
      <main className="solver-layout mx-auto min-h-[calc(100vh-2rem)] w-full max-w-6xl">
        <CloverBoard />
        <GenerateAnswerPanel />
      </main>
    </div>
  );
}
