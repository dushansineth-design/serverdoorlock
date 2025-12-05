
import { useEffect, useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { doorsApi, deviceApi } from '@/lib/api';
import { Switch } from '@/components/ui/switch';

const Doors = () => {
  const [doors, setDoors] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentDoorId, setCurrentDoorId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', location: '', deviceIP: '' });
  const { toast } = useToast();

  // Fetch doors from backend
  const fetchDoors = async () => {
    const { data, error } = await doorsApi.getAll();
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      setDoors(data || []);
    }
  };

  // Initial fetch + polling every 3 seconds
  useEffect(() => {
    fetchDoors();
    const interval = setInterval(fetchDoors, 10000); // poll every 3s
    return () => clearInterval(interval);
  }, []);

  const openAddDialog = () => {
    setIsEditMode(false);
    setCurrentDoorId(null);
    setFormData({ name: '', location: '', deviceIP: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (door: any) => {
    setIsEditMode(true);
    setCurrentDoorId(door.id);
    setFormData({ name: door.name, location: door.location, deviceIP: door.deviceIP });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && currentDoorId) {
      const { error } = await doorsApi.update(currentDoorId, formData);
      if (error) toast({ title: 'Error', description: error, variant: 'destructive' });
      else toast({ title: 'Success', description: 'Door updated successfully' });
    } else {
      const { error } = await doorsApi.create(formData);
      if (error) toast({ title: 'Error', description: error, variant: 'destructive' });
      else toast({ title: 'Success', description: 'Door added successfully' });
    }
    setIsDialogOpen(false);
    fetchDoors();
  };

  const handleDelete = async (id: string) => {
    const { error } = await doorsApi.delete(id);
    if (error) toast({ title: 'Error', description: error, variant: 'destructive' });
    else {
      toast({ title: 'Success', description: 'Door deleted successfully' });
      fetchDoors();
    }
  };

  // 🔥 Lock/Unlock toggle handler
  const handleLockToggle = async (door: any) => {
    const command = door.status === 'locked' ? 'unlock' : 'lock';

    const { error } = await deviceApi.sendCommand({
      door_id: door.id,
      command,
    });

    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Door ${command}ed successfully` });
      fetchDoors(); // immediately fetch to update toggle
    }
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Doors</h1>
          <p className="text-muted-foreground">Manage your access points</p>
        </div>
        <Button onClick={openAddDialog}>+ Add Door</Button>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Door' : 'Add New Door'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Door Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deviceIP">Device IP</Label>
              <Input
                id="deviceIP"
                value={formData.deviceIP}
                onChange={(e) => setFormData({ ...formData, deviceIP: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {isEditMode ? 'Update Door' : 'Add Door'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Doors List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doors.map((door) => (
          <Card key={door.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>{door.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{door.location}</p>
                </div>
                <StatusBadge status={door.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs">IP: {door.deviceIP}</p>
              <div className="flex items-center justify-between">
                {/* 🔄 Toggle reflects DB status */}
                <Switch
                  checked={door.status === 'unlocked'}
                  onCheckedChange={() => handleLockToggle(door)}
                />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(door)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(door.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Doors;



// import { useEffect, useState } from 'react';
// import { Trash2, Pencil } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
// import { StatusBadge } from '@/components/StatusBadge';
// import { useToast } from '@/hooks/use-toast';
// import { doorsApi, deviceApi } from '@/lib/api';
// import { Switch } from '@/components/ui/switch';

// const Doors = () => {
//   const [doors, setDoors] = useState<any[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentDoorId, setCurrentDoorId] = useState<string | null>(null);
//   const [formData, setFormData] = useState({ name: '', location: '', deviceIP: '' });
//   const { toast } = useToast();

//   const fetchDoors = async () => {
//     const { data, error } = await doorsApi.getAll();
//     if (error) {
//       toast({ title: 'Error', description: error, variant: 'destructive' });
//     } else {
//       setDoors(data || []);
//     }
//   };

//   useEffect(() => {
//     fetchDoors();
//   }, []);

//   const openAddDialog = () => {
//     setIsEditMode(false);
//     setCurrentDoorId(null);
//     setFormData({ name: '', location: '', deviceIP: '' });
//     setIsDialogOpen(true);
//   };

//   const openEditDialog = (door: any) => {
//     setIsEditMode(true);
//     setCurrentDoorId(door.id);
//     setFormData({ name: door.name, location: door.location, deviceIP: door.deviceIP });
//     setIsDialogOpen(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (isEditMode && currentDoorId) {
//       const { error } = await doorsApi.update(currentDoorId, formData);
//       if (error) {
//         toast({ title: 'Error', description: error, variant: 'destructive' });
//       } else {
//         toast({ title: 'Success', description: 'Door updated successfully' });
//       }
//     } else {
//       const { error } = await doorsApi.create(formData);
//       if (error) {
//         toast({ title: 'Error', description: error, variant: 'destructive' });
//       } else {
//         toast({ title: 'Success', description: 'Door added successfully' });
//       }
//     }
//     setIsDialogOpen(false);
//     fetchDoors();
//   };

//   const handleDelete = async (id: string) => {
//     const { error } = await doorsApi.delete(id);
//     if (error) {
//       toast({ title: 'Error', description: error, variant: 'destructive' });
//     } else {
//       toast({ title: 'Success', description: 'Door deleted successfully' });
//       fetchDoors();
//     }
//   };

//   // ----------------------------------------------------------
//   // 🔥 MAIN CHANGE: LOCK / UNLOCK toggle using backend endpoint
//   // ----------------------------------------------------------
//   const handleLockToggle = async (door: any) => {
//     const command = door.status === 'locked' ? 'unlock' : 'lock';

//     const { data, error } = await deviceApi.sendCommand({
//       door_id: door.id,
//       command,
//     });

//     if (error) {
//       toast({
//         title: 'Error',
//         description: error,
//         variant: 'destructive',
//       });
//     } else {
//       toast({
//         title: 'Success',
//         description: `Door ${command}ed successfully`,
//       });
//       fetchDoors();
//     }
//   };

//   return (
//     <div className="space-y-6 p-8">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Doors</h1>
//           <p className="text-muted-foreground">Manage your access points</p>
//         </div>
//         <Button onClick={openAddDialog}>+ Add Door</Button>
//       </div>

//       {/* Add/Edit Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{isEditMode ? 'Edit Door' : 'Add New Door'}</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Door Name</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="location">Location</Label>
//               <Input
//                 id="location"
//                 value={formData.location}
//                 onChange={(e) => setFormData({ ...formData, location: e.target.value })}
//                 required
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="deviceIP">Device IP</Label>
//               <Input
//                 id="deviceIP"
//                 value={formData.deviceIP}
//                 onChange={(e) => setFormData({ ...formData, deviceIP: e.target.value })}
//                 required
//               />
//             </div>
//             <Button type="submit" className="w-full">
//               {isEditMode ? 'Update Door' : 'Add Door'}
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>

//       {/* Doors List */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {doors.map((door) => (
//           <Card key={door.id}>
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div>
//                   <CardTitle>{door.name}</CardTitle>
//                   <p className="text-sm text-muted-foreground">{door.location}</p>
//                 </div>
//                 <StatusBadge status={door.status} />
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <p className="text-xs">IP: {door.deviceIP}</p>
//               <div className="flex items-center justify-between">
//                 <Switch
//                   checked={door.status === 'unlocked'}
//                   onCheckedChange={() => handleLockToggle(door)}
//                 />
//                 <div className="flex gap-2">
//                   <Button size="sm" variant="outline" onClick={() => openEditDialog(door)}>
//                     <Pencil className="h-4 w-4" />
//                   </Button>
//                   <Button size="sm" variant="outline" onClick={() => handleDelete(door.id)}>
//                     <Trash2 className="h-4 w-4" />
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Doors;


