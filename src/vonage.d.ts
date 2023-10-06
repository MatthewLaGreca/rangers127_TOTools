import { Vonage } from "@vonage/server-sdk";

declare module '@vonage/server-sdk' {
    export class CustomVonage extends Vonage {
      constructor(options: { apiKey: string; apiSecret: string });
      // Define other methods and types used from the package
    }
  
    // Define additional types and interfaces as needed
  }