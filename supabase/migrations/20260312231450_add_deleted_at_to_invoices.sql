-- Thêm cột deleted_at cho bảng invoices để hỗ trợ soft delete
ALTER TABLE PUBLIC.invoices ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
