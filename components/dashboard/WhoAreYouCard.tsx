import type { Member } from "@/lib/types";
import { initials } from "@/lib/format";
import { Card } from "@/components/ui/Card";

type WhoAreYouCardProps = {
  groupName: string;
  members: Member[];
  onPickMember: (memberId: string) => void;
};

// Friendly prompt shown when this device doesn't know which group member it belongs to
export function WhoAreYouCard({ groupName, members, onPickMember }: WhoAreYouCardProps) {
  return (
    <Card className="p-6">
      <p className="text-xs font-semibold uppercase tracking-widest text-rose">
        {groupName}
      </p>
      <h2 className="font-display text-3xl text-ink mt-1">Who are you?</h2>
      <p className="text-sm text-muted mt-1.5">
        Tap your face so we know whose balance to highlight on this device.
      </p>

      <div className="mt-5 space-y-2.5">
        {members.map((member) => (
          <button
            key={member.id}
            type="button"
            onClick={() => onPickMember(member.id)}
            className="w-full min-h-11 flex items-center gap-3 px-4 py-3 rounded-2xl bg-paper border-[1.5px] border-ink/25 hover:border-ink hover:bg-peach/40 transition-all text-left cursor-pointer"
          >
            <span className="w-9 h-9 rounded-full bg-peach border-[1.5px] border-ink flex items-center justify-center text-lg shrink-0">
              {member.avatar || initials(member.name)}
            </span>
            <span className="text-sm font-semibold text-ink">{member.name}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
