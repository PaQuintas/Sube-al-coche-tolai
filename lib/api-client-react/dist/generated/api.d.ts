import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { CreateRoomInput, GameRoom, HealthStatus, JoinRoomInput, RoomEntryResponse, StartRoomInput } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateRoomUrl: () => string;
/**
 * @summary Create a game room
 */
export declare const createRoom: (createRoomInput: CreateRoomInput, options?: Parameters<typeof customFetch>[1]) => Promise<RoomEntryResponse>;
export declare const getCreateRoomMutationKey: () => readonly ["createRoom"];
export declare const getCreateRoomMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRoom>>, TError, CreateRoomMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createRoom>>, TError, CreateRoomMutationVariables, TContext>;
export type CreateRoomMutationResult = NonNullable<Awaited<ReturnType<typeof createRoom>>>;
export type CreateRoomMutationBody = BodyType<CreateRoomInput>;
export type CreateRoomMutationError = ErrorType<void>;
export type CreateRoomMutationVariables = {
    data: BodyType<CreateRoomInput>;
};
/**
* @summary Create a game room
*/
export declare const useCreateRoom: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRoom>>, TError, CreateRoomMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createRoom>>, TError, CreateRoomMutationVariables, TContext>;
export declare const getGetRoomUrl: (code: string) => string;
/**
 * @summary Get the current room and players
 */
export declare const getRoom: (code: string, options?: Parameters<typeof customFetch>[1]) => Promise<GameRoom>;
export declare const getGetRoomQueryKey: (code: string) => readonly [`/api/rooms/${string}`];
export declare const getGetRoomQueryOptions: <TData = Awaited<ReturnType<typeof getRoom>>, TError = ErrorType<void>>(code: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRoom>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRoom>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRoomQueryResult = NonNullable<Awaited<ReturnType<typeof getRoom>>>;
export type GetRoomQueryError = ErrorType<void>;
/**
 * @summary Get the current room and players
 */
export declare function useGetRoom<TData = Awaited<ReturnType<typeof getRoom>>, TError = ErrorType<void>>(code: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRoom>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getJoinRoomUrl: (code: string) => string;
/**
 * @summary Join an existing game room
 */
export declare const joinRoom: (code: string, joinRoomInput: JoinRoomInput, options?: Parameters<typeof customFetch>[1]) => Promise<RoomEntryResponse>;
export declare const getJoinRoomMutationKey: () => readonly ["joinRoom"];
export declare const getJoinRoomMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof joinRoom>>, TError, JoinRoomMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof joinRoom>>, TError, JoinRoomMutationVariables, TContext>;
export type JoinRoomMutationResult = NonNullable<Awaited<ReturnType<typeof joinRoom>>>;
export type JoinRoomMutationBody = BodyType<JoinRoomInput>;
export type JoinRoomMutationError = ErrorType<void>;
export type JoinRoomMutationVariables = {
    code: string;
    data: BodyType<JoinRoomInput>;
};
/**
* @summary Join an existing game room
*/
export declare const useJoinRoom: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof joinRoom>>, TError, JoinRoomMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof joinRoom>>, TError, JoinRoomMutationVariables, TContext>;
export declare const getStartRoomUrl: (code: string) => string;
/**
 * @summary Start the trip
 */
export declare const startRoom: (code: string, startRoomInput: StartRoomInput, options?: Parameters<typeof customFetch>[1]) => Promise<GameRoom>;
export declare const getStartRoomMutationKey: () => readonly ["startRoom"];
export declare const getStartRoomMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startRoom>>, TError, StartRoomMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof startRoom>>, TError, StartRoomMutationVariables, TContext>;
export type StartRoomMutationResult = NonNullable<Awaited<ReturnType<typeof startRoom>>>;
export type StartRoomMutationBody = BodyType<StartRoomInput>;
export type StartRoomMutationError = ErrorType<void>;
export type StartRoomMutationVariables = {
    code: string;
    data: BodyType<StartRoomInput>;
};
/**
* @summary Start the trip
*/
export declare const useStartRoom: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof startRoom>>, TError, StartRoomMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof startRoom>>, TError, StartRoomMutationVariables, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map