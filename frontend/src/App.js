import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

// ---------------- NAVBAR -----------------
function Navbar() {
  return (
    <nav style={{ backgroundColor: "#004080", padding: "10px" }}>
      <ul style={{ display: "flex", listStyle: "none", margin: 0, padding: 0 }}>
        <li style={{ marginRight: "20px" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold" }}>MediLink</Link>
        </li>
        <li style={{ marginRight: "20px" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
        </li>
        <li style={{ marginRight: "20px" }}>
          <Link to="/doctors" style={{ color: "white", textDecoration: "none" }}>Doctors</Link>
        </li>
        <li style={{ marginRight: "20px" }}>
          <Link to="/appointments" style={{ color: "white", textDecoration: "none" }}>Appointments</Link>
        </li>
      </ul>
    </nav>
  );
}

// ---------------- HOME -----------------
function Home() {
  return (
    <div>
      <div
        style={{
          backgroundImage: "url('/back.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "black",
          textAlign: "center",
          padding: "20px"
        }}
      >
        <div>
          <h1>Welcome to MediLink</h1>
          <p>Connecting patients with doctors seamlessly</p>
        </div>
      </div>

      {/* Blogs Section */}
      <div style={{ padding: "40px", backgroundColor: "#f9f9f9" }}>
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Latest Blogs</h2>
        <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
          <div style={{ width: "300px", padding: "20px", background: "white", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", marginBottom:"20px" }}>
            <h3>Healthy Living</h3>
            <p>Tips on maintaining a balanced lifestyle and regular checkups.</p>
          </div>
          <div style={{ width: "300px", padding: "20px", background: "white", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", marginBottom:"20px" }}>
            <h3>Medical Research</h3>
            <p>Discover the latest advancements in healthcare and treatments.</p>
          </div>
          <div style={{ width: "300px", padding: "20px", background: "white", borderRadius: "10px", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", marginBottom:"20px" }}>
            <h3>Doctor’s Advice</h3>
            <p>Read expert advice from top doctors in different specialties.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- DOCTORS -----------------
function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentData, setAppointmentData] = useState({ patientName:"", date:"", time:"", contact:"", notes:"" });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch(err){ console.error(err) }
  };

  const bookAppointment = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({...appointmentData, doctorId: selectedDoctor._id, doctorName: selectedDoctor.name})
      });
      const data = await res.json();
      alert(data.message);
      setSelectedDoctor(null);
    } catch(err){ console.error(err) }
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding:"20px" }}>
      <h2>Doctors</h2>
      <input placeholder="Search by name or specialty" value={search} onChange={e=>setSearch(e.target.value)} style={{ padding:"8px", width:"300px", marginBottom:"20px" }} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"20px" }}>
        {filteredDoctors.map(d => (
          <div key={d._id} style={{ padding:"15px", border:"1px solid #ddd", borderRadius:"10px", boxShadow:"0 4px 8px rgba(0,0,0,0.1)", cursor:"pointer" }} onClick={()=>setSelectedDoctor(d)}>
            <h3>{d.name}</h3>
            <p><b>Specialty:</b> {d.specialty}</p>
            <p><b>Experience:</b> {d.experience}</p>
            <p><b>Fee:</b> {d.fee}</p>
            <p><b>Contact:</b> {d.contact}</p>
          </div>
        ))}
      </div>

      {selectedDoctor && (
        <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center"}}>
          <div style={{ background:"white", padding:"30px", borderRadius:"10px", width:"400px" }}>
            <h3>Book Appointment: {selectedDoctor.name}</h3>
            <input name="patientName" placeholder="Your Name" value={appointmentData.patientName} onChange={e=>setAppointmentData({...appointmentData,[e.target.name]:e.target.value})} style={{width:"100%", marginBottom:"10px"}}/>
            <input type="date" name="date" value={appointmentData.date} onChange={e=>setAppointmentData({...appointmentData,[e.target.name]:e.target.value})} style={{width:"100%", marginBottom:"10px"}}/>
            <input type="time" name="time" value={appointmentData.time} onChange={e=>setAppointmentData({...appointmentData,[e.target.name]:e.target.value})} style={{width:"100%", marginBottom:"10px"}}/>
            <input name="contact" placeholder="Contact" value={appointmentData.contact} onChange={e=>setAppointmentData({...appointmentData,[e.target.name]:e.target.value})} style={{width:"100%", marginBottom:"10px"}}/>
            <textarea name="notes" placeholder="Notes" value={appointmentData.notes} onChange={e=>setAppointmentData({...appointmentData,[e.target.name]:e.target.value})} style={{width:"100%", marginBottom:"10px"}}/>
            <button onClick={bookAppointment} style={{ marginRight:"10px", backgroundColor:"#28a745", color:"white", padding:"8px 12px", border:"none", borderRadius:"5px" }}>Book</button>
            <button onClick={()=>setSelectedDoctor(null)} style={{ backgroundColor:"#dc3545", color:"white", padding:"8px 12px", border:"none", borderRadius:"5px" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------- APPOINTMENTS -----------------
function Appointments() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/appointments");
      const data = await res.json();
      setAppointments(data);
    } catch(err) { console.error(err); }
  };

  return (
    <div style={{padding:"20px", maxWidth:"800px", margin:"auto"}}>
      <h2>Appointments</h2>
      {appointments.length === 0 ? <p>No appointments yet.</p> :
        appointments.map(a => (
          <div key={a._id} style={{border:"1px solid #ddd", padding:"15px", marginBottom:"10px", borderRadius:"8px", backgroundColor:"#f9f9f9"}}>
            <p><b>Doctor:</b> {a.doctorName}</p>
            <p><b>Patient:</b> {a.patientName}</p>
            <p><b>Date:</b> {new Date(a.date).toLocaleDateString()}</p>
            <p><b>Time:</b> {a.time}</p>
            <p><b>Contact:</b> {a.contact}</p>
            <p><b>Notes:</b> {a.notes}</p>
          </div>
        ))
      }
    </div>
  );
}

// ---------------- APP -----------------
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </Router>
  );
}

export default App;
