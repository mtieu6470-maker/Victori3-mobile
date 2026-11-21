// CLOCK-02 simulation worker: owns the authoritative GameState off the UI thread. It loads its own
// copy of the bundled Historical Database (read-only static data) and answers SimCore requests in
// arrival order. No DOM, no network, no storage access.
import dbJson from '../../generated/db.json';
import mapJson from '../../generated/map.json';
import { HistoricalData, setData, type MapTopology } from '../../engine/data/db';
import type { HistoricalDB } from '../../engine/data/dbTypes';
import { SimCore, type SimRequest } from '../../engine/runtime/simCore';

setData(new HistoricalData(dbJson as unknown as HistoricalDB, mapJson as unknown as MapTopology));
const core = new SimCore();

self.onmessage = (e: MessageEvent<{ id: number; req: SimRequest }>) => {
  const { id, req } = e.data;
  const res = core.handle(req);
  (self as unknown as { postMessage(m: unknown): void }).postMessage({ id, res });
};
