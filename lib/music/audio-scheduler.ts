import type { MusicEvent } from "@/types/music";

export interface AudioScheduleItem {
  event: MusicEvent;
  startTime: number;
  endTime: number;
}

export interface AudioScheduler {
  schedule(
    event: MusicEvent,
    startTime: number,
    tempoBpm: number,
  ): AudioScheduleItem;

  scheduleAll(
    events: MusicEvent[],
    startTime: number,
    tempoBpm: number,
  ): AudioScheduleItem[];

  clear(): void;
}

export function createAudioScheduler(): AudioScheduler {
  const scheduledItems: AudioScheduleItem[] = [];

  function schedule(
    event: MusicEvent,
    startTime: number,
    tempoBpm: number,
  ): AudioScheduleItem {
    const beatDuration = 60 / tempoBpm;

    const item: AudioScheduleItem = {
      event,
      startTime:
        startTime + event.beatPosition * beatDuration,
      endTime:
        startTime +
        (event.beatPosition + event.duration) *
          beatDuration,
    };

    scheduledItems.push(item);

    return item;
  }

  function scheduleAll(
    events: MusicEvent[],
    startTime: number,
    tempoBpm: number,
  ): AudioScheduleItem[] {
    return events.map((event) =>
      schedule(event, startTime, tempoBpm),
    );
  }

  function clear(): void {
    scheduledItems.length = 0;
  }

  return {
    schedule,
    scheduleAll,
    clear,
  };
}
