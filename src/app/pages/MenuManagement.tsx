import { useState } from 'react';
import { mockDishes, Dish } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Textarea } from '../components/ui/textarea';

export function MenuManagement() {
  const [dishes, setDishes] = useState<Dish[]>(mockDishes);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories = ['all', ...Array.from(new Set(dishes.map(d => d.category)))];

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || dish.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveDish = (dish: Dish) => {
    if (editingDish) {
      setDishes(dishes.map(d => d.id === dish.id ? dish : d));
    } else {
      setDishes([...dishes, { ...dish, id: `${dishes.length + 1}` }]);
    }
    setIsDialogOpen(false);
    setEditingDish(null);
  };

  const handleDeleteDish = (id: string) => {
    setDishes(dishes.filter(d => d.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl">Gestión de Menú</h1>
          <p className="text-sm md:text-base text-muted-foreground">Administra los platos del restaurante</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingDish(null)} className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Plato
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DishForm
              dish={editingDish}
              onSave={handleSaveDish}
              onCancel={() => {
                setIsDialogOpen(false);
                setEditingDish(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar platos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? 'Todas las categorías' : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Dishes Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDishes.map((dish) => (
          <Card key={dish.id}>
            <CardContent className="p-0">
              <div className="aspect-video w-full bg-muted relative overflow-hidden">
                <ImageWithFallback
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant={dish.available ? 'default' : 'secondary'}>
                    {dish.available ? 'Disponible' : 'No disponible'}
                  </Badge>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-medium">{dish.name}</h3>
                  <p className="text-sm text-muted-foreground">{dish.category}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{dish.description}</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">${dish.price.toFixed(2)}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingDish(dish);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeleteId(dish.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDishes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No se encontraron platos
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el plato permanentemente del menú.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && handleDeleteDish(deleteId)}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function DishForm({ dish, onSave, onCancel }: { dish: Dish | null; onSave: (dish: Dish) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Dish>(
    dish || {
      id: '',
      name: '',
      price: 0,
      category: '',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
      description: '',
      available: true
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{dish ? 'Editar Plato' : 'Agregar Nuevo Plato'}</DialogTitle>
        <DialogDescription>
          Completa los datos del plato
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">URL de imagen</Label>
          <Input
            id="image"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="available"
            checked={formData.available}
            onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
          />
          <Label htmlFor="available">Disponible</Label>
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {dish ? 'Guardar Cambios' : 'Agregar Plato'}
          </Button>
        </div>
      </form>
    </>
  );
}
