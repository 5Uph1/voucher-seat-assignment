import { useState } from "react";
import {
  Plane,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  User,
  CreditCard,
  Calendar as CalendarIcon,
  PlaneTakeoff,
  Ticket,
  Sparkles,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { checkVoucher, generateVoucher, toIsoDate } from "./api";
import type { AircraftType } from "./api";

const AIRCRAFT_OPTIONS: AircraftType[] = [
  "ATR",
  "Airbus 320",
  "Boeing 737 Max",
];

const DATE_PATTERN = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

// Helper: Konversi Date object ke string format DD-MM-YYYY
function formatDateToDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper: Parse string DD-MM-YYYY menjadi Date object
function parseDDMMYYYYToDate(str: string): Date | undefined {
  if (!str) return undefined;
  const parts = str.split("-").map(Number);
  if (parts.length !== 3) return undefined;
  const [day, month, year] = parts;
  if (!day || !month || !year) return undefined;
  return new Date(year, month - 1, day);
}

const initialForm = {
  crewName: "",
  crewId: "",
  flightNumber: "",
  flightDate: "",
  aircraftType: AIRCRAFT_OPTIONS[0] as AircraftType,
};

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [seats, setSeats] = useState<string[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const updateField = (field: keyof typeof initialForm, value: string) => {
    if (error) setError("");
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  function validate(): string {
    if (!form.crewName.trim()) return "Crew Name is required.";
    if (!form.crewId.trim()) return "Crew ID is required.";
    if (!form.flightNumber.trim()) return "Flight Number is required.";
    if (!DATE_PATTERN.test(form.flightDate.trim()))
      return "Please select a valid Flight Date.";
    return "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSeats(null);
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const isoDate = toIsoDate(form.flightDate.trim());

      const { exists } = await checkVoucher({
        flightNumber: form.flightNumber.trim(),
        date: isoDate,
      });

      if (exists) {
        throw new Error(
          `Vouchers for flight ${form.flightNumber} on ${form.flightDate} have already been generated.`,
        );
      }

      const result = await generateVoucher({
        name: form.crewName.trim(),
        id: form.crewId.trim(),
        flightNumber: form.flightNumber.trim(),
        date: isoDate,
        aircraft: form.aircraftType,
      });

      setSeats(result.seats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  }

  const handleCopySeats = () => {
    if (!seats) return;
    navigator.clipboard.writeText(seats.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setForm(initialForm);
    setSeats(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center p-4 sm:p-6 md:p-10 antialiased">
      <div className="w-full max-w-xl space-y-6">
        <Card className="border-slate-200/80 shadow-2xl backdrop-blur-sm bg-white/90 overflow-hidden">
          {/* Header Accent Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="rounded-2xl bg-blue-600 p-3 shadow-md shadow-blue-500/20 text-white">
                  <Plane className="h-6 w-6 transform -rotate-12" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
                    Voucher Seat Assignment
                  </CardTitle>
                  <CardDescription className="text-slate-500 text-xs sm:text-sm">
                    Generate promotional seat vouchers for flight crews.
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Crew Name */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="crewName"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Crew Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="crewName"
                      className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                      value={form.crewName}
                      onChange={(e) => updateField("crewName", e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* Crew ID */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="crewId"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Crew ID
                  </Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="crewId"
                      className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                      value={form.crewId}
                      onChange={(e) => updateField("crewId", e.target.value)}
                      placeholder="e.g. 98123"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* Flight Number */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="flightNumber"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Flight Number
                  </Label>
                  <div className="relative">
                    <PlaneTakeoff className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      id="flightNumber"
                      className="pl-9 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 uppercase transition-all font-medium tracking-wide"
                      value={form.flightNumber}
                      onChange={(e) =>
                        updateField(
                          "flightNumber",
                          e.target.value.toUpperCase(),
                        )
                      }
                      placeholder="e.g. GA102"
                      disabled={loading}
                      required
                    />
                  </div>
                </div>

                {/* Flight Date (Date Picker Interaktif) */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="flightDate"
                    className="text-xs font-semibold text-slate-700"
                  >
                    Flight Date
                  </Label>
                  <Popover
                    open={isCalendarOpen}
                    onOpenChange={setIsCalendarOpen}
                  >
                    <PopoverTrigger
                      id="flightDate"
                      disabled={loading}
                      className={`w-full justify-start text-left font-normal pl-9 relative bg-slate-50/50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all h-10 rounded-md px-4 py-2 text-sm inline-flex items-center ${
                        !form.flightDate ? "text-slate-400" : "text-slate-900"
                      }`}
                    >
                      <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      {form.flightDate ? (
                        <span className="text-slate-900 font-medium">
                          {form.flightDate}
                        </span>
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 bg-white border-slate-200 shadow-xl"
                      align="start"
                      initialFocus
                    >
                      <Calendar
                        mode="single"
                        selected={parseDDMMYYYYToDate(form.flightDate)}
                        onSelect={(selectedDate) => {
                          if (selectedDate) {
                            updateField(
                              "flightDate",
                              formatDateToDDMMYYYY(selectedDate),
                            );
                            setIsCalendarOpen(false);
                          }
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              {/* Aircraft Type Dropdown */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="aircraftType"
                  className="text-xs font-semibold text-slate-700"
                >
                  Aircraft Type
                </Label>
                <Select
                  value={form.aircraftType}
                  onValueChange={(v) =>
                    updateField("aircraftType", v as AircraftType)
                  }
                  disabled={loading}
                >
                  <SelectTrigger
                    id="aircraftType"
                    className="bg-slate-50/50 border-slate-200 focus:bg-white"
                  >
                    <SelectValue placeholder="Select aircraft" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {AIRCRAFT_OPTIONS.map((aircraft) => (
                      <SelectItem
                        key={aircraft}
                        value={aircraft}
                        className="cursor-pointer"
                      >
                        {aircraft}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Form Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all duration-200"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Vouchers...
                    </>
                  ) : (
                    <>
                      <Ticket className="mr-2 h-4 w-4" />
                      Generate Voucher
                    </>
                  )}
                </Button>

                {(form.crewName ||
                  form.flightNumber ||
                  form.flightDate ||
                  seats) && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={loading}
                    className="border-slate-200 hover:bg-slate-100 text-slate-600"
                    title="Reset Form"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>

            {/* Error Alert */}
            {error && (
              <Alert
                variant="destructive"
                className="border-red-200 bg-red-50/50 text-red-900 rounded-xl animate-in fade-in duration-200"
              >
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-sm font-semibold">
                  Action Required
                </AlertTitle>
                <AlertDescription className="text-xs text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Success Result Card */}
            {seats && (
              <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
                <Separator className="bg-slate-200/80" />

                <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-slate-50 to-blue-50/50 p-4 shadow-sm relative overflow-hidden">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-r border-slate-200/80" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-l border-slate-200/80" />

                  <div className="flex items-center justify-between pb-3 px-2 border-b border-dashed border-indigo-200/80">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">
                          Assigned Voucher Seats
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          {form.flightNumber} • {form.aircraftType}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopySeats}
                      className="h-8 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-600" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1.5 h-3.5 w-3.5" />
                          Copy Seats
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="pt-4 px-2 flex flex-wrap gap-2.5 justify-center sm:justify-start">
                    {seats.map((seat) => (
                      <Badge
                        key={seat}
                        className="px-5 py-2.5 text-base font-bold bg-white text-indigo-900 border border-indigo-200/80 shadow-sm hover:scale-105 hover:bg-indigo-600 hover:text-white transition-all cursor-default"
                      >
                        {seat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
