<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TourResource\Pages;
use App\Filament\Resources\TourResource\RelationManagers;
use App\Models\Tour;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class TourResource extends Resource
{
    protected static ?string $model = Tour::class;

    protected static ?string $navigationIcon = 'heroicon-o-map';
    
    protected static ?string $navigationLabel = 'Tours';
    
    protected static ?int $navigationSort = 1;
    
    protected static ?string $navigationGroup = 'Travel Management';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Tour Name')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Select::make('category_id')
                    ->label('Category')
                    ->relationship('category', 'name')
                    ->searchable()
                    ->preload()
                    ->createOptionForm([
                        Forms\Components\TextInput::make('name')
                            ->required()
                            ->maxLength(255),
                        Forms\Components\Textarea::make('description'),
                    ]),
                Forms\Components\Textarea::make('description')
                    ->label('Description')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('destination')
                    ->label('Destination')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('price')
                    ->label('Price')
                    ->required()
                    ->numeric()
                    ->prefix('Rp'),
                Forms\Components\TextInput::make('duration')
                    ->label('Duration (days)')
                    ->required()
                    ->numeric()
                    ->minValue(1),
                Forms\Components\FileUpload::make('image')
                    ->label('Tour Image')
                    ->image()
                    ->directory('tours')
                    ->maxSize(1024) // 1MB max
                    ->acceptedFileTypes(['image/jpeg', 'image/jpg', 'image/png'])
                    ->helperText('JPG or PNG - Max 1MB')
                    ->columnSpanFull(),
                SpatieMediaLibraryFileUpload::make('tour_images')
                    ->label('Tour Gallery')
                    ->collection('images')
                    ->multiple()
                    ->reorderable()
                    ->maxFiles(10)
                    ->image()
                    ->imageEditor()
                    ->maxSize(5120) // 5MB
                    ->helperText('Upload up to 10 images for gallery. Drag to reorder. Max 5MB per image.')
                    ->columnSpanFull(),
                SpatieMediaLibraryFileUpload::make('custom_itinerary')
                    ->label('Custom Itinerary PDF (Optional)')
                    ->collection('itinerary')
                    ->acceptedFileTypes(['application/pdf'])
                    ->maxSize(10240) // 10MB
                    ->downloadable()
                    ->openable()
                    ->helperText('Upload a custom PDF itinerary. If not uploaded, system will auto-generate one. Max 10MB.')
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('max_participants')
                    ->label('Max Participants')
                    ->required()
                    ->numeric()
                    ->minValue(1)
                    ->default(50),
                Forms\Components\TextInput::make('booked_participants')
                    ->label('Booked Participants')
                    ->numeric()
                    ->default(0)
                    ->disabled(),
                Forms\Components\DateTimePicker::make('start_date')
                    ->label('Start Date')
                    ->required(),
                Forms\Components\DateTimePicker::make('end_date')
                    ->label('End Date')
                    ->required()
                    ->after('start_date'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')
                    ->label('Image')
                    ->square(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Tour Name')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category.name')
                    ->label('Category')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('destination')
                    ->label('Destination')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->money('IDR')
                    ->sortable(),
                Tables\Columns\TextColumn::make('duration')
                    ->label('Duration')
                    ->suffix(' days')
                    ->sortable(),
                Tables\Columns\TextColumn::make('max_participants')
                    ->label('Capacity')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('booked_participants')
                    ->label('Booked')
                    ->numeric()
                    ->sortable()
                    ->toggleable(),
                Tables\Columns\TextColumn::make('available_seats')
                    ->label('Available')
                    ->getStateUsing(fn ($record) => $record->available_seats)
                    ->badge()
                    ->color(fn ($state) => $state > 10 ? 'success' : ($state > 0 ? 'warning' : 'danger')),
                Tables\Columns\IconColumn::make('has_custom_itinerary')
                    ->label('Custom PDF')
                    ->getStateUsing(fn ($record) => $record->hasMedia('itinerary'))
                    ->boolean()
                    ->trueIcon('heroicon-o-document-check')
                    ->falseIcon('heroicon-o-document')
                    ->trueColor('success')
                    ->falseColor('gray')
                    ->tooltip(fn ($record) => $record->hasMedia('itinerary') ? 'Custom PDF uploaded' : 'Auto-generated PDF')
                    ->toggleable(),
                Tables\Columns\TextColumn::make('start_date')
                    ->label('Start Date')
                    ->date('d M Y')
                    ->sortable(),
                Tables\Columns\TextColumn::make('end_date')
                    ->label('End Date')
                    ->date('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                // Category Filter
                Tables\Filters\SelectFilter::make('category')
                    ->relationship('category', 'name')
                    ->multiple()
                    ->preload(),
                
                // Price Range Filter
                Tables\Filters\Filter::make('price_range')
                    ->form([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('price_from')
                                    ->label('Min Price')
                                    ->numeric()
                                    ->prefix('Rp'),
                                Forms\Components\TextInput::make('price_to')
                                    ->label('Max Price')
                                    ->numeric()
                                    ->prefix('Rp'),
                            ]),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['price_from'],
                                fn (Builder $query, $price): Builder => $query->where('price', '>=', $price),
                            )
                            ->when(
                                $data['price_to'],
                                fn (Builder $query, $price): Builder => $query->where('price', '<=', $price),
                            );
                    })
                    ->indicateUsing(function (array $data): ?string {
                        if (! $data['price_from'] && ! $data['price_to']) {
                            return null;
                        }
                        
                        if ($data['price_from'] && $data['price_to']) {
                            return 'Price: Rp ' . number_format($data['price_from']) . ' - Rp ' . number_format($data['price_to']);
                        }
                        
                        if ($data['price_from']) {
                            return 'Price from: Rp ' . number_format($data['price_from']);
                        }
                        
                        return 'Price up to: Rp ' . number_format($data['price_to']);
                    }),
                
                // Date Range Filter
                Tables\Filters\Filter::make('date_range')
                    ->form([
                        Forms\Components\DatePicker::make('start_from')
                            ->label('Starts From'),
                        Forms\Components\DatePicker::make('start_until')
                            ->label('Starts Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['start_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('start_date', '>=', $date),
                            )
                            ->when(
                                $data['start_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('start_date', '<=', $date),
                            );
                    })
                    ->indicateUsing(function (array $data): ?string {
                        if (! $data['start_from'] && ! $data['start_until']) {
                            return null;
                        }
                        
                        if ($data['start_from'] && $data['start_until']) {
                            return 'Starts: ' . \Carbon\Carbon::parse($data['start_from'])->format('d M Y') . ' - ' . \Carbon\Carbon::parse($data['start_until'])->format('d M Y');
                        }
                        
                        if ($data['start_from']) {
                            return 'Starts from: ' . \Carbon\Carbon::parse($data['start_from'])->format('d M Y');
                        }
                        
                        return 'Starts until: ' . \Carbon\Carbon::parse($data['start_until'])->format('d M Y');
                    }),
                
                // Availability Filter
                Tables\Filters\Filter::make('availability')
                    ->label('Availability')
                    ->toggle()
                    ->query(fn (Builder $query): Builder => 
                        $query->whereColumn('booked_participants', '<', 'max_participants')
                    ),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    // Delete
                    Tables\Actions\DeleteBulkAction::make(),
                    
                    // Bulk Update Price
                    Tables\Actions\BulkAction::make('updatePrice')
                        ->label('Update Price')
                        ->icon('heroicon-o-currency-dollar')
                        ->color('warning')
                        ->form([
                            Forms\Components\Select::make('operation')
                                ->label('Operation')
                                ->options([
                                    'set' => 'Set Fixed Price',
                                    'increase' => 'Increase by %',
                                    'decrease' => 'Decrease by %',
                                ])
                                ->required()
                                ->live(),
                            Forms\Components\TextInput::make('value')
                                ->label(fn ($get) => match($get('operation')) {
                                    'set' => 'New Price (IDR)',
                                    'increase' => 'Increase by (%)',
                                    'decrease' => 'Decrease by (%)',
                                    default => 'Value'
                                })
                                ->numeric()
                                ->required()
                                ->minValue(0),
                        ])
                        ->action(function ($records, $data) {
                            foreach ($records as $record) {
                                $newPrice = match($data['operation']) {
                                    'set' => $data['value'],
                                    'increase' => $record->price * (1 + $data['value'] / 100),
                                    'decrease' => $record->price * (1 - $data['value'] / 100),
                                };
                                $record->update(['price' => max(0, $newPrice)]);
                            }
                        })
                        ->deselectRecordsAfterCompletion()
                        ->successNotification(
                            \Filament\Notifications\Notification::make()
                                ->success()
                                ->title('Prices updated successfully')
                        ),
                    
                    // Bulk Update Category
                    Tables\Actions\BulkAction::make('updateCategory')
                        ->label('Change Category')
                        ->icon('heroicon-o-tag')
                        ->color('info')
                        ->form([
                            Forms\Components\Select::make('category_id')
                                ->label('New Category')
                                ->relationship('category', 'name')
                                ->searchable()
                                ->required(),
                        ])
                        ->action(fn ($records, $data) => 
                            $records->each->update(['category_id' => $data['category_id']])
                        )
                        ->deselectRecordsAfterCompletion()
                        ->successNotification(
                            \Filament\Notifications\Notification::make()
                                ->success()
                                ->title('Category updated successfully')
                        ),
                    
                    // Bulk Export to CSV
                    Tables\Actions\BulkAction::make('export')
                        ->label('Export to CSV')
                        ->icon('heroicon-o-arrow-down-tray')
                        ->color('success')
                        ->action(function ($records) {
                            $filename = 'tours_export_' . now()->format('Y-m-d_His') . '.csv';
                            $headers = [
                                'Content-Type' => 'text/csv',
                                'Content-Disposition' => "attachment; filename=\"$filename\"",
                            ];
                            
                            $callback = function() use ($records) {
                                $file = fopen('php://output', 'w');
                                
                                // Headers
                                fputcsv($file, [
                                    'ID', 'Name', 'Category', 'Destination', 'Price', 
                                    'Duration', 'Max Participants', 'Booked', 'Start Date', 'End Date'
                                ]);
                                
                                // Data
                                foreach ($records as $tour) {
                                    fputcsv($file, [
                                        $tour->id,
                                        $tour->name,
                                        $tour->category?->name ?? '',
                                        $tour->destination,
                                        $tour->price,
                                        $tour->duration,
                                        $tour->max_participants,
                                        $tour->booked_participants,
                                        $tour->start_date?->format('Y-m-d'),
                                        $tour->end_date?->format('Y-m-d'),
                                    ]);
                                }
                                
                                fclose($file);
                            };
                            
                            return response()->stream($callback, 200, $headers);
                        })
                        ->deselectRecordsAfterCompletion(),
                ]),
            ])
            ->defaultSort('start_date', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListTours::route('/'),
            'create' => Pages\CreateTour::route('/create'),
            'view' => Pages\ViewTour::route('/{record}'),
            'edit' => Pages\EditTour::route('/{record}/edit'),
        ];
    }
}
