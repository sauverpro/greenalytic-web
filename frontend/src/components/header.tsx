import Link from "next/link";
import SectionHeader from "@/components/ui/section-header";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="bg-white dark:bg-bg-secondary text-sm text-tx-third dark:text-tx-primary px-10 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
      <div className="flex gap-10 justify-center items-center">
        <div className="flex gap-4 justify-center items-center cursor-pointer text-2xl">
          <Image
            src="/hive-blockchain.svg"
            alt="b"
            width={32}
            height={32}
            className="text-bt-primary"
          />
          <p className="text-sm text-tx-secondary">baby.ai</p>
        </div>
        <SectionHeader />
        <Link href="./">Home</Link>
        <Link href="#">Blog</Link>
        <Link href="#">community</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link  href="/login" ><Button>Login</Button></Link>
        <button
          className="text-xl flex items-center gap-2"
        >
        </button>
      </div>
    </header>
  );
}
