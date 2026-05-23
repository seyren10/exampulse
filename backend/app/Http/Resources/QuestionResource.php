<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = parent::toArray($request);
        $data['options'] = OptionResource::collection($this->whenLoaded('options'));
        $data['image_path'] = $this->image_path ? Storage::disk('public')->url($this->image_path) : null;

        return $data;
    }
}
