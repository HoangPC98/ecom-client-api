import { Global, Module } from '@nestjs/common';
import { CacheProvider } from './cache.provider';
import { CacheModule } from '@nestjs/cache-manager';
import { AppConfigService } from 'src/configs/app.config.service';
import { redisStore } from 'cache-manager-redis-yet';
@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: 'localhost',
            port: 6380,
          },
        }),
      }),
    }),
  ],
  providers: [
    CacheProvider,
    {
      provide: 'MY_CACHE_PROVIDER',
      useValue: CacheProvider,
    },
    AppConfigService,
  ],
  exports: [CacheProvider, 'MY_CACHE_PROVIDER'],
})
export class MyCacheModule {}
