import { appContainer } from '@/container';
import { IBucketService, S3BucketService } from './aws';

export function buildCloudIocContainer() {
  appContainer.addSingletonScope<IBucketService>('IBucketService', S3BucketService);
}

export * from './aws';
