<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuestionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     * Converts string booleans from multipart/form-data to actual booleans.
     */
    protected function prepareForValidation(): void
    {
        if (!$this->has('options')) {
            return;
        }

        $this->merge([
            'options' => collect($this->input('options'))
                ->map(fn(array $option) => [
                    ...$option,
                    'is_correct' => $this->castToBoolean($option['is_correct'] ?? null),
                ])
                ->all(),
        ]);
    }

    /**
     * Cast a value to boolean, handling string representations from form data.
     */
    private function castToBoolean(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN) === true;
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'question_text' => ['required', 'string'],
            'image' => ['nullable', Rule::imageFile()->max(2048)], // Max 2MB
            'points' => ['nullable', 'integer', 'min:1'],
            'order' => ['nullable', 'integer'],
            'options' => ['required', 'array', 'min:2'],
            'options.*.option_text' => ['required', 'string'],
            'options.*.is_correct' => ['required', 'boolean'],
            'options.*.order' => ['nullable', 'integer'],
        ];
    }
}
