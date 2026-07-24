import { useState } from "react";
import { checkVoucher, generateVoucher, toIsoDate } from "./api";

const AIRCRAFT_OPTIONS = ["ATR", "Airbus 320", "Boeing 737 Max"];
const DATE_PATTERN = /^\d{2}-\d{2}-\d{4}$/;

const initialForm = {
  crewName: "",
  crewId: "",
  flightNumber: "",
  flightDate: "",
  aircraftType: AIRCRAFT_OPTIONS[0],
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [seats, setSeats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    if (!form.crewName.trim()) return "Crew name is required.";
    if (!form.crewId.trim()) return "Crew ID is required.";
    if (!form.flightNumber.trim()) return "Flight number is required.";
    if (!DATE_PATTERN.test(form.flightDate))
      return "Flight date must be in DD-MM-YYYY format.";
    return "";
  }

  async function handleGenerate(e) {
    e.preventDefault();
    setSeats(null);
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const isoDate = toIsoDate(form.flightDate);
    setLoading(true);

    try {
      const { exists } = await checkVoucher({
        flightNumber: form.flightNumber,
        date: isoDate,
      });

      if (exists) {
        setError(
          `Vouchers have already been generated for flight ${form.flightNumber} on ${form.flightDate}.`,
        );
        return;
      }

      const result = await generateVoucher({
        name: form.crewName,
        id: form.crewId,
        flightNumber: form.flightNumber,
        date: isoDate,
        aircraft: form.aircraftType,
      });

      setSeats(result.seats);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1>Voucher Seat Assignment</h1>
        <p className="subtitle">
          Generate 3 random seat vouchers for a flight.
        </p>

        <form onSubmit={handleGenerate} className="form">
          <label>
            Crew Name
            <input
              type="text"
              value={form.crewName}
              onChange={(e) => updateField("crewName", e.target.value)}
              placeholder="e.g. Sarah"
            />
          </label>

          <label>
            Crew ID
            <input
              type="text"
              value={form.crewId}
              onChange={(e) => updateField("crewId", e.target.value)}
              placeholder="e.g. 98123"
            />
          </label>

          <label>
            Flight Number
            <input
              type="text"
              value={form.flightNumber}
              onChange={(e) =>
                updateField("flightNumber", e.target.value.toUpperCase())
              }
              placeholder="e.g. GA102"
            />
          </label>

          <label>
            Flight Date
            <input
              type="text"
              value={form.flightDate}
              onChange={(e) => updateField("flightDate", e.target.value)}
              placeholder="DD-MM-YYYY"
            />
          </label>

          <label>
            Aircraft Type
            <select
              value={form.aircraftType}
              onChange={(e) => updateField("aircraftType", e.target.value)}
            >
              {AIRCRAFT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Vouchers"}
          </button>
        </form>

        {error && <div className="alert alert-error">{error}</div>}

        {seats && (
          <div className="alert alert-success">
            <strong>Vouchers generated!</strong>
            <div className="seats">
              {seats.map((seat) => (
                <span key={seat} className="seat-pill">
                  {seat}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
