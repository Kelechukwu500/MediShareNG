import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const PartnerRoute = ({ children, user }) => {
  const [loading, setLoading] = useState(true);
  const [isPartner, setIsPartner] = useState(false);

  useEffect(() => {
    const checkPartner = async () => {
      if (!user) {
        setIsPartner(false);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists() && snap.data().role === "partner") {
          setIsPartner(true);
        } else {
          setIsPartner(false);
        }
      } catch (err) {
        console.error("Partner check failed:", err);
        setIsPartner(false);
      }

      setLoading(false);
    };

    checkPartner();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Checking partner access...
      </div>
    );
  }

  // Not logged in → Go to Login (This is what you want)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not a partner → Go to Homepage
  if (!isPartner) {
    return <Navigate to="/" replace />;
  }

  // Authorized Partner → Show page
  return children;
};

export default PartnerRoute;
