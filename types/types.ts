export type Event = "NETRAL" | "DRAW" | "GRAB" | "ERASE";
export type LineDraw = {
  tool: any;
  points: number[];
};

export type Size = {
  width: number;
  height: number;
};
