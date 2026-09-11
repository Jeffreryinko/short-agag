export type CardType = "clip" | "story" | "link";

export interface Post {
  t: CardType;
  src: string;
  time: string;
  title: string;
  sum?: string;
  emoji?: string;
  likes: number;
  cmt: number;
  also: number;
  cat: string[];
}

export interface Source {
  n: string;
  c: string;
}
