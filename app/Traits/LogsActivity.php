<?php

namespace App\Traits;

use App\Models\ActivityLog;

trait LogsActivity
{
    protected static function bootLogsActivity()
    {
        static::created(function ($model) {
            $model->logActivity('created', [
                'attributes' => $model->attributesToArray(),
            ]);
        });

        static::updated(function ($model) {
            $model->logActivity('updated', [
                'old' => $model->getOriginal(),
                'attributes' => $model->getChanges(),
            ]);
        });

        static::deleted(function ($model) {
            $model->logActivity('deleted', [
                'attributes' => $model->attributesToArray(),
            ]);
        });
    }

    public function logActivity(string $description, array $properties = [])
    {
        ActivityLog::create([
            'log_name' => class_basename($this),
            'description' => $description,
            'subject_type' => get_class($this),
            'subject_id' => $this->id,
            'causer_type' => auth()->check() ? get_class(auth()->user()) : null,
            'causer_id' => auth()->id(),
            'properties' => $properties,
        ]);
    }

    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'subject')
            ->latest('created_at');
    }
}
