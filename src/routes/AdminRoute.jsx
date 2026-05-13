import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const AdminRoute = ({ children, user }) => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists() && snap.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Admin check failed:", err);
        setIsAdmin(false);
      }

      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Checking access...
      </div>
    );
  }

  return isAdmin ? children : <Navigate to="/" replace />;
};

export default AdminRoute;
