import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="bg-primary  text-light px-10 py-2  flex justify-between items-center">
      <div className="flex gap-10 justify-center items-center text-[16px]">
          <Image
            src="/images/logo.png"
            alt="b"
            width={52}
            height={52}
            className="text-bt-primary flex justify-center items-center cursor-pointer text-2xl"
          />
      </div>
      <div className="flex gap-5 justify-center items-center cursor-pointer text-lg">
        <Link href="./"> Home</Link>
        <Link href="#">Blog</Link>
        <Link href="#">community</Link>
      </div>
      <div className="flex gap-4 items-center">
        <Link href="/login">
          <Button variant="default">Login</Button>
        </Link>
        <Link href="/login">
          <Button variant="destructive">BECOME A MEMBER</Button>
        </Link>
      </div>
    </header>
  );
}
