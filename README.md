# LookupModal

[Live demo](https://elraynn.github.io/jquery-lookup-modal/) — click the field, press F4.

A keyboard-driven picker modal for jQuery + Bootstrap 4 + DataTables. Press F4 (or Enter on an empty field, or just double-click) on an input to open a searchable, paginated list. Pick a row with Enter or double-click and the form fields get filled in automatically.

If you've worked on internal business apps (invoicing, purchasing, payroll, etc) you've probably hand-written this same "search and pick a record" modal a dozen times: customer picker, product picker, employee picker... each one copying the same 80-100 lines of modal HTML and DataTables config, with small inconsistencies piling up every time. This plugin turns that into a few lines of config.

## Requirements

- jQuery
- Bootstrap 4 (for the modal)
- [DataTables](https://datatables.net/), server-side processing on your backend
- Optional: [KeyTable extension](https://datatables.net/extensions/keytable/), lets you pick a row with Enter instead of only double-click

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

No modal HTML to write yourself. LookupModal builds one on the fly and tears it down (destroys the DataTable instance) every time it closes, so you can have several pickers on the same page without them stepping on each other.

### Using your own modal markup

Migrating an existing page that already has a modal? Point `modal` at it instead of letting LookupModal generate one. It just needs a `<table>` inside:

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
| `trigger` | selector | required | Input that opens the modal on F4 / empty-Enter / double-click |
| `ajax` | object | required | Passed straight to DataTables' `ajax` option |
| `columns` | array | `[]` | Passed straight to DataTables' `columns` option |
| `title` | string | `"Cari Data"` | Modal title, only used when auto-generating the modal |
| `modal` | selector | `null` | Reuse an existing modal instead of generating one |
| `pageLength` | number | `15` | Rows per page |
| `shortcuts` | object | `{enter:true, f4:true, dblclick:true}` | Toggle individual open-shortcuts |
| `focusNext` | selector | `null` | Field to focus after picking a row (defaults to `trigger`) |
| `onSelect` | function | `function(){}` | Called with the selected row's data |

## Backend

Doesn't matter what you're running server-side, it just needs to speak the DataTables server-side processing protocol (the usual `draw`/`start`/`length`/`search` request). On CodeIgniter, any of the existing "datatables server-side" helper libraries work fine.

## License

MIT
