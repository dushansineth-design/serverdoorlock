import { useEffect, useState } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { useToast } from '@/hooks/use-toast';
import { keysApi, usersApi } from '@/lib/api';

const Keys = () => {
  const [keys, setKeys] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ key_uid: '', user_id: '', label: '' });
  const { toast } = useToast();

  const fetchKeys = async () => {
    const { data } = await keysApi.getAll();
    if (data) setKeys(data);
  };

  const fetchUsers = async () => {
    const { data } = await usersApi.getAll();
    if (data) setUsers(data);
  };

  useEffect(() => {
    fetchKeys();
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let response;
    if (isEditMode && selectedKeyId) {
      response = await keysApi.update(selectedKeyId, formData);
    } else {
      response = await keysApi.create(formData);
    }
    if (response.error) {
      toast({ title: 'Error', description: response.error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: isEditMode ? 'Key updated' : 'Key created' });
      setIsDialogOpen(false);
      setIsEditMode(false);
      setSelectedKeyId(null);
      setFormData({ key_uid: '', user_id: '', label: '' });
      fetchKeys();
    }
  };

  const handleEdit = (key: any) => {
    setFormData({ key_uid: key.key_uid, user_id: key.user_id, label: key.label });
    setSelectedKeyId(key.id);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await keysApi.delete(id);
    if (!error) {
      toast({ title: 'Success', description: 'Key deleted' });
      fetchKeys();
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Keys</h1>
        {/* Always show "Register Key" button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setIsEditMode(false); setSelectedKeyId(null); setFormData({ key_uid: '', user_id: '', label: '' }); }}>
              <Plus className="mr-2" /> Register Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Key' : 'Register Key'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Key UID</Label>
                <Input
                  value={formData.key_uid}
                  onChange={(e) => setFormData({ ...formData, key_uid: e.target.value })}
                  required
                  disabled={isEditMode} // disable editing key UID when in edit mode
                />
              </div>
              <div>
                <Label>Owner</Label>
                <select
                  className="w-full border p-2"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  required
                >
                  <option value="">Select user</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
              <div>
                <Label>Label</Label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {isEditMode ? 'Save Changes' : 'Register'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {keys.map((key) => (
          <Card key={key.id}>
            <CardHeader className="flex justify-between">
              <div>
                <CardTitle>{key.owner || 'No Owner'}</CardTitle>
                <p className="text-sm text-muted">{key.label}</p>
              </div>
              <StatusBadge status={key.status} />
            </CardHeader>
            <CardContent>
              <p className="font-mono">{key.key_uid}</p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => handleEdit(key)}>
                  <Edit className="mr-1" /> Edit
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(key.id)}>
                  <Trash2 className="mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Keys;




// import { useEffect, useState } from 'react';
// import { Plus, Trash2, CreditCard, Edit } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { StatusBadge } from '@/components/StatusBadge';
// import { useToast } from '@/hooks/use-toast';
// import { keysApi, usersApi } from '@/lib/api';

// const Keys = () => {
//   const [keys, setKeys] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [selectedKeyId, setSelectedKeyId] = useState<string | null>(null);

//   // ✅ user_id instead of owner
//   const [formData, setFormData] = useState({ key_uid: '', user_id: '', label: '' });
//   const { toast } = useToast();

//   const fetchKeys = async () => {
//     const { data } = await keysApi.getAll();
//     if (data) setKeys(data);
//   };

//   const fetchUsers = async () => {
//     const { data } = await usersApi.getAll();
//     if (data) setUsers(data);
//   };

//   useEffect(() => {
//     fetchKeys();
//     fetchUsers();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     let response;
//     if (isEditMode && selectedKeyId) {
//       response = await keysApi.update(selectedKeyId, formData);
//     } else {
//       response = await keysApi.create(formData);
//     }
//     if (response.error) {
//       toast({ title: 'Error', description: response.error, variant: 'destructive' });
//     } else {
//       toast({ title: 'Success', description: isEditMode ? 'Key updated' : 'Key created' });
//       setIsDialogOpen(false);
//       setIsEditMode(false);
//       setSelectedKeyId(null);
//       setFormData({ key_uid: '', user_id: '', label: '' });
//       fetchKeys();
//     }
//   };

//   const handleEdit = (key: any) => {
//     setFormData({ key_uid: key.key_uid, user_id: key.user_id, label: key.label });
//     setSelectedKeyId(key.id);
//     setIsEditMode(true);
//     setIsDialogOpen(true);
//   };

//   const handleDelete = async (id: string) => {
//     const { error } = await keysApi.delete(id);
//     if (!error) {
//       toast({ title: 'Success', description: 'Key deleted' });
//       fetchKeys();
//     }
//   };

//   return (
//     <div className="space-y-6 p-8">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Keys</h1>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button><Plus className="mr-2" /> {isEditMode ? 'Edit Key' : 'Register Key'}</Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>{isEditMode ? 'Edit Key' : 'Register Key'}</DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <Label>Key UID</Label>
//                 <Input
//                   value={formData.key_uid}
//                   onChange={(e) => setFormData({ ...formData, key_uid: e.target.value })}
//                   required
//                   disabled={isEditMode}
//                 />
//               </div>
//               <div>
//                 <Label>Owner</Label>
//                 <select
//                   className="w-full border p-2"
//                   value={formData.user_id}
//                   onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
//                   required
//                 >
//                   <option value="">Select user</option>
//                   {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <Label>Label</Label>
//                 <Input
//                   value={formData.label}
//                   onChange={(e) => setFormData({ ...formData, label: e.target.value })}
//                 />
//               </div>
//               <Button type="submit" className="w-full">Save</Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {keys.map((key) => (
//           <Card key={key.id}>
//             <CardHeader className="flex justify-between">
//               <div>
//                 <CardTitle>{key.owner || 'No Owner'}</CardTitle>
//                 <p className="text-sm text-muted">{key.label}</p>
//               </div>
//               <StatusBadge status={key.status} />
//             </CardHeader>
//             <CardContent>
//               <p className="font-mono">{key.key_uid}</p>
//               <div className="flex gap-2 mt-3">
//                 <Button size="sm" variant="outline" onClick={() => handleEdit(key)}>
//                   <Edit className="mr-1" /> Edit
//                 </Button>
//                 <Button size="sm" variant="outline" onClick={() => handleDelete(key.id)}>
//                   <Trash2 className="mr-1" /> Delete
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Keys;



