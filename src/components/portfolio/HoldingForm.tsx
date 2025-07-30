import React, { useState, useEffect } from 'react';
import { X, Save, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { UserHolding } from '../../types/stock';
import { CreateHoldingRequest, UpdateHoldingRequest } from '../../services/stockService';

interface HoldingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateHoldingRequest | UpdateHoldingRequest) => Promise<void>;
  editingHolding?: UserHolding | null;
  loading?: boolean;
}

export const HoldingForm: React.FC<HoldingFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingHolding,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    stock_code: '',
    quantity: '',
    value: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!editingHolding;

  useEffect(() => {
    if (isEditing && editingHolding) {
      setFormData({
        stock_code: editingHolding.stock_code,
        quantity: editingHolding.quantity.toString(),
        value: editingHolding.value.toString(),
      });
    } else {
      setFormData({
        stock_code: '',
        quantity: '',
        value: '',
      });
    }
    setErrors({});
  }, [isEditing, editingHolding, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isEditing && !formData.stock_code.trim()) {
      newErrors.stock_code = 'Mã cổ phiếu là bắt buộc';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Số lượng là bắt buộc';
    } else {
      const quantity = parseFloat(formData.quantity);
      if (isNaN(quantity) || quantity <= 0) {
        newErrors.quantity = 'Số lượng phải là số dương';
      }
    }

    if (!formData.value.trim()) {
      newErrors.value = 'Giá mua là bắt buộc';
    } else {
      const value = parseFloat(formData.value);
      if (isNaN(value) || value <= 0) {
        newErrors.value = 'Giá mua phải là số dương';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const submitData = isEditing
        ? {
            quantity: parseFloat(formData.quantity),
            value: parseFloat(formData.value),
          } as UpdateHoldingRequest
        : {
            stock_code: formData.stock_code.toUpperCase(),
            quantity: parseFloat(formData.quantity),
            value: parseFloat(formData.value),
          } as CreateHoldingRequest;

      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {isEditing ? 'Chỉnh Sửa Cổ Phiếu' : 'Thêm Cổ Phiếu Mới'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && (
            <Input
              label="Mã Cổ Phiếu"
              type="text"
              value={formData.stock_code}
              onChange={(e) => handleInputChange('stock_code', e.target.value)}
              placeholder="VD: VHM, PVD, VCB..."
              error={errors.stock_code}
              required
            />
          )}

          <Input
            label="Số Lượng"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', e.target.value)}
            placeholder="Nhập số lượng cổ phiếu"
            error={errors.quantity}
            min="1"
            step="1"
            required
          />

          <Input
            label="Giá Mua (nghìn VNĐ)"
            type="number"
            value={formData.value}
            onChange={(e) => handleInputChange('value', e.target.value)}
            placeholder="VD: 20.35 (tương đương 20,350 VNĐ)"
            error={errors.value}
            min="0"
            step="0.01"
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              loading={loading}
              className="flex-1 flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4" />
                  Cập Nhật
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Thêm Mới
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
