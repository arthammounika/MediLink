import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 17.3850, // Hyderabad default
  lng: 78.4867,
};

function Doctors() {
  const [doctors, setDoctors] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // 🔑 Get free API key from Google Cloud
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/doctors")
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Available Doctors</h2>

      {/* Doctor List */}
      <ul>
        {doctors.map((doc) => (
          <li key={doc._id}>
            <strong>{doc.name}</strong> – {doc.specialization} <br />
            {doc.clinicAddress} <br />
            {doc.availableDays.join(", ")} | {doc.availableTime}
          </li>
        ))}
      </ul>

      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={12}
        center={center}
      >
        {doctors.map((doc) => (
          <Marker
            key={doc._id}
            position={{
              lat: doc.location.coordinates[1], // latitude
              lng: doc.location.coordinates[0], // longitude
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
}

export default Doctors;
