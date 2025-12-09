import { Countdown, type CountdownData } from "../models/countdown.ts";
import { IDBManager } from "./manager.ts";

const COUNTDOWN_STORE_NAME = "countdown";

export class CountdownManager extends IDBManager {
  constructor() {
    super(COUNTDOWN_STORE_NAME);
  }

  public async addCountdown(countdown: Countdown): Promise<number> {
    countdown.validate();
    const id = await this.add(countdown.toIDBData());
    return id;
  }

  public async updateCountdown(countdown: Countdown): Promise<number> {
    countdown.validate();
    const id = await this.update(countdown.toIDBData());
    return id;
  }

  public async getAllCountdown(): Promise<Countdown[]> {
    const list = await this.getAll();

    return list.map((data) => {
      const countdownData = data as CountdownData;
      return new Countdown(countdownData);
    });
  }
}
