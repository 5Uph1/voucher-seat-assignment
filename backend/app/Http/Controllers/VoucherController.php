<?php

namespace App\Http\Controllers;

use App\Exceptions\VoucherAlreadyExistsException;
use App\Http\Requests\CheckVoucherRequest;
use App\Http\Requests\GenerateVoucherRequest;
use App\Http\Resources\VoucherResource;
use App\Models\Voucher;
use App\Services\SeatGeneratorService;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;

class VoucherController extends Controller
{
    public function __construct(
        protected SeatGeneratorService $seatGenerator
    ) {
    }
    
    public function check(CheckVoucherRequest $request): JsonResponse
    {
        $exists = Voucher::forFlight(
            $request->input('flightNumber'),
            $request->input('date')
        )->exists();

        return response()->json([
            'exists' => $exists,
        ]);
    }

    public function generate(GenerateVoucherRequest $request): JsonResponse
    {
        $flightNumber = $request->input('flightNumber');
        $date = $request->input('date');

        if (Voucher::forFlight($flightNumber, $date)->exists()) {
            throw new VoucherAlreadyExistsException($flightNumber, $date);
        }

        $seats = $this->seatGenerator->generate($request->input('aircraft'), 3);

        try {
            $voucher = Voucher::create([
                'crew_name' => $request->input('name'),
                'crew_id' => $request->input('id'),
                'flight_number' => $flightNumber,
                'flight_date' => $date,
                'aircraft_type' => $request->input('aircraft'),
                'seat1' => $seats[0],
                'seat2' => $seats[1],
                'seat3' => $seats[2],
            ]);
        } catch (QueryException $e) {
            // Guards against a race condition between the exists() check above
            // and this insert, backed by the DB-level unique constraint.
            throw new VoucherAlreadyExistsException($flightNumber, $date);
        }

        // Response body matches the spec exactly: {"success": true, "seats": [...]}
        // while VoucherResource is available for richer/consistent formatting elsewhere.
        return response()->json([
            'success' => true,
            'seats' => $voucher->seatsArray(),
        ]);
    }
}
