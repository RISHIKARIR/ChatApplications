import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useContext } from "react";
import { SocketContext } from "../../my-app/app/context/socketContext";
import { Apifetch } from "../lib/apifetch";

function useLogout() {
  const router = useRouter();
  const { disconnectSocket } = useContext(SocketContext);

  const logout = async () => {
    disconnectSocket();

    const response = await Apifetch("auth/logout", {
      method: "POST"
    });

    if (response.ok) {
      router.push("/login");
      toast.success("Logout successfull");
    }
  };

  return logout;
}

export default useLogout;
