<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'crew_name',
        'crew_id',
        'flight_number',
        'flight_date',
        'aircraft_type',
        'seat1',
        'seat2',
        'seat3',
    ];

    public function seatsArray(): array
    {
        return [$this->seat1, $this->seat2, $this->seat3];
    }

    public function scopeForFlight($query, string $flightNumber, string $flightDate)
    {
        return $query->where('flight_number', $flightNumber)
            ->where('flight_date', $flightDate);
    }
}
