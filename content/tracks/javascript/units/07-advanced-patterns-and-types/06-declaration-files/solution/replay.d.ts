export interface Play {
  title: string;
  minutes: number;
}

export function topTrack(plays: Play[]): string;
export function totalMinutes(plays: Play[]): number;
