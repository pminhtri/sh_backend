import 'reflect-metadata';

import { buildApiIocContainer } from '@/api';
import { App } from '@/app';
import { buildModulesIocContainer } from '@/application';
import { ConfigService, IConfigService } from '@/config';
import { appContainer } from '@/container';
import { buildCloudIocContainer, DBContext } from '@/infra';

function buildAppIocContainer() {
  appContainer.addSingletonScope<IConfigService>('IConfigService', ConfigService);
  appContainer.addSingletonScope<DBContext>('DBContext', DBContext);

  buildModulesIocContainer();
  buildApiIocContainer();
  buildCloudIocContainer();
}

async function start() {
  buildAppIocContainer();

  const configService = appContainer.get<IConfigService>('IConfigService');
  configService.load();

  const app = new App(configService);
  await app.run();
}

start();
