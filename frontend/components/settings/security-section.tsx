export function SecuritySection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">Security</h2>
      
      <div className="max-w-md">
        <div className="relative rounded-lg border border-zinc-800 bg-zinc-900/40 p-6 overflow-hidden">
          
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
              Coming Soon
            </span>
          </div>

          <h3 className="text-base font-medium text-zinc-300">Change Password</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Update your account password to maintain security.
          </p>

          <div className="mt-4 space-y-4 opacity-50 pointer-events-none">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-400">Current Password</label>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-400">New Password</label>
              <input
                type="password"
                disabled
                placeholder="••••••••"
                className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-500"
              />
            </div>
            <button
              type="button"
              disabled
              className="rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-400"
            >
              Update Password
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
