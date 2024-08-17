import '@/styles/globals.css';
import '@/styles/home/NewJeanSeHomePage.module.css'; // 필요한 파일만 import
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
	return <Component {...pageProps} />;
}
