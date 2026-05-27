import Link from "next/link";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Captain Companion
          </h1>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Your train duty assistant — search, compare, swap, and sync duties.
          </p>
        </div>

        <div className="grid gap-3">
          <Link
            href="/today"
            className="flex items-center justify-center h-12 px-6 rounded-lg bg-zinc-900 text-zinc-50 font-medium hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          >
            Today&apos;s Duty
          </Link>
          <Link
            href="/duties"
            className="flex items-center justify-center h-12 px-6 rounded-lg border border-zinc-200 text-zinc-900 font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Search Duties
          </Link>
          <Link
            href="/swaps"
            className="flex items-center justify-center h-12 px-6 rounded-lg border border-zinc-200 text-zinc-900 font-medium hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            Swap Requests
          </Link>
        </div>
      </div>
    </main>
  );
}
