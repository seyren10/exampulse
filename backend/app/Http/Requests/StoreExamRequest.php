<?php

namespace App\Http\Requests;

use App\Enums\ExamType;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreExamRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::enum(ExamType::class)],
            'time_limit' => ['nullable', 'integer', 'min:1'],
            'scheduled_at' => ['nullable', 'date'],
            'deadline' => ['nullable', 'date', 'after:scheduled_at'],
        ];
    }
}
