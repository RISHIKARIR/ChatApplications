import { Mail, User } from "lucide-react";

export const profileUser = (user) => {
  return [
    {
      name : "name",  
      label: "Name",
      user: user?.name,
      icon: <User />,
      editable : false
    },
    {
      name : "email",
      label: "Email Address",
      user: user?.email,
      icon: <Mail />,
      editable : false
    }
  ];
}



