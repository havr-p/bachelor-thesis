/**
 * Generated by orval v6.28.2 🍺
 * Do not edit manually.
 * OpenAPI definition
 * OpenAPI spec version: v0
 */
import type {Role} from './role';

export interface UserDTO {
  accessToken?: string;
  /**
   * @minLength 0
   * @maxLength 255
   */
  email?: string;
  id: number;
  name?: string;
  role?: Role
  tokenExpiry: Date;
  username: string;

}
