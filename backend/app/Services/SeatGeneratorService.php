<?php

namespace App\Services;

use InvalidArgumentException;

class SeatGeneratorService
{
    protected array $seatMaps = [
        'ATR' => [
            'rows' => 18,
            'letters' => ['A', 'C', 'D', 'F'],
        ],
        'Airbus 320' => [
            'rows' => 32,
            'letters' => ['A', 'B', 'C', 'D', 'E', 'F'],
        ],
        'Boeing 737 Max' => [
            'rows' => 32,
            'letters' => ['A', 'B', 'C', 'D', 'E', 'F'],
        ],
    ];

    public function supportedAircraftTypes(): array
    {
        return array_keys($this->seatMaps);
    }

    public function generate(string $aircraftType, int $count = 3): array
    {
        if (! isset($this->seatMaps[$aircraftType])) {
            throw new InvalidArgumentException("Unknown aircraft type: {$aircraftType}");
        }

        $map = $this->seatMaps[$aircraftType];
        $totalSeats = $map['rows'] * count($map['letters']);

        if ($count > $totalSeats) {
            throw new InvalidArgumentException(
                "Cannot generate {$count} unique seats for {$aircraftType} (only {$totalSeats} seats available)."
            );
        }

        $seats = [];

        while (count($seats) < $count) {
            $row = random_int(1, $map['rows']);
            $letter = $map['letters'][array_rand($map['letters'])];
            $seat = $row . $letter;

            // array_flip/isset gives us an O(1) uniqueness check.
            if (! in_array($seat, $seats, true)) {
                $seats[] = $seat;
            }
        }

        return $seats;
    }
}
