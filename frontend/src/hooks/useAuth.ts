// useAuth.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("AUTH_TOKEN");
    const role = localStorage.getItem("USER_ROLE");

    if (!token) {
      router.push("/login");
      return;
    }

    if (window.location.pathname.startsWith("/admin") && role !== "admin") {
      router.push("/client");
    }

    if (window.location.pathname.startsWith("/client") && role === "admin") {
      router.push("/admin");
    }
  }, [router]);
}
