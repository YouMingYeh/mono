export type User = {
  id: string;
  name: string;
  avatar: string;
  createdAt: Date;
  email?: string;
  phone?: string;
  bio?: string;
  birthday?: string;
};

export type Challenge = {
  id: string;
  name: string;
  createdAt: Date;
  description: string;
};

export type Memo = {
  challengeId: string;
  day: number;
  content?: string;
  sticker?: string;
};
