import { useEffect, useState } from 'react';
import { Plus, UserCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { usersApi } from '@/lib/api';

const Users = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', role: '' });
  const { toast } = useToast();

  const fetchUsers = async () => {
    const { data, error } = await usersApi.getAll();
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else if (data) {
      setUsers(data);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.username || !formData.password) {
      toast({ title: 'Error', description: 'Name, username, and password are required', variant: 'destructive' });
      return;
    }

    const { error } = await usersApi.create(formData);
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'User added successfully' });
      setIsDialogOpen(false);
      setFormData({ name: '', username: '', password: '', role: '' });
      fetchUsers();
    }
  };

  const handleDelete = async (userId: number) => {
    const { error } = await usersApi.delete(userId);
    if (error) {
      toast({ title: 'Error', description: error, variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'User deleted successfully' });
      fetchUsers();
    }
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header + Add User Dialog */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage user roles</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="admin or operator"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add User</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id} className="shadow-card transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
                    <UserCircle className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base">{user.name}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-muted/30 p-3 flex flex-col gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">Username</div>
                  <div className="text-sm font-semibold text-foreground">{user.username}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Role</div>
                    <div className="text-sm font-semibold capitalize text-foreground">{user.role}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(user.id)}
                  >
                    <Trash2 className="h-3 w-3" />
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

export default Users;


// import { useEffect, useState } from 'react';
// import { Plus, UserCircle, Trash2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { useToast } from '@/hooks/use-toast';
// import { usersApi } from '@/lib/api';

// const Users = () => {
//   const [users, setUsers] = useState<any[]>([]);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [formData, setFormData] = useState({ name: '', role: '' });
//   const { toast } = useToast();

//   const fetchUsers = async () => {
//     const { data, error } = await usersApi.getAll();
//     if (error) {
//       toast({ title: 'Error', description: error, variant: 'destructive' });
//     } else if (data) {
//       setUsers(data);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const { error } = await usersApi.create(formData);
//     if (error) {
//       toast({ title: 'Error', description: error, variant: 'destructive' });
//     } else {
//       toast({ title: 'Success', description: 'User added successfully' });
//       setIsDialogOpen(false);
//       setFormData({ name: '', role: '' });
//       fetchUsers();
//     }
//   };

//   const handleDelete = async (userId: number) => {
//     const { error } = await usersApi.delete(userId);
//     if (error) {
//       toast({ title: 'Error', description: error, variant: 'destructive' });
//     } else {
//       toast({ title: 'Success', description: 'User deleted successfully' });
//       fetchUsers();
//     }
//   };

//   return (
//     <div className="space-y-6 p-8">
//       {/* Header + Add User Dialog */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-foreground">Users</h1>
//           <p className="text-muted-foreground">Manage user roles</p>
//         </div>
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button>
//               <Plus className="mr-2 h-4 w-4" />
//               Add User
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>Create New User</DialogTitle>
//             </DialogHeader>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Name</Label>
//                 <Input
//                   id="name"
//                   placeholder="Enter name"
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="role">Role</Label>
//                 <Input
//                   id="role"
//                   placeholder="admin or operator"
//                   value={formData.role}
//                   onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                   required
//                 />
//               </div>
//               <Button type="submit" className="w-full">Add User</Button>
//             </form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       {/* User Cards */}
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {users.map((user) => (
//           <Card key={user.id} className="shadow-card transition-all hover:shadow-lg">
//             <CardHeader>
//               <div className="flex items-start justify-between">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary">
//                     <UserCircle className="h-6 w-6 text-white" />
//                   </div>
//                   <CardTitle className="text-base">{user.name}</CardTitle>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="rounded-lg bg-muted/30 p-3 flex justify-between items-center">
//                 <div>
//                   <div className="text-xs text-muted-foreground">Role</div>
//                   <div className="text-sm font-semibold capitalize text-foreground">{user.role}</div>
//                 </div>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={() => handleDelete(user.id)}
//                 >
//                   <Trash2 className="h-3 w-3" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Users;
