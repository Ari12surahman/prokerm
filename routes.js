
const express = require('express');
const router = express.Router();
const db = require('./database');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

router.get('/data', (req, res) => {
  db.all('SELECT * FROM program_kerja', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err });
    res.json(rows);
  });
});

router.post('/add', (req, res) => {
  const { divisi, kegiatan, tanggal, penanggung_jawab } = req.body;
  db.run(
    `INSERT INTO program_kerja (divisi, kegiatan, tanggal, penanggung_jawab) VALUES (?, ?, ?, ?)`,
    [divisi, kegiatan, tanggal, penanggung_jawab],
    function (err) {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, id: this.lastID });
    }
  );
});

router.get('/export/excel', async (req, res) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Program Kerja');

  worksheet.columns = [
    { header: 'Divisi', key: 'divisi' },
    { header: 'Kegiatan', key: 'kegiatan' },
    { header: 'Tanggal', key: 'tanggal' },
    { header: 'Penanggung Jawab', key: 'penanggung_jawab' },
  ];

  db.all('SELECT * FROM program_kerja', [], async (err, rows) => {
    if (err) return res.status(500).json({ error: err });

    rows.forEach(row => worksheet.addRow(row));

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=program_kerja.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  });
});

router.get('/export/pdf', (req, res) => {
  const doc = new PDFDocument();
  const filename = 'program_kerja.pdf';

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  doc.pipe(res);

  db.all('SELECT * FROM program_kerja', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err });

    doc.fontSize(18).text('Program Kerja Pesantren', { align: 'center' });
    doc.moveDown();

    rows.forEach(row => {
      doc.fontSize(12).text(`Divisi: ${row.divisi}`);
      doc.text(`Kegiatan: ${row.kegiatan}`);
      doc.text(`Tanggal: ${row.tanggal}`);
      doc.text(`Penanggung Jawab: ${row.penanggung_jawab}`);
      doc.moveDown();
    });

    doc.end();
  });
});

module.exports = router;
