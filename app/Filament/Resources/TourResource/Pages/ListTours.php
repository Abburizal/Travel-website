<?php

namespace App\Filament\Resources\TourResource\Pages;

use App\Filament\Resources\TourResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use App\Exports\ToursExport;
use Maatwebsite\Excel\Facades\Excel;
use Filament\Notifications\Notification;

class ListTours extends ListRecords
{
    protected static string $resource = TourResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Export Action
            Actions\Action::make('export')
                ->label('Export Tours')
                ->icon('heroicon-o-arrow-down-tray')
                ->color('success')
                ->form([
                    \Filament\Forms\Components\Select::make('format')
                        ->label('Export Format')
                        ->options([
                            'xlsx' => 'Excel (XLSX)',
                            'csv' => 'CSV',
                        ])
                        ->default('xlsx')
                        ->required(),
                    \Filament\Forms\Components\Select::make('category_id')
                        ->label('Filter by Category (Optional)')
                        ->relationship('category', 'name')
                        ->searchable()
                        ->preload(),
                ])
                ->action(function (array $data) {
                    $format = $data['format'] ?? 'xlsx';
                    $filters = [];
                    
                    if (!empty($data['category_id'])) {
                        $filters['category_id'] = $data['category_id'];
                    }
                    
                    $filename = 'tours_' . now()->format('Y-m-d_His') . '.' . $format;
                    
                    Notification::make()
                        ->title('Exporting tours...')
                        ->body('Your download will start shortly.')
                        ->success()
                        ->send();
                    
                    return Excel::download(
                        new ToursExport($filters),
                        $filename,
                        $format === 'csv' ? \Maatwebsite\Excel\Excel::CSV : \Maatwebsite\Excel\Excel::XLSX
                    );
                }),
            
            Actions\CreateAction::make(),
        ];
    }
}
