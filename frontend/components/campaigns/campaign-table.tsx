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
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="border-b border-border bg-muted/30">
            <tr>
              <th className="px-6 py-4 text-left font-medium text-muted-foreground w-1/4">Name</th>
              <th className="px-6 py-4 text-left font-medium text-muted-foreground w-1/4">Template Name</th>
              <th className="px-6 py-4 text-left font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-right font-medium text-muted-foreground">Recipients</th>
              <th className="px-6 py-4 text-right font-medium text-muted-foreground">Sent</th>
              <th className="px-6 py-4 text-right font-medium text-muted-foreground w-24">
                <span className="sr-only">Actions</span>
              </th>
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
    </div>
  );
}
