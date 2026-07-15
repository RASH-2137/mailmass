import { Campaign } from "@/types/campaign";
import { CampaignRow } from "./campaign-row";

type CampaignTableProps = {
  campaigns: Campaign[];
  onCampaignChanged: () => void | Promise<void>;
};

export function CampaignTable({
  campaigns,
  onCampaignChanged,
}: CampaignTableProps) {
  return (
    <div className="rounded-xl border border-zinc-800 overflow-hidden">
      <table className="w-full">
        <thead className="bg-zinc-900">
          <tr className="border-b border-zinc-800">
            <th className="px-6 py-4 text-left text-zinc-400">Name</th>
            <th className="px-6 py-4 text-left text-zinc-400">Template Name</th>
            <th className="px-6 py-4 text-left text-zinc-400">Status</th>
            <th className="px-6 py-4 text-right text-zinc-400">Recipients</th>
            <th className="px-6 py-4 text-right text-zinc-400">Emails Sent</th>
            <th className="px-6 py-4 text-center text-zinc-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <CampaignRow
              key={campaign.id}
              campaign={campaign}
              onChanged={onCampaignChanged}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
