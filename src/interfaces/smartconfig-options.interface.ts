import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { ISmartNetwork } from '@hsuite/smart-network-types';

/**
 * Interface defining the factory for creating smart configuration options.
 * @description
 * This factory interface provides a standardized way to create configuration options
 * for the smart config module. It defines a contract that implementing classes must follow
 * to generate configuration options in a consistent manner.
 * 
 * Core Features:
 * - Configuration generation
 * - Async/sync support
 * - Type safety
 * - Standardized interface
 * 
 * @interface SmartConfigOptionsFactory
 * @category Interfaces
 * @subcategory Configuration
 * @since 2.0.0
 */
export interface SmartConfigOptionsFactory {
    /**
     * Creates and returns the smart configuration options.
     * @description
     * This method is responsible for generating the configuration options needed
     * by the smart config module. It supports both synchronous and asynchronous
     * option generation through Promise resolution.
     * 
     * Key Responsibilities:
     * - Generate configuration options
     * - Support async/sync operations
     * - Ensure type safety
     * - Validate configuration
     * 
     * @returns {Promise<ISmartNetwork.INetwork.IConfig.IOptions> | ISmartNetwork.INetwork.IConfig.IOptions} 
     * The configuration options object or a Promise that resolves to the options
     * 
     * @example
     * ```typescript
     * class CustomConfigFactory implements SmartConfigOptionsFactory {
     *   async createSmartConfigOptions() {
     *     return {
     *       // configuration options
     *     };
     *   }
     * }
     * ```
     */
    createSmartConfigOptions(): Promise<ISmartNetwork.INetwork.IConfig.IOptions> | ISmartNetwork.INetwork.IConfig.IOptions;
}

/**
 * Interface for asynchronous smart configuration module options.
 * @description
 * Provides various ways to configure the smart config module asynchronously.
 * Extends ModuleMetadata's imports to allow for dependency injection and
 * offers multiple configuration strategies through factory patterns.
 * 
 * Configuration Strategies:
 * - Existing factory usage
 * - Class instantiation
 * - Factory function
 * - Dependency injection
 * 
 * @interface SmartConfigModuleAsyncOptions
 * @extends {Pick<ModuleMetadata, 'imports'>}
 * @category Interfaces
 * @subcategory Configuration
 * @since 2.0.0
 */
export interface SmartConfigModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
    /**
     * An existing SmartConfigOptionsFactory type to be used.
     * @description
     * Allows using an existing factory class that implements SmartConfigOptionsFactory.
     * This approach is useful when you want to reuse an existing factory implementation
     * or share configuration logic across multiple modules.
     * 
     * Use Cases:
     * - Configuration reuse
     * - Shared factory logic
     * - Modular configuration
     * 
     * @type {Array<Type<any>>}
     */
    useExisting?: Array<Type<any>>;

    /**
     * A class to be instantiated as a SmartConfigOptionsFactory.
     * @description
     * Specifies a class that will be instantiated to create the configuration options.
     * The class must implement SmartConfigOptionsFactory interface to ensure
     * proper configuration generation.
     * 
     * Requirements:
     * - Must implement SmartConfigOptionsFactory
     * - Supports dependency injection
     * - Class-based configuration
     * 
     * @type {Type<any>}
     */
    useClass?: Type<any>;

    /**
     * A factory function that returns smart configuration options.
     * @description
     * A custom factory function that will be called to create the configuration options.
     * Supports both synchronous and asynchronous configuration generation through
     * direct return or Promise resolution.
     * 
     * Features:
     * - Flexible configuration creation
     * - Async/sync support
     * - Dependency injection
     * - Custom logic implementation
     * 
     * @param {...any[]} args - Arguments injected into the factory function
     * @returns {Promise<ISmartNetwork.INetwork.IConfig.IOptions> | ISmartNetwork.INetwork.IConfig.IOptions}
     * The configuration options or a Promise that resolves to the options
     */
    useFactory?: (...args: any[]) => Promise<ISmartNetwork.INetwork.IConfig.IOptions> | ISmartNetwork.INetwork.IConfig.IOptions;

    /**
     * Optional list of providers to be injected into the context of the Factory function.
     * @description
     * Specifies the dependencies that should be injected into the factory function.
     * These providers must be available in the module's context and will be resolved
     * during the configuration process.
     * 
     * Injection Features:
     * - Provider resolution
     * - Dependency management
     * - Context awareness
     * - Type safety
     * 
     * @type {any[]}
     */
    inject?: any[];
}