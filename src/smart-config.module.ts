/**
 * @file Smart Config module implementation
 * @module SmartConfig/Module
 * @description Implements the core configuration module for the Smart ecosystem.
 * This module provides dynamic configuration capabilities, HTTP integration,
 * and global configuration service access across the application.
 * @category Modules
 * @subcategory Configuration
 * @since 2.0.0
 */

import { DynamicModule, Module } from '@nestjs/common';
import { SmartConfigService } from './smart-config.service';
import { HttpModule } from '@nestjs/axios';
import { SmartConfigModuleAsyncOptions } from './interfaces/smartconfig-options.interface';

/**
 * Smart Configuration Module
 * @class SmartConfigModule
 * @description Provides dynamic configuration management within the Smart ecosystem.
 * This module handles:
 * 
 * Core Features:
 * - Dynamic module configuration
 * - Async configuration loading
 * - Global service registration
 * - HTTP integration
 * 
 * Integration Points:
 * - Configuration service
 * - HTTP module
 * - Factory providers
 * - Dependency injection
 * 
 * Configuration Management:
 * - Async options handling
 * - Factory configuration
 * - Provider registration
 * - Module exports
 * 
 * Used to maintain centralized configuration management
 * and provide configuration access across the application.
 * 
 * @example
 * ```typescript
 * // Register the module asynchronously
 * @Module({
 *   imports: [
 *     SmartConfigModule.forRootAsync({
 *       useFactory: () => ({
 *         // Configuration options
 *         apiUrl: 'https://api.example.com',
 *         timeout: 5000
 *       })
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
@Module({})
export class SmartConfigModule {
  /**
   * Configures the Smart Configuration Module asynchronously
   * @static
   * @async
   * @description Creates a dynamic module instance with async configuration.
   * This method provides:
   * 
   * Configuration Features:
   * - Async module initialization
   * - Dynamic provider setup
   * - HTTP client integration
   * - Global service registration
   * 
   * Provider Management:
   * - Service registration
   * - Factory configuration
   * - Dependency injection
   * - Module exports
   * 
   * Integration Capabilities:
   * - HTTP module setup
   * - Configuration injection
   * - Service exposure
   * - Global accessibility
   * 
   * @param {SmartConfigModuleAsyncOptions} options - Module configuration options
   * @returns {Promise<DynamicModule>} Configured dynamic module instance
   * 
   * @example
   * ```typescript
   * // Configure with environment-based settings
   * SmartConfigModule.forRootAsync({
   *   imports: [ConfigModule],
   *   useFactory: (configService: ConfigService) => ({
   *     apiUrl: configService.get('API_URL'),
   *     timeout: configService.get('TIMEOUT')
   *   }),
   *   inject: [ConfigService]
   * })
   * ```
   */
  static async forRootAsync(options: SmartConfigModuleAsyncOptions): Promise<DynamicModule> {
    return {
      module: SmartConfigModule,
      imports: [
        HttpModule.register({})
      ],
      controllers: [],
      providers: [
        SmartConfigService,
        {
          provide: 'smartConfigOptions',
          useFactory: options.useFactory,
          inject: options.useExisting
        }
      ],
      exports: [
        SmartConfigService
      ],
      global: true
    }
  }
}
