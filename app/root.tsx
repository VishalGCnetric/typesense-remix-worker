import type { LinksFunction } from "@remix-run/cloudflare";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {
	type MetaFunction,
	type ActionFunctionArgs,
} from '@remix-run/cloudflare';
import * as React from 'react';
import {
	
	isRouteErrorResponse,
	json,
	useLoaderData,
	useRouteError,
} from '@remix-run/react';
// import stylesUrl from '~/styles.css?url';
import { ErrorLayout } from './layout';
import { commitSession, getSession } from './utils/cookies';

import "./tailwind.css";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
      <div className="flex min-h-screen flex-col">
			{/* Navbar */}
			<Navbar />

			{/* Main Content */}
			<div className="flex flex-1">
				{/* Page Content */}
				<main className="flex-1">
					<div className="container mx-auto px-6 py-4">{children}</div>
				</main>
			</div>

			{/* Footer */}
			<Footer />
		</div>        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
	const { token } = useLoaderData<LoaderData>();

	return (
				<Outlet context={{ token }} />
	);
}

type LoaderData = {
  token: string | null;
};

export async function loader({
  request,
}: {
  request: Request;
}): Promise<LoaderData> {
  const cookieHeader = request.headers.get('Cookie') || '';
  console.log('Cookie Header:', cookieHeader);

  const session = await getSession(cookieHeader);
  console.log('Session:', session.data || session);

  const token = session.get('token'); // Ensure this key matches your setup
  console.log('Token:', token);

  if (!token) {
      console.error('Token not found in session');
      return { token: null }; // Fallback response
  }

  return { token };
}

// Action to clear the authToken cookie
export async function action({ request }: ActionFunctionArgs) {
	const session = await getSession(request.headers.get('Cookie'));

	// Set token to null
	session.set('token', null);

	return json(
		{ success: true },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	// Log the error to the console
	console.error(error);

	if (isRouteErrorResponse(error)) {
		const title = `${error.status} ${error.statusText}`;

		let message;
		switch (error.status) {
			case 401:
				message =
					'Oops! Looks like you tried to visit a page that you do not have access to.';
				break;
			case 404:
				message =
					'Oops! Looks like you tried to visit a page that does not exist.';
				break;
			default:
				message = JSON.stringify(error.data, null, 2);
				break;
		}

		return (
			<Layout >
				<ErrorLayout title={title} description={message} />
			</Layout>
		);
	}

	return (
		<Layout >
			<ErrorLayout title="There was an error" description={`${error}`} />
		</Layout>
	);
}
