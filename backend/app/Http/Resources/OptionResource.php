<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OptionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);

        /**
         * If the user is a student, we want to hide the 'is_correct' field from the response,
         *  as it should not be visible to students.
         */
        if ($request->user()->isStudent()) {
            unset($data['is_correct']);
        }

        return $data;
    }
}
