<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CheckVoucherRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'flightNumber' => ['required', 'string', 'max:20'],
            'date' => ['required', 'date_format:Y-m-d'],
        ];
    }

    public function messages(): array
    {
        return [
            'flightNumber.required' => 'Flight number is required.',
            'flightNumber.max' => 'Flight number may not be longer than 20 characters.',
            'date.required' => 'Flight date is required.',
            'date.date_format' => 'Flight date must be in YYYY-MM-DD format.',
        ];
    }
}
