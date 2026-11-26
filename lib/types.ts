export type Group = {
  id: string;
  code: string;
  name: string;
  vacation_mode: boolean;
};

export type Member = {
  id: string;
  name: string;
  avatar: string;
};

export type Payment = {
  id: string;
  paid_by: string;
  amount: number;
  note: string | null;
  created_at: string;
};

export type Balance = {
  id: string;
  name: string;
  avatar: string;
  paid: number;
  net: number;
};

export type Mood = "calm" | "tense" | "dramatic";

export type Stats = {
  totalSpend: number;
  fairShare: number;
  score: number;
  mood: Mood;
  balances: Balance[];
  nextPayer: Balance | null;
};

export type GroupData = {
  group: Group;
  members: Member[];
  payments: Payment[];
  stats: Stats;
};

export type Session = {
  code: string;
  memberId: string;
};

export type Transfer = {
  from: Balance;
  to: Balance;
  amount: number;
};
