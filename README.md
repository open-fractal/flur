# Flur

This project is a frontend for the CAT20 token minter. It is built with Next.js and uses the [CATProtocol/cat-token-box](https://github.com/CATProtocol/cat-token-box) API to fetch data.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
V
Then, run the development server:

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

## Environment Variables

To run this project locally, you need to set up the following environment variables in a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Tracker API

The tracker API is hosted on the [CATProtocol/cat-token-box](https://github.com/CATProtocol/cat-token-box) repository.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
