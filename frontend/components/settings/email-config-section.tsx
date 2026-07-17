export function EmailConfigSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white border-b border-zinc-800 pb-2">Email Configuration</h2>
      
      <div className="max-w-md">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-white">Current Provider</h3>
              <p className="text-sm text-zinc-400">Email delivery service</p>
            </div>
            <div className="text-sm font-medium text-zinc-300 bg-zinc-800 px-3 py-1 rounded-md">
              Configured on server
            </div>
          </div>
          
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-white">From Email</h3>
              <p className="text-sm text-zinc-400">Default sender address</p>
            </div>
            <div className="text-sm font-medium text-zinc-300 bg-zinc-800 px-3 py-1 rounded-md">
              Configured on server
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
