import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

function CreateAppointment() {
  const [shops, setShops] = useState([]);
  const [massageShop, setMassageShop] = useState("");
  const [date, setDate] = useState("");
  const { user } = useSelector((state) => state.auth);

  // โหลดร้านนวดจาก DB
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get("http://localhost:5003/api/v1/massageshops");
        setShops(response.data.data); // ถ้า controller ส่งแบบ { success, data }
      } catch (error) {
        toast.error("Cannot load massage shops");
      }
    };

    fetchShops();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!massageShop || !date) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post(
        "http://localhost:5003/api/v1/appointments",
        {
          massageShop,
          date,
        },
        config
      );

      toast.success("Appointment created successfully!");
      setMassageShop("");
      setDate("");
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create appointment");
    }
  };

  return (
    <div style={{ textAlign: "center", paddingTop: "50px" }}>
      <h1 style={{ marginBottom: "30px" }}>Create Appointment</h1>

      <form onSubmit={handleSubmit} style={{ display: "inline-block", textAlign: "left" }}>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Massage Shop:</strong></label><br />
          <select
            value={massageShop}
            onChange={(e) => setMassageShop(e.target.value)}
            required
            style={{ width: "250px", padding: "8px" }}
          >
            <option value="">-- Select Shop --</option>
            {shops.map((shop) => (
              <option key={shop._id} value={shop._id}>
                {shop.shopName} — {shop.address}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label><strong>Date & Time:</strong></label><br />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{ width: "250px", padding: "8px" }}
          />
        </div>

        <button 
          type="submit" 
          style={{
            width: "250px",
            padding: "12px",
            borderRadius: "5px",
            background: "black",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Create Appointment
        </button>
      </form>
    </div>
  );
}

export default CreateAppointment;
