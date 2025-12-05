import { useEffect, useState } from 'react';
import { ShieldCheck, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { keysApi, doorsApi, permissionsApi } from '@/lib/api';

const Permissions = () => {
  const [keys, setKeys] = useState<any[]>([]);
  const [doors, setDoors] = useState<any[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [selectedDoors, setSelectedDoors] = useState<number[]>([]);
  const { toast } = useToast();

  // ✅ Load all keys & doors on page load
  useEffect(() => {
    const fetchData = async () => {
      const [keysRes, doorsRes] = await Promise.all([keysApi.getAll(), doorsApi.getAll()]);
      if (keysRes.data) setKeys(keysRes.data);
      if (doorsRes.data) setDoors(doorsRes.data);
    };
    fetchData();
  }, []);

  // ✅ Load current door permissions when a key is selected
  useEffect(() => {
    if (selectedKey) {
      const fetchPermissions = async () => {
        const { data } = await permissionsApi.getKeyPermissions(selectedKey);
        if (data) {
          // ✅ Fix: Use door_id (not doorId)
          setSelectedDoors(data.map((p: any) => p.door_id));
        }
      };
      fetchPermissions();
    }
  }, [selectedKey]);

  // ✅ Add or remove door from selected list
  const handleDoorToggle = (doorId: number) => {
    setSelectedDoors((prev) =>
      prev.includes(doorId) ? prev.filter((id) => id !== doorId) : [...prev, doorId]
    );
  };

  // ✅ Save permissions to backend
  const handleSave = async () => {
    if (!selectedKey) {
      toast({ title: 'Error', description: 'Please select a key', variant: 'destructive' });
      return;
    }

    const { error } = await permissionsApi.setKeyPermissions(selectedKey, selectedDoors);

    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Permissions updated successfully' });
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Permissions</h1>
        <p className="text-muted-foreground">Assign door access to keys</p>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Configure Access
          </CardTitle>
          <CardDescription>Select a key and grant access to specific doors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ✅ Select Key */}
          <div className="space-y-2">
            <Label>Select Key</Label>
            <Select value={selectedKey} onValueChange={setSelectedKey}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a key..." />
              </SelectTrigger>
              <SelectContent>
                {keys.map((key) => (
                  <SelectItem key={key.id} value={key.id}>
                    {key.owner} - {key.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ✅ Show doors only when a key is selected */}
          {selectedKey && (
            <>
              <div className="space-y-3">
                <Label className="text-base">Door Access</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  {doors.map((door) => (
                    <div
                      key={door.id}
                      className="flex items-center space-x-3 rounded-lg border border-border bg-card p-4"
                    >
                      <Checkbox
                        id={`door-${door.id}`}
                        checked={selectedDoors.includes(door.id)}
                        onCheckedChange={() => handleDoorToggle(door.id)}
                      />
                      <Label htmlFor={`door-${door.id}`} className="flex-1 cursor-pointer font-normal">
                        <div className="font-semibold">{door.name}</div>
                        <div className="text-xs text-muted-foreground">{door.location}</div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ Save Button */}
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Save Permissions
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Permissions;


// import { useEffect, useState } from 'react';
// import { ShieldCheck, Save } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useToast } from '@/hooks/use-toast';
// import { keysApi, doorsApi, permissionsApi } from '@/lib/api';

// const Permissions = () => {
//   const [keys, setKeys] = useState<any[]>([]);
//   const [doors, setDoors] = useState<any[]>([]);
//   const [selectedKey, setSelectedKey] = useState<string>('');
//   const [selectedDoors, setSelectedDoors] = useState<number[]>([]);
//   const [currentPermissions, setCurrentPermissions] = useState<any[]>([]);
//   const { toast } = useToast();

//   useEffect(() => {
//     const fetchData = async () => {
//       const [keysRes, doorsRes] = await Promise.all([
//         keysApi.getAll(),
//         doorsApi.getAll(),
//       ]);
//       if (keysRes.data) setKeys(keysRes.data);
//       if (doorsRes.data) setDoors(doorsRes.data);
//     };
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (selectedKey) {
//       const fetchPermissions = async () => {
//         const { data } = await permissionsApi.getKeyPermissions(selectedKey);
//         if (data) {
//           setCurrentPermissions(data);
//           setSelectedDoors(data.map((p: any) => p.doorId));
//         }
//       };
//       fetchPermissions();
//     }
//   }, [selectedKey]);

//   const handleDoorToggle = (doorId: number) => {
//     setSelectedDoors((prev) =>
//       prev.includes(doorId)
//         ? prev.filter((id) => id !== doorId)
//         : [...prev, doorId]
//     );
//   };

//   const handleSave = async () => {
//     if (!selectedKey) {
//       toast({ title: 'Error', description: 'Please select a key', variant: 'destructive' });
//       return;
//     }

//     const { error } = await permissionsApi.setKeyPermissions(
      
//       selectedKey,
//       selectedDoors,

//     );

//     if (error) {
//       toast({ title: 'Error', description: error, variant: 'destructive' });
//     } else {
//       toast({ title: 'Success', description: 'Permissions updated successfully' });
//     }
//   };

//   return (
//     <div className="space-y-6 p-8">
//       <div>
//         <h1 className="text-3xl font-bold text-foreground">Permissions</h1>
//         <p className="text-muted-foreground">Assign door access to keys</p>
//       </div>

//       <Card className="shadow-card">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <ShieldCheck className="h-5 w-5 text-primary" />
//             Configure Access
//           </CardTitle>
//           <CardDescription>Select a key and grant access to specific doors</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="space-y-2">
//             <Label>Select Key</Label>
//             <Select value={selectedKey} onValueChange={setSelectedKey}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Choose a key..." />
//               </SelectTrigger>
//               <SelectContent>
//                 {keys.map((key) => (
//                   <SelectItem key={key.id} value={key.id}>
//                     {key.owner} - {key.label}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {selectedKey && (
//             <>
//               <div className="space-y-3">
//                 <Label className="text-base">Door Access</Label>
//                 <div className="grid gap-3 md:grid-cols-2">
//                   {doors.map((door) => (
//                     <div
//                       key={door.id}
//                       className="flex items-center space-x-3 rounded-lg border border-border bg-card p-4"
//                     >
//                       <Checkbox
//                         id={`door-${door.id}`}
//                         checked={selectedDoors.includes(door.id)}
//                         onCheckedChange={() => handleDoorToggle(door.id)}
//                       />
//                       <Label
//                         htmlFor={`door-${door.id}`}
//                         className="flex-1 cursor-pointer font-normal"
//                       >
//                         <div className="font-semibold">{door.name}</div>
//                         <div className="text-xs text-muted-foreground">{door.location}</div>
//                       </Label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <Button onClick={handleSave} className="w-full">
//                 <Save className="mr-2 h-4 w-4" />
//                 Save Permissions
//               </Button>
//             </>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Permissions;
