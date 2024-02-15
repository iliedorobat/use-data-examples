This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Short description:
When you make an API call for getting data for a table (I will refer to this call as query_1) but switch very fast to the second page (I will refer to this call as query_2) there are 3 different behaviors:
- query_1 finishes before switching to the second page and calling query_2. **[Normal behavior]**
- query_1 ends after the user navigates to the second page. In this case, stale data will be displayed until query_2 completes. **[BUG]**
- query_1 takes too long and query_2 has finished. In this case, even if query_2 has finished and the table is displaying correct data, the table will be updated with stale data as soon as query_1 finishes. **[Annoying BUG]**

## Implementation:
- useData: for querying a single API.
- useAllData: for querying multiple APIs - uses Promise.all for handling the responses.
- useAllSettledData: for querying multiple APIs: uses Promise.allSettled for handling the responses.

## Test cases:
There are 5 options in the sidebar:
- Ordinary Fetching: usual fetch which can cause the bug.
- Flag Controller Fetching: an alternative to abort controller approach. The difference is that the API calls will not be canceled but stale data is not displayed either.
- Abort Controller Fetching: the implementation I have mentioned.
- Promise All: the implementation of abort controller for multiple API calls.
- Promise All Settled: the implementation of abort controller for multiple API calls.

**Example 1: basic usage**
```javascript
const [data, setData, isLoading] = useData({
        endpoint,
        endpointParams,
        debugId: 'Flag Fetching',
        initialData: {
            count: 0,
            results: []
        }
    });
```

**Example 2: using a `contract`**
```javascript
const contract = ({endpoint, endpointParams, options}: ContractArgs) => {
    if (endpoint) {
        const url = prepareUrl(endpoint, endpointParams);
        return fetch(url, options).then(response => response.json());
    }

    return new Promise((resolve, reject) => {
        reject('The contract/endpoint in not valid!');
    });
};

const [data, setData, isLoading] = useData({
        contract,
        endpoint,
        endpointParams,
        debugId: 'Aborted Fetching',
        initialData: {
            count: 0,
            results: []
        }
    });
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
