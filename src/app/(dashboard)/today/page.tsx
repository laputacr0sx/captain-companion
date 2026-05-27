export default function TodayPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Today&apos;s Duty
      </h1>
      <div className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <p className="text-zinc-600 dark:text-zinc-400">
          No duty assigned for today.
        </p>
      </div>
    </div>
  );
}