import '@/styles/globals.css';
import '@/styles/home/components.css';
import '@/styles/home/index.css';
import '@/styles/home/NewJeanSeHomePage.css';
import '@/styles/home/styles.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
