# LookupModal

A keyboard-driven, server-side searchable "picker" modal for jQuery + Bootstrap 4 + DataTables.

Common in ERP/accounting-style forms: press **F4** (or **Enter** on an empty field, or double-click) on an input to open a searchable, paginated list. Pick a row with **Enter** or **double-click**, and the target form fields fill in automatically. No more copy-pasting the same 80-100 lines of modal markup and DataTables init code into every page.

## Why

In a lot of internal business apps (invoicing, purchasing, payroll...), the same "search and pick a record" modal gets hand-written on every single form: customer picker, product picker, employee picker, etc. Each copy duplicates the modal HTML, the DataTables server-side config, and the row-selection wiring — with tiny inconsistencies creeping in over time.

LookupModal turns that into a few lines of config per usage.

## Requirements

- jQuery
- Bootstrap 4 (for the modal component)
- [DataTables](https://datatables.net/) (with server-side processing on your backend)
- Optional: [DataTables KeyTable extension](https://datatables.net/extensions/keytable/) — enables picking a row by pressing Enter, not just double-click

## Usage

```html
<script src="jquery.min.js"></script>
<script src="bootstrap.bundle.min.js"></script>
<script src="jquery.dataTables.min.js"></script>
<script src="dataTables.keyTable.min.js"></script> <!-- optional -->
<script src="lookup-modal.js"></script>

<input type="text" id="kode_customer" />
<input type="text" id="nama_customer" readonly />

<script>
new LookupModal({
  trigger: '#kode_customer',
  title: 'Cari Customer',
  ajax: {
    url: '/customer/ajax_list',
    type: 'POST',
  },
  columns: [
    { title: 'Kode', data: 'kode' },
    { title: 'Nama', data: 'nama' },
    { title: 'Alamat', data: 'alamat', visible: false },
  ],
  onSelect: function (row) {
    $('#kode_customer').val(row.kode);
    $('#nama_customer').val(row.nama);
  },
});
</script>
```

That's it — no modal HTML to write. LookupModal generates one automatically and cleans it up (destroys the DataTable instance) every time it closes, so multiple pickers can live on the same page without colliding.

### Using your own modal markup

If you already have a modal in your HTML (e.g. you're migrating an existing page), point `modal` at it instead of letting LookupModal generate one — it just needs a `<table>` inside:

```js
new LookupModal({
  trigger: '#kode_customer',
  modal: '#customerModal',
  ajax: { url: '/customer/ajax_list', type: 'POST' },
  columns: [...],
  onSelect: function (row) { ... },
});
```

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `trigger` | selector | *required* | Input that opens the modal on F4 / empty-Enter / double-click |
| `ajax` | object | *required* | Passed straight to DataTables' `ajax` option |
| `columns` | array | `[]` | Passed straight to DataTables' `columns` option |
| `title` | string | `"Cari Data"` | Modal title, used only when auto-generating the modal |
| `modal` | selector | `null` | Reuse an existing modal instead of generating one |
| `pageLength` | number | `15` | Rows per page |
| `shortcuts` | object | `{enter:true, f4:true, dblclick:true}` | Toggle individual open-shortcuts |
| `focusNext` | selector | `null` | Field to focus after picking a row (defaults to `trigger`) |
| `onSelect` | function | `function(){}` | Called with the selected row's data |

## Backend contract

LookupModal doesn't care what backend framework you use — it just needs a DataTables server-side processing endpoint (the same `draw`/`start`/`length`/`search` request shape DataTables always sends). If you're on CodeIgniter, any of the many `datatables server-side` helper libraries for CI will work as-is.

## License

MIT
