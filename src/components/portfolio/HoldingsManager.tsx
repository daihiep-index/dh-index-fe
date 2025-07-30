import React, { useState } from 'react';
import { Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { HoldingForm } from './HoldingForm';
import { StockService, CreateHoldingRequest, UpdateHoldingRequest } from '../../services/stockService';
import { UserHolding } from '../../types/stock';

interface HoldingsManagerProps {
  holdings: UserHolding[];
  onHoldingsChange: () => void;
  loading?: boolean;
}

export const HoldingsManager: React.FC<HoldingsManagerProps> = ({
  holdings,
  onHoldingsChange,
  loading = false,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHolding, setEditingHolding] = useState<UserHolding | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const stockService = StockService.getInstance();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1000); // Convert from thousands to actual VND
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const handleAddNew = () => {
    setEditingHolding(null);
    setIsFormOpen(true);
  };

  const handleEdit = (holding: UserHolding) => {
    setEditingHolding(holding);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateHoldingRequest | UpdateHoldingRequest) => {
    try {
      setFormLoading(true);
      
      if (editingHolding) {
        // Update existing holding
        await stockService.updateHolding(editingHolding.id, data as UpdateHoldingRequest);
      } else {
        // Create new holding
        await stockService.createHolding(data as CreateHoldingRequest);
      }
      
      onHoldingsChange();
      setIsFormOpen(false);
      setEditingHolding(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      throw error;
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(true);
      await stockService.deleteHolding(id);
      onHoldingsChange();
      setDeletingId(null);
    } catch (error) {
      console.error('Error deleting holding:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmDelete = (holding: UserHolding) => {
    setDeletingId(holding.id);
  };

  const cancelDelete = () => {
    setDeletingId(null);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Quản Lý Danh Mục</h3>
        <Button
          onClick={handleAddNew}
          className="flex items-center gap-2"
          size="sm"
          disabled={loading}
        >
          <Plus className="w-4 h-4" />
          Thêm Cổ Phiếu
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                  <div>
                    <div className="w-16 h-4 bg-slate-700 rounded mb-2"></div>
                    <div className="w-24 h-3 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-slate-700 rounded"></div>
                  <div className="w-8 h-8 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : holdings.length === 0 ? (
        <div className="text-center py-8">
          <Plus className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400 mb-4">Chưa có cổ phiếu nào trong danh mục</p>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Thêm Cổ Phiếu Đầu Tiên
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {holdings.map((holding) => (
            <div 
              key={holding.id} 
              className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:bg-slate-800/70 transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{holding.stock_code}</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{holding.stock_code}</h4>
                    <p className="text-slate-400 text-sm">
                      {formatNumber(holding.quantity)} cổ phiếu • {formatCurrency(holding.value)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(holding)}
                    className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmDelete(holding)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <HoldingForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingHolding(null);
        }}
        onSubmit={handleFormSubmit}
        editingHolding={editingHolding}
        loading={formLoading}
      />

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Xác Nhận Xóa</h3>
            </div>
            
            <p className="text-slate-400 mb-6">
              Bạn có chắc chắn muốn xóa cổ phiếu này khỏi danh mục? Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={cancelDelete}
                className="flex-1"
                disabled={deleteLoading}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={() => handleDelete(deletingId)}
                loading={deleteLoading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
