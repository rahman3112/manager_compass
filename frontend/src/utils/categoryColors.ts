export interface TileColor {
  bg: string;
  text: string;
}

const PALETTE: TileColor[] = [
  { bg: 'var(--navy-900)', text: '#fff' },
  { bg: 'var(--coral-surface)', text: 'var(--ink)' },
  { bg: 'var(--aqua-surface)', text: 'var(--ink)' },
  { bg: 'var(--coral)', text: '#fff' },
  { bg: 'var(--navy-700)', text: '#fff' },
  { bg: 'var(--aqua-deep)', text: '#fff' },
];

export function colorForCategory(index: number): TileColor {
  return PALETTE[index % PALETTE.length] ?? PALETTE[0];
}
