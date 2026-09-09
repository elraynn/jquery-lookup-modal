/*!
 * LookupModal - keyboard-driven picker modal for jQuery + Bootstrap 4 + DataTables
 * MIT License
 */
(function ($) {
  "use strict";

  var instanceCounter = 0;

  function LookupModal(options) {
    this.options = $.extend(
      {
        trigger: null, // selector for the input that opens the modal
        modal: null, // selector for an existing modal; auto-generated if omitted
        title: "Cari Data",
        ajax: null, // DataTables ajax config (url, type, data, ...)
        columns: [], // DataTables column defs: [{ title, data, visible }]
        pageLength: 15,
        shortcuts: { enter: true, f4: true, dblclick: true },
        focusNext: null, // selector to focus after a row is picked; defaults back to trigger
        onSelect: function () {},
      },
      options
    );

    if (!this.options.trigger || !this.options.ajax) {
      throw new Error("LookupModal: 'trigger' and 'ajax' options are required");
    }

    instanceCounter += 1;
    this.id = "lookupModal" + instanceCounter;
    this.dataTable = null;

    this._ensureModal();
    this._bindTriggerShortcuts();
    this._bindModalEvents();
  }

  LookupModal.prototype._ensureModal = function () {
    var $existing = this.options.modal ? $(this.options.modal) : $();

    if ($existing.length) {
      this.$modal = $existing;
      this.$table = this.$modal.find("table").first();
      return;
    }

    var tableId = this.id + "Table";
    var html =
      '<div class="modal fade" id="' + this.id + '" data-backdrop="static" tabindex="-1" role="dialog" aria-hidden="true">' +
      '<div class="modal-dialog modal-lg modal-dialog-centered" role="document">' +
      '<div class="modal-content">' +
      '<div class="modal-header bg-primary">' +
      '<h5 class="modal-title text-white">' + this.options.title + "</h5>" +
      '<button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
      '<span aria-hidden="true" style="color:#fff">&times;</span></button>' +
      "</div>" +
      '<div class="modal-body">' +
      '<table id="' + tableId + '" class="table table-sm table-hover" style="width:100%"></table>' +
      "</div>" +
      '<div class="modal-footer">' +
      '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>' +
      "</div></div></div></div>";

    $(document.body).append(html);
    this.$modal = $("#" + this.id);
    this.$table = $("#" + tableId);
  };

  LookupModal.prototype._bindTriggerShortcuts = function () {
    var self = this;
    var s = this.options.shortcuts || {};
    var $trigger = $(document);

    if (s.enter !== false) {
      $trigger.on("keydown", this.options.trigger, function (e) {
        if (e.key === "Enter" && $(this).val() === "") {
          self.open();
        }
      });
    }
    if (s.f4 !== false) {
      $trigger.on("keydown", this.options.trigger, function (e) {
        if (e.key === "F4") {
          e.preventDefault();
          self.open();
        }
      });
    }
    if (s.dblclick !== false) {
      $trigger.on("dblclick", this.options.trigger, function () {
        self.open();
      });
    }
  };

  LookupModal.prototype._bindModalEvents = function () {
    var self = this;

    this.$modal.on("shown.bs.modal", function () {
      self._initTable();
      $("div.dataTables_filter input", self.$table.closest(".dataTables_wrapper")).focus();
    });

    this.$modal.on("hidden.bs.modal", function () {
      if (self.dataTable) {
        self.dataTable.destroy();
        self.dataTable = null;
        self.$table.empty();
      }
      var $next = self.options.focusNext ? $(self.options.focusNext) : $(self.options.trigger);
      $next.focus();
    });
  };

  LookupModal.prototype._initTable = function () {
    var self = this;

    this.dataTable = this.$table.DataTable({
      processing: true,
      serverSide: true,
      paging: true,
      lengthChange: false,
      pageLength: this.options.pageLength,
      scrollY: "400",
      scrollCollapse: true,
      ajax: this.options.ajax,
      columns: this.options.columns,
      keys: $.fn.dataTable.KeyTable ? { columns: [0] } : undefined,
    });

    this.dataTable.on("dblclick", "tbody tr", function () {
      self._pickRow(self.dataTable.row(this).data());
    });

    if ($.fn.dataTable.KeyTable) {
      this.dataTable.on("key", function (e, dt, key, cell) {
        if (key === 13) {
          self._pickRow(dt.row(cell.index().row).data());
        }
      });
    }
  };

  LookupModal.prototype._pickRow = function (rowData) {
    this.$modal.modal("hide");
    this.options.onSelect(rowData);
  };

  LookupModal.prototype.open = function () {
    this.$modal.modal("show");
  };

  LookupModal.prototype.close = function () {
    this.$modal.modal("hide");
  };

  window.LookupModal = LookupModal;
})(jQuery);
