'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Star, Shield, MessageSquare, CheckCircle, XCircle, Clock, Loader2, RefreshCw,
  Eye, Edit, Trash2, Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Testimonial {
  id: string;
  name: string;
  email: string;
  product: string;
  rating: number;
  review: string;
  verified: boolean;
  status: string;
  stripe_order_id: string | null;
  order_number: string | null;
  admin_notes: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

interface TestimonialStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  verified: number;
}

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3 w-3" />,
  approved: <CheckCircle className="h-3 w-3" />,
  rejected: <XCircle className="h-3 w-3" />,
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function AdminTestimonialsPanel() {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [stats, setStats] = useState<TestimonialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Edit state
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);

  // Create state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newProduct, setNewProduct] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newReview, setNewReview] = useState('');
  const [newStatus, setNewStatus] = useState('approved');

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/testimonials?${params}`, {
        headers: { 'x-admin-auth': 'true' },
      });
      const data = await res.json();
      if (res.ok) {
        setTestimonials(data.testimonials);
        setStats(data.stats);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load testimonials', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, toast]);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const openDetail = (t: Testimonial) => {
    setSelectedTestimonial(t);
    setEditStatus(t.status);
    setEditNotes(t.admin_notes || '');
    setEditFeatured(t.featured);
    setDetailOpen(true);
  };

  const updateTestimonial = async () => {
    if (!selectedTestimonial) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': 'true' },
        body: JSON.stringify({
          id: selectedTestimonial.id,
          status: editStatus,
          admin_notes: editNotes || null,
          featured: editFeatured,
        }),
      });
      if (res.ok) {
        toast({ title: 'Updated', description: 'Testimonial updated successfully.' });
        setDetailOpen(false);
        fetchTestimonials();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const quickAction = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': 'true' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        toast({ title: status === 'approved' ? 'Approved' : 'Rejected', description: `Testimonial ${status}.` });
        fetchTestimonials();
      }
    } catch {
      toast({ title: 'Error', description: 'Action failed', variant: 'destructive' });
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial permanently?')) return;
    try {
      const res = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': 'true' },
      });
      if (res.ok) {
        toast({ title: 'Deleted', description: 'Testimonial deleted.' });
        fetchTestimonials();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const createTestimonial = async () => {
    if (!newName || !newEmail || !newProduct || !newReview) {
      toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': 'true' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          product: newProduct,
          rating: newRating,
          review: newReview,
          status: newStatus,
        }),
      });
      if (res.ok) {
        toast({ title: 'Created', description: 'Testimonial created. Purchase verification checked automatically.' });
        setCreateOpen(false);
        setNewName(''); setNewEmail(''); setNewProduct(''); setNewRating(5); setNewReview(''); setNewStatus('approved');
        fetchTestimonials();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to create', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const fmtDate = (date: string) =>
    new Date(date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-3 w-3 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-yellow-600">{stats.pending}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-green-600">{stats.approved}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-red-600">{stats.rejected}</div></CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold text-blue-600">{stats.verified}</div></CardContent>
          </Card>
        </div>
      )}

      {/* Actions Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1" />
            <Button variant="outline" size="sm" onClick={fetchTestimonials}>
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Testimonial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2 text-gray-500">Loading testimonials...</span>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No testimonials found</p>
              <p className="text-gray-400 text-sm mt-1">Testimonials will appear here when customers submit reviews.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Review</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testimonials.map(t => (
                    <TableRow key={t.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{t.name}</p>
                          <p className="text-xs text-gray-500">{t.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{t.product}</TableCell>
                      <TableCell>{renderStars(t.rating)}</TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm text-gray-600 truncate">{t.review}</p>
                      </TableCell>
                      <TableCell>
                        {t.verified ? (
                          <Badge className="bg-blue-100 text-blue-800"><Shield className="h-3 w-3 mr-1" />Verified</Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">Unverified</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[t.status] || 'bg-gray-100'}>
                          {statusIcons[t.status]} <span className="ml-1">{t.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{fmtDate(t.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {t.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800" onClick={() => quickAction(t.id, 'approved')}>
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => quickAction(t.id, 'rejected')}>
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => openDetail(t)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteTestimonial(t.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail/Edit Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review by {selectedTestimonial?.name}</DialogTitle>
            <DialogDescription>Submitted {selectedTestimonial ? fmtDate(selectedTestimonial.created_at) : ''}</DialogDescription>
          </DialogHeader>

          {selectedTestimonial && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{selectedTestimonial.name}</p>
                    <p className="text-sm text-gray-500">{selectedTestimonial.email}</p>
                  </div>
                  <div className="flex gap-2">
                    {selectedTestimonial.verified && (
                      <Badge className="bg-blue-100 text-blue-800"><Shield className="h-3 w-3 mr-1" />Verified Purchase</Badge>
                    )}
                    {selectedTestimonial.featured && (
                      <Badge className="bg-purple-100 text-purple-800">Featured</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">Product: <strong>{selectedTestimonial.product}</strong></p>
                {renderStars(selectedTestimonial.rating)}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Review</h4>
                <p className="text-sm text-gray-700">{selectedTestimonial.review}</p>
              </div>

              {selectedTestimonial.order_number && (
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <Shield className="h-4 w-4 inline mr-1 text-blue-600" />
                  Linked to order: <strong>{selectedTestimonial.order_number}</strong>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={editStatus} onValueChange={setEditStatus}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Featured on Homepage</label>
                  <Switch checked={editFeatured} onCheckedChange={setEditFeatured} />
                </div>
                <div>
                  <label className="text-sm font-medium">Admin Notes</label>
                  <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="Internal notes..." rows={3} />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Cancel</Button>
            <Button onClick={updateTestimonial} disabled={updating}>
              {updating && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Testimonial</DialogTitle>
            <DialogDescription>Manually add a testimonial. Purchase verification is automatic.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Customer name" />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="customer@email.com" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Product *</label>
              <Select value={newProduct} onValueChange={setNewProduct}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Total Essential">Total Essential</SelectItem>
                  <SelectItem value="Total Essential Plus">Total Essential Plus</SelectItem>
                  <SelectItem value="Both Products">Both Products</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <button key={i} type="button" onClick={() => setNewRating(i)}
                    className={`p-1 ${i <= newRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Review *</label>
              <Textarea value={newReview} onChange={e => setNewReview(e.target.value)} placeholder="Customer review text..." rows={4} />
            </div>
            <div>
              <label className="text-sm font-medium">Initial Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={createTestimonial} disabled={updating}>
              {updating && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Create Testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
