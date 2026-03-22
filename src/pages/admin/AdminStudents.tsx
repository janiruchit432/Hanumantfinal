import { useState } from 'react';
import { mockStudents } from '@/data/mockData';
import { Search, User, Phone, MapPin, BedDouble, Trash2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

const AdminStudents = () => {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState(mockStudents);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', roomNumber: '', mobile: '', parentMobile: '', address: '' });

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.roomNumber.includes(search)
  );

  const handleAdd = () => {
    if (!form.name || !form.roomNumber || !form.mobile) {
      toast.error('Please fill name, room number and mobile');
      return;
    }
    const newStudent = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      roomNumber: form.roomNumber,
      mobile: form.mobile,
      parentMobile: form.parentMobile,
      address: form.address,
      rentStatus: 'unpaid' as const,
      rentAmount: 5000,
    };
    setStudents((prev) => [...prev, newStudent]);
    setForm({ name: '', email: '', roomNumber: '', mobile: '', parentMobile: '', address: '' });
    setShowAddDialog(false);
    toast.success('Student added successfully');
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setStudents((prev) => prev.filter((s) => s.id !== deleteTarget));
    setDeleteTarget(null);
    toast.success('Student removed');
  };

  return (
    <div className="page-container">
      <div className="animate-fade-in flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Student Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{students.length} students registered</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} size="sm" className="rounded-xl gap-1.5">
          <Plus className="w-4 h-4" /> Add
        </Button>
      </div>

      <div className="relative mt-4 animate-slide-up">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search by name or room..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-xl h-11" />
      </div>

      <div className="mt-4 space-y-3">
        {filtered.map((s, i) => (
          <div key={s.id} className="glass-card rounded-2xl p-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  {s.name.charAt(0)}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-sm">{s.name}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BedDouble className="w-3 h-3" /> Room {s.roomNumber}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Phone className="w-3 h-3" /> {s.mobile}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" /> {s.address}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${s.rentStatus === 'paid' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                  {s.rentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                </span>
                <button
                  onClick={() => setDeleteTarget(s.id)}
                  className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No students found</p>
          </div>
        )}
      </div>

      {/* Add Student Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Fill in the student details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl" />
            <Input placeholder="Room Number *" value={form.roomNumber} onChange={(e) => setForm({ ...form, roomNumber: e.target.value })} className="rounded-xl" />
            <Input placeholder="Mobile *" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="rounded-xl" />
            <Input placeholder="Parent Mobile" value={form.parentMobile} onChange={(e) => setForm({ ...form, parentMobile: e.target.value })} className="rounded-xl" />
            <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-xl" />
            <Button onClick={handleAdd} className="w-full rounded-xl">Add Student</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Student?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The student will be removed from the list.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminStudents;
