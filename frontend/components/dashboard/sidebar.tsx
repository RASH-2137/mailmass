export function Sidebar() {
  return (
    <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">

      <h1 className="text-2xl font-bold">
        MailMass
      </h1>

      <p className="text-sm text-zinc-400 mt-1">
        Email Marketing Platform
      </p>

      <nav className="mt-10 space-y-3">

        <div className="cursor-pointer rounded-lg px-3 py-2 hover:bg-zinc-800">
          Dashboard
        </div>

        <div className="cursor-pointer rounded-lg px-3 py-2 hover:bg-zinc-800">
          Contacts
        </div>

        <div className="cursor-pointer rounded-lg px-3 py-2 hover:bg-zinc-800">
          Templates
        </div>

        <div className="cursor-pointer rounded-lg px-3 py-2 hover:bg-zinc-800">
          Campaigns
        </div>

        <div className="cursor-pointer rounded-lg px-3 py-2 hover:bg-zinc-800">
          Analytics
        </div>

        <div className="cursor-pointer rounded-lg px-3 py-2 hover:bg-zinc-800">
          Settings
        </div>

      </nav>

    </aside>
  );
}