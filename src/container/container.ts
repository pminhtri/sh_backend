import { Container, ServiceIdentifier } from 'inversify';

type Constructor<T = object> = new (...args: any[]) => T;

class AppContainer {
  private readonly container: Container;

  constructor() {
    this.container = new Container({ defaultScope: 'Singleton' });
  }

  /**
   * Register a service in singleton scope
   * @param identifier - token (string | symbol | class)
   * @param constructor - class to bind
   */
  public addSingletonScope<T>(identifier: ServiceIdentifier<T>, constructor: Constructor<T>): void {
    if (identifier.toString() === constructor.name) {
      // bind the class to itself
      this.container.bind<T>(constructor).toSelf().inSingletonScope();
    } else {
      this.container.bind<T>(identifier).to(constructor).inSingletonScope();
    }
  }

  /** Retrieve a bound service */
  public get<T>(identifier: ServiceIdentifier<T>): T {
    return this.container.get<T>(identifier);
  }

  /** Access the underlying container if needed */
  public getContainer(): Container {
    return this.container;
  }
}

const appContainer = new AppContainer();

export { appContainer, AppContainer };
