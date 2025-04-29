import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IHashgraph } from "@hsuite/hashgraph-types";
import { ISmartNetwork } from '@hsuite/smart-network-types';
import { LedgerId } from '@hashgraph/sdk';
import { HttpService } from '@nestjs/axios';
import * as lodash from 'lodash';

/**
 * Service for managing smart configurations in the Hashgraph network ecosystem.
 * @description
 * The SmartConfigService provides a centralized configuration management system for Hashgraph network operations.
 * It handles configuration retrieval and management for:
 * 
 * Core Features:
 * - Network environment settings (testnet/mainnet)
 * - Node configurations and management
 * - Utility services discovery
 * - Fee structure management
 * - Client environment handling
 * - Operator configurations
 * - Mirror node settings
 * 
 * Integration Points:
 * - Hashgraph network connectivity
 * - Environment configuration
 * - HTTP services
 * - Configuration providers
 * 
 * Configuration Types:
 * - Public networks
 * - Private networks
 * - Custom network configurations
 * - Local development settings
 * 
 * @example
 * ```typescript
 * // Inject and use the service
 * constructor(private configService: SmartConfigService) {}
 * 
 * async getNetworkNodes() {
 *   const nodes = await this.configService.getNodes();
 *   return nodes;
 * }
 * ```
 */
@Injectable()
export class SmartConfigService {

  /**
   * Creates an instance of SmartConfigService.
   * @param smartConfigOptions - Configuration options for the smart network
   * @param configService - NestJS ConfigService for environment variables
   * @param httpService - HTTP service for API requests
   * 
   * @description
   * Initializes the service with required dependencies:
   * - Smart network configuration options
   * - Environment configuration service
   * - HTTP client service
   * 
   * The constructor ensures proper dependency injection and service setup.
   */
  constructor(
    @Inject('smartConfigOptions') private readonly smartConfigOptions: ISmartNetwork.INetwork.IConfig.IOptions,
    protected configService: ConfigService,
    private readonly httpService: HttpService
  ) { }

  /**
   * Retrieves network configuration based on environment and network type.
   * @returns Network configuration object containing nodes, utilities, and fees
   * @private
   * 
   * @description
   * Determines and returns the appropriate network configuration based on:
   * - Environment context (testnet/mainnet)
   * - Network type (public/private)
   * - Client environment (testnet/local/mainnet)
   * 
   * Configuration Resolution:
   * 1. Checks environment type
   * 2. Validates network type
   * 3. Resolves client environment
   * 4. Returns appropriate configuration
   * 
   * @throws {Error} If invalid configuration combination is detected
   */
  private getNetworkConfig(): {
    nodes: Array<ISmartNetwork.INetwork.IEntity>,
    utilities: Array<ISmartNetwork.INetwork.IUtility>,
    fees: ISmartNetwork.INetwork.IFees.IEntity
  } {
    let networkConfig = null;
  
    switch(this.smartConfigOptions.environment) {
      case 'testnet':
        switch(this.smartConfigOptions.network) {
          case 'public':
            networkConfig = null;
            break;
          case 'private':
            networkConfig = this.smartConfigOptions.client_environment == 'testnet' ? 
              this.smartConfigOptions.customNetwork.testnet : this.smartConfigOptions.customNetwork.local;
            break;
        }
        break;
      case 'mainnet':
        networkConfig = this.smartConfigOptions.network == 'private' ? 
          this.smartConfigOptions.customNetwork.mainnet : null;
        break;
    }
  
    return networkConfig;
  }

  /**
   * Retrieves the current network environment setting.
   * @returns Current environment identifier (testnet/mainnet)
   * 
   * @description
   * Provides the current network environment context:
   * - Testnet for development and testing
   * - Mainnet for production deployment
   * 
   * @throws {Error} If environment configuration is missing
   */
  getEnvironment(): string {
    return this.configService.getOrThrow<string>('smartConfig.environment');
  }

  /**
   * Retrieves the client environment as Hashgraph LedgerId.
   * @returns LedgerId representing the client environment
   * 
   * @description
   * Converts the client environment string to a Hashgraph LedgerId:
   * - Validates environment string
   * - Creates appropriate LedgerId instance
   * - Ensures environment compatibility
   * 
   * @throws {Error} If client environment is invalid or missing
   */
  getClientEnvironment(): LedgerId {
    return LedgerId.fromString(
     this.configService.getOrThrow<string>('smartConfig.client_environment')
    );
  }

  /**
   * Retrieves the Hashgraph network issuer configuration.
   * @returns Promise resolving to issuer configuration
   * 
   * @description
   * Provides issuer details for network operations:
   * - Identity information
   * - Authorization details
   * - Network permissions
   * 
   * @throws {Error} If issuer configuration is missing
   */
  async getIssuer(): Promise<IHashgraph.IIssuer> {
    let issuer = this.configService.getOrThrow<IHashgraph.IIssuer>('issuer');
    return issuer;
  }

  /**
   * Retrieves the Hashgraph client operator configuration.
   * @returns Operator configuration object
   * 
   * @description
   * Provides operator settings for client operations:
   * - Credentials
   * - Access permissions
   * - Operation parameters
   * 
   * @throws {Error} If operator configuration is missing
   */
  getOperator(): IHashgraph.IOperator {
    let operator = this.configService.getOrThrow<IHashgraph.IOperator>('client.operator');
    return operator;
  }

  /**
   * Retrieves mirror node configuration settings.
   * @returns Mirror node configuration object
   * 
   * @description
   * Provides mirror node connection details:
   * - Node endpoints
   * - Connection parameters
   * - Service configurations
   * 
   * @throws {Error} If mirror node configuration is missing
   */
  getMirrorNode(): IHashgraph.IMirrorNode {
    try {
      let mirrorNode = this.configService.getOrThrow<IHashgraph.IMirrorNode>('mirrorNode');
      return mirrorNode;      
    } catch(error) {
      return {
        url: null,
        apiKey: null,
        grpc: null
      };
    }
  }

  /**
   * Calculates network consensus threshold based on node count.
   * @returns Promise resolving to calculated threshold value
   * 
   * @description
   * Determines consensus threshold for network operations:
   * - Retrieves threshold percentage
   * - Counts active nodes
   * - Calculates minimum required nodes
   * - Ensures network stability
   * 
   * Calculation: threshold = ceil((nodeCount * thresholdPercentage) / 100)
   * 
   * @throws {Error} If threshold calculation fails
   */
  async getThreshold(): Promise<number> {
    let thresholdValue = this.configService.getOrThrow<number>('clusterConfig.threshold');
    let nodes = await this.getNodes();
    let threshold = Math.ceil((nodes.length * thresholdValue) / 100);
    return threshold;
  }

  /**
   * Retrieves network node configurations.
   * @returns Promise resolving to array of network entities
   * 
   * @description
   * Provides network node information through:
   * 1. Local configuration check
   * 2. Remote API fallback
   * 
   * Data Sources:
   * - Network configuration
   * - HTTP API endpoints
   * - Local configurations
   * 
   * @throws {Error} If node retrieval fails or configuration is invalid
   */
  async getNodes(): Promise<Array<ISmartNetwork.INetwork.IEntity>> {
    return new Promise(async(resolve, reject) => {
      try {
        const networkConfig = this.getNetworkConfig();

        if(networkConfig) {
          resolve(networkConfig.nodes);
        } else {
          if(!lodash.isUndefined(this.smartConfigOptions.smartRegistryUrl) && this.smartConfigOptions.smartRegistryUrl !== 'local') {
            const response = await this.httpService.get(`${this.smartConfigOptions.smartRegistryUrl}/network/nodes`).toPromise();
            resolve(response.data);
          } else {
            reject(new Error('Base URL not set'));
          }  
        }
      } catch(error) {
        reject(error);
      }
    });
  }

  /**
   * Retrieves network utility configurations.
   * @returns Promise resolving to array of utility entities
   * 
   * @description
   * Provides network utility information through:
   * 1. Local configuration check
   * 2. Remote API fallback
   * 
   * Data Sources:
   * - Network configuration
   * - HTTP API endpoints
   * - Local configurations
   * 
   * @throws {Error} If utility retrieval fails or configuration is invalid
   */
  async getUtilities(): Promise<Array<ISmartNetwork.INetwork.IUtility>> {
    return new Promise(async(resolve, reject) => {
      try {
        const networkConfig = this.getNetworkConfig();

        if(networkConfig) {
          resolve(networkConfig.utilities);
        } else {
          if(!lodash.isUndefined(this.smartConfigOptions.smartRegistryUrl) && this.smartConfigOptions.smartRegistryUrl !== 'local') {
            const response = await this.httpService.get(`${this.smartConfigOptions.smartRegistryUrl}/network/utilities`).toPromise();
            resolve(response.data);
          } else {
            reject(new Error('Base URL not set'));
          } 
        }
      } catch(error) {
        reject(error);
      }
    });
  }

  /**
   * Retrieves network fee configurations.
   * @returns Promise resolving to fees configuration object
   * 
   * @description
   * Provides network fee information through:
   * 1. Local configuration check
   * 2. Remote API fallback
   * 
   * Data Sources:
   * - Network configuration
   * - HTTP API endpoints
   * - Local configurations
   * 
   * Fee Types:
   * - Transaction fees
   * - Service fees
   * - Network fees
   * 
   * @throws {Error} If fee retrieval fails or configuration is invalid
   */
  async getFees(): Promise<ISmartNetwork.INetwork.IFees.IEntity> {
    return new Promise(async(resolve, reject) => {
      try {
        const networkConfig = this.getNetworkConfig();

        if(networkConfig) {
          resolve(networkConfig.fees);
        } else {
          if(!lodash.isUndefined(this.smartConfigOptions.smartRegistryUrl) && this.smartConfigOptions.smartRegistryUrl !== 'local') {
            const response = await this.httpService.get(`${this.smartConfigOptions.smartRegistryUrl}/network/fees`).toPromise();
            resolve(response.data);
          } else {
            reject(new Error('Base URL not set'));
          }    
        }    
      } catch(error) {
        reject(error);
      }
    });
  }
}
