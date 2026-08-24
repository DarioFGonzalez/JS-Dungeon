export const loadMap = async (mapName: string): Promise<string[][]> => {
  const response = await fetch(`/maps/${mapName}.csv`);
  const raw = await response.text();
  
  return raw
    .trim()
    .split(/\r?\n/)
    .map(row => row.split(";").map(cell => cell.trim()));
};