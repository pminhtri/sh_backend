import { inject, injectable } from 'inversify';
import mongoose, { ClientSession, Collection, Connection, ConnectionStates, Document, Model, Schema } from 'mongoose';

import { IConfigService } from '@/config';

interface ConnectionHooks {
  onConnecting?: () => void;
  onConnected?: () => void;
  onOpen?: () => void;
  onDisconnecting?: () => void;
  onDisconnected?: () => void;
  onClose?: () => void;
  onReconnected?: () => void;
  onError?: (error: unknown) => void;
}

interface ModelDefinition {
  name: string;
  schema: Schema;
}

@injectable()
class DBContext {
  private connection: Connection;
  private collections = new Map<string, Collection>();
  private models: ModelDefinition[] = [];

  constructor(@inject('IConfigService') private readonly configService: IConfigService) {
    this.connection = mongoose.connection;
  }

  private async createConnection(hooks?: ConnectionHooks): Promise<Connection> {
    const connection = this.connection;

    connection.on('connecting', () => {
      if (hooks?.onConnecting) {
        hooks.onConnecting();
      }
    });

    connection.on('connected', () => {
      if (hooks?.onConnected) {
        hooks.onConnected();
      }
    });

    connection.on('open', () => {
      if (hooks?.onOpen) {
        hooks.onOpen();
      }
    });

    connection.on('disconnecting', () => {
      if (hooks?.onDisconnecting) {
        hooks.onDisconnecting();
      }
    });

    connection.on('disconnected', () => {
      if (hooks?.onDisconnected) {
        hooks.onDisconnected();
      }
    });

    connection.on('close', () => {
      if (hooks?.onClose) {
        hooks.onClose();
      }
    });

    connection.on('reconnected', () => {
      if (hooks?.onReconnected) {
        hooks.onReconnected();
      }
    });

    connection.on('error', (error) => {
      if (hooks?.onError) {
        hooks.onError(error);
      }
    });

    await mongoose.connect(this.configService.get<string>('MONGO_URI'), {
      ignoreUndefined: true,
      autoIndex: true
    });

    return connection;
  }

  public model<TDocument = Document>(name: string): Model<TDocument> {
    return this.connection.model<TDocument>(name);
  }

  public defineModels(models: ModelDefinition[]): void {
    for (const { name, schema } of models) {
      if (!this.models.find((model) => model.name === name)) {
        this.models.push({ name, schema });
        this.connection.model(name, schema);
      }
    }
  }

  public async connect(hooks?: ConnectionHooks): Promise<void> {
    this.connection = await this.createConnection(hooks || {});
  }

  public async disconnect(): Promise<void> {
    if (this.connection.readyState === ConnectionStates.disconnected) {
      return;
    }

    await this.connection.close();

    this.collections.clear();
  }

  public async collectionExists(name: string): Promise<boolean> {
    if (this.collections.has(name)) {
      return true;
    }

    const db = this.connection.db;

    if (db) {
      const collections = await db.listCollections({ name }).toArray();

      if (collections.length > 0) {
        return true;
      }
    }

    return false;
  }

  public async useTransaction<T>(fn: (session: ClientSession) => Promise<T>): Promise<T> {
    const session = await this.connection.startSession();
    try {
      let result!: T;

      await session.withTransaction(
        async () => {
          result = await fn(session);
        },
        {
          readConcern: { level: 'snapshot' },
          writeConcern: { w: 'majority' },
          readPreference: 'primary'
        }
      );

      return result;
    } finally {
      await session.endSession();
    }
  }
}

export default DBContext;
