<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VoucherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'success' => true,
            'seats' => $this->seatsArray(),
            'flightNumber' => $this->flight_number,
            'date' => $this->flight_date,
            'aircraft' => $this->aircraft_type,
            'crew' => [
                'name' => $this->crew_name,
                'id' => $this->crew_id,
            ],
            'createdAt' => $this->created_at?->toIso8601String(),
        ];
    }
}
