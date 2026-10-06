# services

Everything that talks to the server. One flat folder per backend domain, however many features use it.

## What is here

```
services/
  api.ts              the client (getMainClient) and safeAwait
  <domain>/
    <verb>-<noun>.hook.ts     a query or mutation hook
    <domain>.interface.ts     the shapes the server sends
    <domain>.keys.ts          every query and mutation key of the domain
    <verb>-<noun>.ts          a plain request that is not a hook
```

`habit/` is a good one to copy.

## Rules

- Only `src/services` calls `getMainClient` and `axios`. A feature that needs a new request adds a function here. Tests: `architecture.test.ts` ("calls the API client only from src/services", "reach axios only from src/services").
- Every query and mutation key comes from a `.keys.ts` file. A literal array passed as `queryKey`, `mutationKey` or to `setQueryData` anywhere else fails ("writes query and mutation keys only in a keys file"). A key typed twice drifts.

```ts
export const habitKeys = {
	list: (archived: boolean) => ['get-habits', archived] as const,
	detail: (habitId: string) => ['get-habit-detail', habitId] as const,
	add: ['addHabit'] as const,
}
```

- The strings are what TanStack Query caches by. Renaming one is harmless. Never make two queries share a key they did not share before.
- A keys file is named after its domain ("names each keys file after its domain").
- `components/ui` never imports from here. A primitive does not fetch.
- An explicit refresh asks with `FRESH_REQUEST` from `api.ts`, through `queryClient.fetchQuery`, like `useRefreshCurrencies` and `useRefreshRssFeeds`. The service worker answers some paths from its cache (`background/cache-config.ts`), so a plain `refetch()` can come back with the copy the user is trying to replace.
- Hooks end in `.hook.ts` and live only here. A local React hook goes in a feature's `hooks/`.

## Adding a request

1. Pick the domain folder, or make one if the backend has a new domain.
2. Add its keys to `<domain>.keys.ts`.
3. Add the response shape to `<domain>.interface.ts`.
4. Write the hook, taking the key from the keys file.
5. After a mutation, invalidate with the same key object a query used.
6. Add the endpoint to `.github/Api-doc.md` and `.github/Api-doc.fa.md`, with the request it takes and the reply the app reads.

## Mistakes that happened

- The profile was invalidated as `['getUser']` after a purchase while it was cached as `['userProfile']`. The coin balance never refreshed.
- A failed request drew the empty state, so a network problem read as "you have no tasks". Read `isError` and draw the error. See `src/features/widgets/README.md`.
- A disabled query left a widget on its skeleton forever for a signed out user.

## Tests

Hooks need React, so they are not tested. Anything pure that a hook uses (parsing, sorting, mapping) goes in a function and gets a test. A test must never import `api.ts`.

`docs.test.ts` reads every request made in this folder and fails when `.github/Api-doc.md` or `.github/Api-doc.fa.md` does not list it, or lists one the app never calls.
