import { Time } from "@src/constants/server";
import { Request } from "express";
import ipRangeCheck from 'ip-range-check';

// Ensures that incoming requests have valid and recent timestamps to prevent replay attacks.
export function checkTimestamp(req: Request): boolean {
    const timestamp = req.headers['timestamp'];
  
    if (!timestamp) {
      return false; 
    }
  
    const currentTime = Math.floor(Date.now() / 1000);
    const requestTime = parseInt(timestamp as string);
  
    if (isNaN(requestTime) || Math.abs(currentTime - requestTime) > 5 * Time.min) {
      return false; // Request timestamp is too old or too far in the future
    }
  
    return true; 
  }
  
  // Checks if the client's IP address is within the specified IP range(s).
  export function checkIp(req: Request, ipRange: string | string[]): boolean {
    // Retrieve the client's IP address from the request object
    const clientIP = req.ip;
  
    if (!clientIP || !ipRangeCheck(clientIP as string, ipRange)) {
      return false; // Client IP is not within the specified range(s)
    }
  
    return true; 
  }