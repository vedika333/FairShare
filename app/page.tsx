import { CreateJoinForm } from "@/components/home/CreateJoinForm";

// Home page: centers the Create/Join card inside a mobile-first container
export default function Home() {
  return (
    <main className="min-h-dvh flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px]">
        <CreateJoinForm />
      </div>
    </main>
  );
}
