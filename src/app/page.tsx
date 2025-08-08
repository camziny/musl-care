import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Home",
  description: "Placeholder description for home page",
};
import HomePage from "./_components/HomePage";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HomePage />
    </main>
  );
}
