-- =======================================================
-- SISTEM GUDANG KAIN - TRIGGERS & FUNCTIONS (MIGRATION 01)
-- =======================================================

-- FUNCTION: Process Stock Movement when Transaction Status changes to 'selesai' or 'dibatalkan'
CREATE OR REPLACE FUNCTION process_transaction_stock_movement()
RETURNS TRIGGER AS $$
DECLARE
  item RECORD;
  current_product RECORD;
  new_stok NUMERIC(12,2);
  v_allow_negative BOOLEAN;
  qty_delta NUMERIC(12,2);
BEGIN
  -- Get allow_negative_stock setting
  SELECT allow_negative_stock INTO v_allow_negative FROM business_info LIMIT 1;
  IF v_allow_negative IS NULL THEN
    v_allow_negative := FALSE;
  END IF;

  -- 1. Status Changed from Draft to Selesai
  IF (OLD.status = 'draft' AND NEW.status = 'selesai') THEN
    FOR item IN SELECT * FROM transaction_items WHERE transaction_id = NEW.id LOOP
      SELECT * INTO current_product FROM products WHERE id = item.product_id FOR UPDATE;

      -- Use qty_aktual if set and > 0, otherwise qty
      qty_delta := COALESCE(NULLIF(item.qty_aktual, 0), item.qty);

      IF NEW.tipe = 'masuk' THEN
        new_stok := current_product.stok_saat_ini + qty_delta;

        -- Record stock movement
        INSERT INTO stock_movements (
          product_id, transaction_id, tanggal, tipe, qty_masuk, qty_keluar,
          stok_sebelum, stok_sesudah, keterangan, created_by
        ) VALUES (
          item.product_id, NEW.id, NOW(), NEW.tipe, qty_delta, 0,
          current_product.stok_saat_ini, new_stok,
          COALESCE(NEW.keterangan, 'Barang Masuk ' || NEW.nomor_transaksi), NEW.created_by
        );

      ELSIF NEW.tipe = 'keluar' THEN
        IF (current_product.stok_saat_ini < qty_delta) AND NOT v_allow_negative THEN
          RAISE EXCEPTION 'Stok tidak mencukupi untuk kain % (SKU: %). Stok tersedia: %, Dibutuhkan: %',
            current_product.nama, current_product.sku, current_product.stok_saat_ini, qty_delta;
        END IF;

        new_stok := current_product.stok_saat_ini - qty_delta;

        -- Record stock movement
        INSERT INTO stock_movements (
          product_id, transaction_id, tanggal, tipe, qty_masuk, qty_keluar,
          stok_sebelum, stok_sesudah, keterangan, created_by
        ) VALUES (
          item.product_id, NEW.id, NOW(), NEW.tipe, 0, qty_delta,
          current_product.stok_saat_ini, new_stok,
          COALESCE(NEW.keterangan, 'Barang Keluar ' || NEW.nomor_transaksi), NEW.created_by
        );

      ELSIF NEW.tipe = 'penyesuaian' THEN
        -- In adjustment, qty represents the actual counted stock
        new_stok := qty_delta;
        IF new_stok < current_product.stok_saat_ini THEN
          INSERT INTO stock_movements (
            product_id, transaction_id, tanggal, tipe, qty_masuk, qty_keluar,
            stok_sebelum, stok_sesudah, keterangan, created_by
          ) VALUES (
            item.product_id, NEW.id, NOW(), NEW.tipe, 0, (current_product.stok_saat_ini - new_stok),
            current_product.stok_saat_ini, new_stok,
            COALESCE(NEW.keterangan, 'Penyesuaian Stok Opname (Berkurang)'), NEW.created_by
          );
        ELSE
          INSERT INTO stock_movements (
            product_id, transaction_id, tanggal, tipe, qty_masuk, qty_keluar,
            stok_sebelum, stok_sesudah, keterangan, created_by
          ) VALUES (
            item.product_id, NEW.id, NOW(), NEW.tipe, (new_stok - current_product.stok_saat_ini), 0,
            current_product.stok_saat_ini, new_stok,
            COALESCE(NEW.keterangan, 'Penyesuaian Stok Opname (Bertambah)'), NEW.created_by
          );
        END IF;
      END IF;

      -- Update product stock
      UPDATE products SET stok_saat_ini = new_stok, updated_at = NOW() WHERE id = item.product_id;
    END LOOP;
  END IF;

  -- 2. Status Changed to Dibatalkan (Reversal Movement)
  IF (OLD.status = 'selesai' AND NEW.status = 'dibatalkan') THEN
    FOR item IN SELECT * FROM transaction_items WHERE transaction_id = NEW.id LOOP
      SELECT * INTO current_product FROM products WHERE id = item.product_id FOR UPDATE;

      qty_delta := COALESCE(NULLIF(item.qty_aktual, 0), item.qty);

      IF NEW.tipe = 'masuk' THEN
        new_stok := current_product.stok_saat_ini - qty_delta;
        IF new_stok < 0 AND NOT v_allow_negative THEN
          RAISE EXCEPTION 'Pembatalan transaksi masuk gagal: stok % akan menjadi minus (%)', current_product.nama, new_stok;
        END IF;

        INSERT INTO stock_movements (
          product_id, transaction_id, tanggal, tipe, qty_masuk, qty_keluar,
          stok_sebelum, stok_sesudah, keterangan, created_by
        ) VALUES (
          item.product_id, NEW.id, NOW(), NEW.tipe, 0, qty_delta,
          current_product.stok_saat_ini, new_stok,
          'Pembatalan Transaksi Masuk ' || NEW.nomor_transaksi, NEW.created_by
        );

      ELSIF NEW.tipe = 'keluar' THEN
        new_stok := current_product.stok_saat_ini + qty_delta;

        INSERT INTO stock_movements (
          product_id, transaction_id, tanggal, tipe, qty_masuk, qty_keluar,
          stok_sebelum, stok_sesudah, keterangan, created_by
        ) VALUES (
          item.product_id, NEW.id, NOW(), NEW.tipe, qty_delta, 0,
          current_product.stok_saat_ini, new_stok,
          'Pembatalan Transaksi Keluar ' || NEW.nomor_transaksi, NEW.created_by
        );
      END IF;

      UPDATE products SET stok_saat_ini = new_stok, updated_at = NOW() WHERE id = item.product_id;
    END LOOP;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER ON TRANSACTIONS
DROP TRIGGER IF EXISTS trg_transaction_stock_movement ON transactions;
CREATE TRIGGER trg_transaction_stock_movement
  AFTER UPDATE OF status ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION process_transaction_stock_movement();
