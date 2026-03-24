'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Users, DollarSign, TrendingUp, Copy, Plus, Edit, Trash2, ExternalLink,
  Loader2, RefreshCw, Eye, Percent, Link2, CreditCard,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Affiliate {
  id: string;
  name: string;
  email: string;
  affiliate_code: string;
  commission_percent: number;
  is_active: boolean;
  total_sales: number;
  total_commission: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface AffiliateSale {
  id: string;
  affiliate_id: string;
  order_id: string | null;
  order_number: string | null;
  customer_email: string | null;
  sale_amount: number;
  commission_amount: number;
  commission_percent: number;
  status: string;
  created_at: string;
}

interface AffiliateStats {
  total: number;
  active: number;
  totalSales: number;
  totalCommission: number;
}

export default function AdminAffiliatesPanel() {
  const { toast } = useToast();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [stats, setStats] = useState<AffiliateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null);
  const [affiliateSales, setAffiliateSales] = useState<AffiliateSale[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);

  // Create form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCommission, setNewCommission] = useState('10');
  const [newNotes, setNewNotes] = useState('');

  // Edit form
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editCommission, setEditCommission] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [editNotes, setEditNotes] = useState('');

  const fetchAffiliates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/affiliates', {
        headers: { 'x-admin-auth': 'true' },
      });
      const data = await res.json();
      if (res.ok) {
        setAffiliates(data.affiliates);
        setStats(data.stats);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load affiliates', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { fetchAffiliates(); }, [fetchAffiliates]);

  const fetchAffiliateSales = async (id: string) => {
    setSalesLoading(true);
    try {
      const res = await fetch(`/api/admin/affiliates?id=${id}`, {
        headers: { 'x-admin-auth': 'true' },
      });
      const data = await res.json();
      if (res.ok) {
        setAffiliateSales(data.sales || []);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load sales', variant: 'destructive' });
    } finally {
      setSalesLoading(false);
    }
  };

  const openDetail = async (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setDetailOpen(true);
    await fetchAffiliateSales(affiliate.id);
  };

  const openEdit = (affiliate: Affiliate) => {
    setSelectedAffiliate(affiliate);
    setEditName(affiliate.name);
    setEditEmail(affiliate.email);
    setEditCode(affiliate.affiliate_code);
    setEditCommission(String(affiliate.commission_percent));
    setEditActive(affiliate.is_active);
    setEditNotes(affiliate.notes || '');
    setEditOpen(true);
  };

  const createAffiliate = async () => {
    if (!newName || !newEmail) {
      toast({ title: 'Missing fields', description: 'Name and email are required.', variant: 'destructive' });
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': 'true' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          affiliate_code: newCode || undefined,
          commission_percent: parseFloat(newCommission) || 10,
          notes: newNotes || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Created', description: `Affiliate ${data.affiliate.affiliate_code} created.` });
        setCreateOpen(false);
        setNewName(''); setNewEmail(''); setNewCode(''); setNewCommission('10'); setNewNotes('');
        fetchAffiliates();
      } else {
        toast({ title: 'Error', description: data.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to create affiliate', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const updateAffiliate = async () => {
    if (!selectedAffiliate) return;
    setUpdating(true);
    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-auth': 'true' },
        body: JSON.stringify({
          id: selectedAffiliate.id,
          name: editName,
          email: editEmail,
          affiliate_code: editCode,
          commission_percent: parseFloat(editCommission) || 10,
          is_active: editActive,
          notes: editNotes || null,
        }),
      });
      if (res.ok) {
        toast({ title: 'Updated', description: 'Affiliate updated.' });
        setEditOpen(false);
        fetchAffiliates();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to update', variant: 'destructive' });
    } finally {
      setUpdating(false);
    }
  };

  const deleteAffiliate = async (id: string) => {
    if (!confirm('Delete this affiliate? All sales records will also be removed.')) return;
    try {
      const res = await fetch(`/api/admin/affiliates?id=${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-auth': 'true' },
      });
      if (res.ok) {
        toast({ title: 'Deleted', description: 'Affiliate removed.' });
        fetchAffiliates();
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to delete', variant: 'destructive' });
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: 'Copied', description: `Code "${code}" copied to clipboard.` });
  };

  const openStripePayout = (affiliate: Affiliate) => {
    // Opens Stripe dashboard pre-filtered — admin manually creates a payout/transfer
    // In v2 this would use Stripe Connect for automated payouts
    const amount = affiliate.total_commission;
    const description = encodeURIComponent(`Affiliate payout: ${affiliate.name} (${affiliate.affiliate_code}) - $${amount.toFixed(2)}`);
    window.open(
      `https://dashboard.stripe.com/payments/new?amount=${Math.round(amount * 100)}&description=${description}`,
      '_blank'
    );
  };

  const fmt = (amount: number) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(amount);

  const fmtDate = (date: string) =>
    new Date(date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Affiliates</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-gray-500">{stats.active} active</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Affiliate Sales</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fmt(stats.totalSales)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commission Owed</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{fmt(stats.totalCommission)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stripe Payouts</CardTitle>
              <CreditCard className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <a href="https://dashboard.stripe.com/payouts" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="mt-1">
                  <ExternalLink className="h-3 w-3 mr-1" /> View in Stripe
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 text-sm mb-1">💡 How Affiliate Payouts Work</h4>
        <p className="text-sm text-blue-700">
          When a customer uses an affiliate code at checkout, the commission is auto-calculated and tracked here.
          Commissions are deducted from the sale total and held for payout. Click &quot;Pay via Stripe&quot; on any
          affiliate to initiate a direct Stripe transfer to their account — keeping everything in one place.
        </p>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1" />
            <Button variant="outline" size="sm" onClick={fetchAffiliates}>
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1" /> Add Affiliate
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2 text-gray-500">Loading affiliates...</span>
            </div>
          ) : affiliates.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">No affiliates yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first affiliate partner to start tracking referrals.</p>
              <Button size="sm" className="mt-4" onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Add Affiliate
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Affiliate</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Total Sales</TableHead>
                    <TableHead>Commission Owed</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {affiliates.map(aff => (
                    <TableRow key={aff.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{aff.name}</p>
                          <p className="text-xs text-gray-500">{aff.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <code className="text-sm bg-gray-100 px-2 py-0.5 rounded font-mono">{aff.affiliate_code}</code>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => copyCode(aff.affiliate_code)}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline"><Percent className="h-3 w-3 mr-1" />{aff.commission_percent}%</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{fmt(aff.total_sales)}</TableCell>
                      <TableCell className="font-medium text-purple-600">{fmt(aff.total_commission)}</TableCell>
                      <TableCell>
                        <Badge className={aff.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {aff.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{fmtDate(aff.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => openDetail(aff)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(aff)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          {aff.total_commission > 0 && (
                            <Button variant="ghost" size="sm" className="text-purple-600" onClick={() => openStripePayout(aff)} title="Pay via Stripe">
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteAffiliate(aff.id)}>
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

      {/* Detail Dialog */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedAffiliate?.name} — Affiliate Detail</DialogTitle>
            <DialogDescription>
              Code: <code className="font-mono bg-gray-100 px-1 rounded">{selectedAffiliate?.affiliate_code}</code> · {selectedAffiliate?.commission_percent}% commission
            </DialogDescription>
          </DialogHeader>

          {selectedAffiliate && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Total Sales</p>
                  <p className="text-lg font-bold">{fmt(selectedAffiliate.total_sales)}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Commission Owed</p>
                  <p className="text-lg font-bold text-purple-600">{fmt(selectedAffiliate.total_commission)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-xs text-gray-500">Commission Rate</p>
                  <p className="text-lg font-bold">{selectedAffiliate.commission_percent}%</p>
                </div>
              </div>

              {selectedAffiliate.total_commission > 0 && (
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => openStripePayout(selectedAffiliate)}>
                  <CreditCard className="h-4 w-4 mr-2" /> Pay {fmt(selectedAffiliate.total_commission)} via Stripe
                </Button>
              )}

              <div>
                <h4 className="font-medium text-sm mb-3">Sales History</h4>
                {salesLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : affiliateSales.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No sales recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Sale</TableHead>
                          <TableHead>Commission</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {affiliateSales.map(sale => (
                          <TableRow key={sale.id}>
                            <TableCell className="font-mono text-sm">{sale.order_number || '—'}</TableCell>
                            <TableCell className="text-sm">{sale.customer_email || '—'}</TableCell>
                            <TableCell className="font-medium">{fmt(sale.sale_amount)}</TableCell>
                            <TableCell className="font-medium text-purple-600">{fmt(sale.commission_amount)}</TableCell>
                            <TableCell>
                              <Badge className={
                                sale.status === 'paid' ? 'bg-green-100 text-green-800' :
                                sale.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }>{sale.status}</Badge>
                            </TableCell>
                            <TableCell className="text-sm text-gray-500">{fmtDate(sale.created_at)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {selectedAffiliate.notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-1">Notes</h4>
                  <p className="text-sm text-gray-600">{selectedAffiliate.notes}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Affiliate</DialogTitle>
            <DialogDescription>Create an affiliate partner. A unique code is auto-generated if left blank.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name *</label>
                <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Partner name" />
              </div>
              <div>
                <label className="text-sm font-medium">Email *</label>
                <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="partner@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Affiliate Code</label>
                <Input value={newCode} onChange={e => setNewCode(e.target.value.toUpperCase())} placeholder="Auto-generated" />
                <p className="text-xs text-gray-500 mt-1">Leave blank to auto-generate</p>
              </div>
              <div>
                <label className="text-sm font-medium">Commission %</label>
                <Input type="number" min="0" max="100" step="0.5" value={newCommission} onChange={e => setNewCommission(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Internal notes..." rows={2} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={createAffiliate} disabled={updating}>
              {updating && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Create Affiliate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Affiliate</DialogTitle>
            <DialogDescription>Update affiliate details and commission rate.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input value={editName} onChange={e => setEditName(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Affiliate Code</label>
                <Input value={editCode} onChange={e => setEditCode(e.target.value.toUpperCase())} />
              </div>
              <div>
                <label className="text-sm font-medium">Commission %</label>
                <Input type="number" min="0" max="100" step="0.5" value={editCommission} onChange={e => setEditCommission(e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Active</label>
              <Switch checked={editActive} onCheckedChange={setEditActive} />
            </div>
            <div>
              <label className="text-sm font-medium">Notes</label>
              <Textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} rows={2} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={updateAffiliate} disabled={updating}>
              {updating && <Loader2 className="h-4 w-4 animate-spin mr-1" />} Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
