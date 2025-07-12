import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { handleLogout } from "../services/userService";
import { useEffect, useState } from "react";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuthenticated(!!localStorage.getItem("AUTH_TOKEN"));
    }
  }, []);

  const onLogout = async (e: any) => {
    e.preventDefault();
    const loggedOut = handleLogout();
    if (loggedOut) {
      setIsAuthenticated(false);
    }
  };

  
  return (
    <header className="bg-primary text-light px-10 py-2 flex justify-between items-center">
      <div className="flex gap-10 justify-center items-center text-[16px]">
        <Image
          src="/images/logo.png"
          alt="GreenAlytic Logo"
          width={52}
          height={52}
          className="text-bt-primary flex justify-center items-center cursor-pointer text-2xl"
        />
      </div>
      <div className="flex gap-5 justify-center items-center text-lg">
        <Link href="./">Home</Link>
        <Link href="#">about</Link>
        <Link href="#">Contact us</Link>
      </div>
      <div className="flex gap-4 items-center">
        {isAuthenticated ? (
          <Button variant="default" onClick={onLogout}>
            Logout
          </Button>
        ) : (
          <Link href="/login">
            <Button variant="default">Login</Button>
          </Link>
        )}
        <Link href="/signup">
          <Button variant="secondary">Become a Member</Button>
        </Link>
      </div>
    </header>
  );
}
