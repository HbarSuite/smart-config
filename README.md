# @hsuite/smart-config

A powerful and flexible configuration management module for Hashgraph network applications, built on top of NestJS.

[![npm version](https://badge.fury.io/js/@hsuite%2Fsmart-config.svg)](https://badge.fury.io/js/@hsuite%2Fsmart-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

The Smart Config module provides a centralized configuration management system for Hashgraph network operations. It handles various aspects of configuration including network environments, node management, service discovery, and fee structures.

## Features

- **Network Environment Management**
  - Support for testnet and mainnet environments
  - Public and private network configurations
  - Custom network settings
  - Local development environment support

- **Node Configuration**
  - Dynamic node discovery and management
  - Consensus threshold calculation
  - Network entity configuration
  - Node health monitoring

- **Service Integration**
  - Mirror node configuration
  - HTTP service integration
  - Utility service discovery
  - Fee structure management

- **Operator Management**
  - Operator credentials handling
  - Access permission management
  - Operation parameter configuration

## Installation

```bash
npm install @hsuite/smart-config
```

### Peer Dependencies

```json
{
  "@nestjs/common": "^10.4.2",
  "@nestjs/core": "^10.4.2"
}
```

### Dependencies

```json
{
  "@hsuite/hashgraph-types": "^2.0.0",
  "@hsuite/smart-network-types": "^2.0.0",
  "@hashgraph/sdk": "^2.62.0",
}
```

## Usage

### Module Registration

The Smart Config module can be registered asynchronously in your NestJS application:

```typescript
import { Module } from '@nestjs/common';
import { SmartConfigModule } from '@hsuite/smart-config';

@Module({
  imports: [
    SmartConfigModule.forRootAsync({
      useFactory: () => ({
        environment: 'testnet',
        network: 'public',
        client_environment: 'testnet',
        // Additional configuration options
      }),
    }),
  ],
})
export class AppModule {}
```

### Using the Service

Inject and use the SmartConfigService in your application:

```typescript
import { Injectable } from '@nestjs/common';
import { SmartConfigService } from '@hsuite/smart-config';

@Injectable()
export class YourService {
  constructor(private readonly configService: SmartConfigService) {}

  async getNetworkNodes() {
    const nodes = await this.configService.getNodes();
    return nodes;
  }

  async getNetworkFees() {
    const fees = await this.configService.getFees();
    return fees;
  }
}
```

## Configuration Options

### Network Configuration

The module supports various network configurations through the `SmartConfigOptionsFactory` interface:

```typescript
interface SmartConfigOptionsFactory {
  createSmartConfigOptions(): Promise<ISmartNetwork.INetwork.IConfig.IOptions> | ISmartNetwork.INetwork.IConfig.IOptions;
}
```

### Async Configuration

Multiple configuration strategies are available:

1. **Factory Function**
```typescript
SmartConfigModule.forRootAsync({
  useFactory: (configService: ConfigService) => ({
    environment: configService.get('NETWORK_ENVIRONMENT'),
    network: configService.get('NETWORK_TYPE'),
    client_environment: configService.get('CLIENT_ENVIRONMENT'),
  }),
  inject: [ConfigService],
})
```

2. **Existing Factory**
```typescript
SmartConfigModule.forRootAsync({
  useExisting: [YourExistingConfigFactory],
})
```

3. **Class Factory**
```typescript
SmartConfigModule.forRootAsync({
  useClass: YourConfigFactory,
})
```

## API Reference

### SmartConfigService

#### Network Operations

- `getEnvironment()`: Get current network environment
- `getClientEnvironment()`: Get client environment as LedgerId
- `getNodes()`: Retrieve network node configurations
- `getUtilities()`: Get network utility services
- `getFees()`: Retrieve network fee structure

#### Configuration Management

- `getIssuer()`: Get Hashgraph network issuer configuration
- `getOperator()`: Get client operator configuration
- `getMirrorNode()`: Get mirror node settings
- `getThreshold()`: Calculate network consensus threshold

## Development

### Documentation

Generate documentation using Compodoc:

```bash
npm run compodoc
```

Check documentation coverage:

```bash
npm run compodoc:coverage
```

<p align="center">
  Built with ❤️ by the HbarSuite Team<br>
  Copyright © 2024 HbarSuite. All rights reserved.
</p>