export class TimeCycleModel {
  currentTimeOfDay!: 'DAY' | 'NIGHT';
  lastChangeTimestamp!: Date;

  constructor(data: any) {
    this.currentTimeOfDay = data.currentTimeOfDay;
    this.lastChangeTimestamp = new Date(data.lastChangeTimestamp);
  }


  get minutesUntilNextCycle(): number {
    const now = new Date(); // Current time

    // Calculate the next change time (1 hour after the last change)
    const nextChangeDate = new Date(this.lastChangeTimestamp.getTime() + 60 * 60 * 1000); // Add 1 hour in milliseconds

    // Calculate the difference between now and the next change
    const diffMillis = nextChangeDate.getTime() - now.getTime();

    // Convert milliseconds to minutes and ensure non-negative value
    return Math.max(0, Math.floor(diffMillis / 60000));  // Return the time left in minutes
  }

}
