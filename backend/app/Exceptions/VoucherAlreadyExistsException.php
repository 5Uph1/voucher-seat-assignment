<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VoucherAlreadyExistsException extends Exception
{
    public function __construct(string $flightNumber, string $date)
    {
        parent::__construct("Vouchers have already been generated for flight {$flightNumber} on {$date}.");
    }

    /**
     * Render the exception as an HTTP response.
     */
    public function render(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $this->getMessage(),
        ], 409);
    }
}
