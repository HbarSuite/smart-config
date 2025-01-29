/**
 * @module SmartConfig
 * @description
 * This module provides configuration management functionality through SmartConfigModule and SmartConfigService.
 * It allows for dynamic configuration loading and management in a NestJS application.
 * 
 * @packageDocumentation
 * 
 * @example
 * ```typescript
 * import { SmartConfigModule } from '@lib/smart-config';
 * 
 * @Module({
 *   imports: [
 *     SmartConfigModule.forRoot({
 *       // configuration options
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 * 
 * @publicApi
 */

/**
 * Export the SmartConfigModule which provides the configuration system
 * @see SmartConfigModule
 */
export * from './smart-config.module';

/**
 * Export the SmartConfigService which handles configuration management
 * @see SmartConfigService 
 */
export * from './smart-config.service';
