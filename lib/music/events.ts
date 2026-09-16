import type { MusicEvent } from "@/types/music";

export function createEvent(
  event: MusicEvent,
): MusicEvent {
  return { ...event };
}

export function moveEvent(
  event: MusicEvent,
  beatPosition: number,
): MusicEvent {
  return {
    ...event,
    beatPosition,
  };
}

export function resizeEvent(
  event: MusicEvent,
  duration: number,
): MusicEvent {
  return {
    ...event,
    duration,
  };
}

export function deleteEvent(
  events: MusicEvent[],
  eventId: string,
): MusicEvent[] {
  return events.filter((event) => event.id !== eventId);
}

export function sortEvents(
  events: MusicEvent[],
): MusicEvent[] {
  return [...events].sort(
    (a, b) => a.beatPosition - b.beatPosition,
  );
}
