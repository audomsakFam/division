import Head from "next/head";
import HomePage from "./pages/user/home/page";

export default function Home() {
  return (
    <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]
    flex flex-col">
      <Head>
        <meta name="viewport" content="width=1024" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <HomePage />
    </div>
  );
}
