/**
* This file was automatically generated by @cosmwasm/ts-codegen@0.26.0.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

export type Uint128 = string;
export interface InstantiateMsg {
  owner: string;
  reward_rate: Uint128;
  reward_token: string;
  staking_addr: string;
}
export type ExecuteMsg = {
  update_config: {
    reward_rate: Uint128;
    reward_token: string;
    staking_addr: string;
  };
} | {
  distribute: {};
} | {
  withdraw: {};
} | {
  update_ownership: Action;
};
export type Action = {
  transfer_ownership: {
    expiry?: Expiration | null;
    new_owner: string;
  };
} | "accept_ownership" | "renounce_ownership";
export type Expiration = {
  at_height: number;
} | {
  at_time: Timestamp;
} | {
  never: {};
};
export type Timestamp = Uint64;
export type Uint64 = string;
export type QueryMsg = {
  info: {};
} | {
  ownership: {};
};
export type MigrateMsg = {
  from_v1: {};
};
export type Addr = string;
export interface InfoResponse {
  balance: Uint128;
  config: Config;
  last_payment_block: number;
}
export interface Config {
  reward_rate: Uint128;
  reward_token: Addr;
  staking_addr: Addr;
}
export interface OwnershipForAddr {
  owner?: Addr | null;
  pending_expiry?: Expiration | null;
  pending_owner?: Addr | null;
}