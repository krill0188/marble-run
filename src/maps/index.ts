import { MapData } from '../types';
import { classicMap } from './classic';
import { funnelMap } from './funnel';
import { zigzagMap } from './zigzag';

export const maps: Record<string, MapData> = {
  classic: classicMap,
  funnel: funnelMap,
  zigzag: zigzagMap,
};

export function getMap(name: string): MapData {
  return maps[name] || classicMap;
}

export function getMapList(): { id: string; name: string }[] {
  return Object.entries(maps).map(([id, map]) => ({
    id,
    name: map.nameKo,
  }));
}
