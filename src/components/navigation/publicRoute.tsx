import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

interface PublicProps {
  children: React.ReactNode;
}

const Public: React.FC<PublicProps> = ({ children }) => {
  const { token } = useAuth();
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default Public;
