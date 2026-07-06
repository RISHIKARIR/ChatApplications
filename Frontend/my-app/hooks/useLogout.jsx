import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useContext } from "react";
import { SocketContext } from "../../my-app/app/context/socketContext";

function useLogout() {
  const router = useRouter();
  const { disconnectSocket } = useContext(SocketContext);

  const logout = async () => {
    disconnectSocket();

    const response = await fetch("http://localhost:5000/auth/logout", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      router.push("/login");
      toast.success("Logout successfull");
    }
  };

  return logout;
}

export default useLogout;
