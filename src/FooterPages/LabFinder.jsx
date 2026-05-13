import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { FlaskConical, Navigation, Phone, MapPin } from "lucide-react";

const LabFinder = () => {
  const [labs, setLabs] = useState([]);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingLabs, setFetchingLabs] = useState(true);

  // FETCH LABS FROM FIREBASE
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "labs"));
        const labData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLabs(labData);
        setFetchingLabs(false);
      } catch (error) {
        console.error("Error fetching labs:", error);
        setFetchingLabs(false);
      }
    };

    fetchLabs();
  }, []);

  // GET USER LOCATION
  const findMyLocation = () => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLoading(false);
      },
      () => {
        alert("Please enable location access");
        setLoading(false);
      },
    );
  };

  // DISTANCE CALCULATION (Haversine)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return (R * c).toFixed(2);
  };

  // OPEN GOOGLE MAPS
  const openMap = (lab) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${lab.lat},${lab.lng}`,
      "_blank",
    );
  };

  return (
    <section className="min-h-screen bg-gray-200 pt-28 pb-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-[#dff4ea] text-[#065f46] px-5 py-2 rounded-full border border-[#b7e4d2]">
            <FlaskConical size={18} />
            <span className="text-sm font-semibold uppercase">
               Lab Finder
            </span>
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-black text-[#065f46]">
            Find Labs Near You
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover verified laboratories in real-time using your location.
          </p>

          <button
            onClick={findMyLocation}
            className="mt-8 bg-[#065f46] hover:bg-[#044c39] text-white px-8 py-4 rounded-2xl font-semibold flex items-center gap-2 mx-auto shadow-lg"
          >
            <Navigation size={18} />
            {loading ? "Detecting Location..." : "Find Labs Near Me"}
          </button>
        </div>

        {/* CONTENT */}
        <div className="mt-14">
          {fetchingLabs ? (
            <p className="text-center text-gray-500">
              
            </p>
          ) : labs.length === 0 ? (
            <p className="text-center text-gray-500">No labs available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {labs.map((lab) => (
                <div
                  key={lab.id}
                  className="bg-white rounded-3xl p-6 shadow-lg border hover:-translate-y-2 transition-all"
                >
                  <div className="w-14 h-14 bg-[#dff4ea] text-[#065f46] rounded-2xl flex items-center justify-center">
                    <FlaskConical />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-[#065f46]">
                    {lab.name}
                  </h2>

                  {/* Distance */}
                  {location && (
                    <p className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                      <MapPin size={14} />
                      {getDistance(
                        location.lat,
                        location.lng,
                        lab.lat,
                        lab.lng,
                      )}{" "}
                      km away
                    </p>
                  )}

                  <p className="mt-2 text-gray-500 flex items-center gap-2">
                    <Phone size={14} />
                    {lab.phone}
                  </p>

                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      onClick={() => openMap(lab)}
                      className="bg-[#2bb673] hover:bg-[#22a363] text-white py-3 rounded-xl font-semibold"
                    >
                      View on Map
                    </button>

                    <button className="border border-[#065f46] text-[#065f46] hover:bg-[#065f46] hover:text-white py-3 rounded-xl font-semibold">
                      Book Test
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default LabFinder;
