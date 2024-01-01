import type { AppProps } from 'next/app'

import '@/styles/globals.scss'
import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
