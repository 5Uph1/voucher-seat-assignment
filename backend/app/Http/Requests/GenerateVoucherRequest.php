<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Contracts\Validation\Validator; 

class GenerateVoucherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'id' => ['required', 'string', 'max:50'],
            'flightNumber' => ['required', 'string', 'max:20'],
            'date' => ['required', 'date_format:Y-m-d'],
            'aircraft' => ['required', 'string', Rule::in(['ATR', 'Airbus 320', 'Boeing 737 Max'])],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Crew name is required.',
            'id.required' => 'Crew ID is required.',
            'flightNumber.required' => 'Flight number is required.',
            'date.required' => 'Flight date is required.',
            'date.date_format' => 'Flight date must be in YYYY-MM-DD format.',
            'aircraft.required' => 'Aircraft type is required.',
            'aircraft.in' => 'Aircraft type must be one of: ATR, Airbus 320, Boeing 737 Max.',
        ];
    }

    protected function failedValidation(Validator $validator): void
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation failed.',
            'errors' => $validator->errors(),
        ], 422));
    }
}
