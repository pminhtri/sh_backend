import dotenv from 'dotenv';

export interface IConfigService {
  load(): void;
  get<T>(key: string): T;
  set(key: string, value: string): void;
}

export class ConfigService implements IConfigService {
  private readonly config: Record<string, string> = {};

  constructor() {
    dotenv.config();
  }

  public load(): void {
    for (const key in process.env) {
      if (process.env[key] !== undefined) {
        this.config[key] = process.env[key];
      }
    }
  }

  public get<T>(key: string): T {
    return this.config[key] as unknown as T;
  }

  public set(key: string, value: string): void {
    this.config[key] = value;
  }
}
