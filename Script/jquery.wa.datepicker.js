/// <reference path="jquery.wa.core.js" />
$.wa.widget('datepicker', {
    options: {
        minDate: null,
        maxDate: null,
        selectedDate:new Date()
    },
    _create: function () {
        var me = this, options = this.options,datePicker, datePickerHtml = [],
            btnPrev, btnNext, selectYear, selectMonth, tbCalendar;
        me.guid=$.wa.guid++;
        me.element.bind('click.' + me.name, function () {
            me.showDatePicker();
        });
        datePicker = $('#wa-datepicker');
        if (datePicker.length == 0) {
            datePickerHtml.push('<div class="wa-datepicker" style="display:none;">');
            datePickerHtml.push('<div class="wa-datepicker-header">');
            datePickerHtml.push('<a class="wa-datepicker-prev"><</a>');
            datePickerHtml.push('<a class="wa-datepicker-next">></a>');
            datePickerHtml.push('<div class="wa-datepicker-title">');
            datePickerHtml.push('<select class="wa-datepicker-select-year"></select>');
            datePickerHtml.push('<select class="wa-datepicker-select-month"></select>');
            datePickerHtml.push('</div>');
            datePickerHtml.push('</div>');
            datePickerHtml.push('<table class="wa-datepicker-calendar">');
            datePickerHtml.push('<thead><tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr></thead>');
            datePickerHtml.push('<tbody></tbody>');
            datePickerHtml.push('</table>');
            datePickerHtml.push('</div>');
            datePicker = $(datePickerHtml.join('')).appendTo(document.body);
            btnPrev = $('.wa-datepicker-prev', datePicker);
            btnNext = $('.wa-datepicker-next', datePicker);
            selectYear = $('.wa-datepicker-select-year', datePicker);
            selectMonth = $('.wa-datepicker-select-month', datePicker);
            tbCalendar = $('.wa-datepicker-calendar', datePicker);
        }
        me.btnPrev = btnPrev.bind('click', function () {
            me.selectedDate.month--;
            if (me.selectedDate.month < 0) {
                me.selectedDate.month = 11;
                me.selectedDate.year--;
                me.selectYear.val(me.selectedDate.year).trigger('change');
                return;
            }
            me.selectMonth.val(me.selectedDate.month + 1).trigger('change');
        });
        me.btnNext = btnNext.bind('click', function () {
            me.selectedDate.month++;
            if (me.selectedDate.month > 11) {
                me.selectedDate.month = 0;
                me.selectedDate.year++;
                me.selectYear.val(me.selectedDate.year).trigger('change');
                return;
            }
            me.selectMonth.val(me.selectedDate.month + 1).selectMonth.trigger('change');
        });
        me.selectYear = selectYear.bind('change', function () {
            me.selectedDate.year =parseInt($(this).val());
            me.changeYear();
        });
        me.selectMonth = selectMonth.bind('change', function () {
            me.selectedDate.month = parseInt($(this).val()) - 1;
            me.changeMonth();
        });
        me.selectedDate = {};
        me.selectedDate.year = options.selectedDate.getFullYear();
        me.selectedDate.month = options.selectedDate.getMonth();
        me.tbCalendar = tbCalendar;
        $(document).bind('click.' + me.name + me.guid, function (event) {
            if (jQuery.contains(datePicker.get(0), event.target) || event.target == datePicker.get(0)) {
                return;
            }
            if (jQuery.contains(me.element.get(0), event.target) || event.target == me.element.get(0)) {
                return;
            }
            me.hideDatePicker();
        });
        me.ui = {};
        me.ui.datePicker = datePicker;

    },
    showDatePicker: function () {
        if (this.ui.datePicker.is(':hidden')) {
            var me = this, options = this.options, selectedDate, offset, left, top;
            me.changeYear();
            offset = me.element.offset();
            left = offset.left;
            top = offset.top + me.element.outerHeight();
            me.ui.datePicker.css({
                'z-index': (4 + $.wa.overlayZindex)
            }).show().offset({
                left: left,
                top: top
            });
        }
    },
    hideDatePicker: function () {
        this.ui.datePicker.hide();
    },
    changeYear: function () {
        var me = this, options = this.options,
            i, year, month, yearHtml, montHtml;
        // initial Year Begin
        year = me.selectedDate.year;
        yearHtml = [];
        for (i = year - 10; i <= year + 10; i++) {
            yearHtml.push('<option value="' + i + '">' + i + '</option>');
        }
        me.selectYear.empty().append(yearHtml.join(''));
        me.selectYear.val(year);
        // initial Year End

        // initial Month Begin
        month = me.selectedDate.month;
        montHtml = [];
        for (i = 1; i < 13; i++) {
            montHtml.push('<option value="' + i + '">' + i + '</option>');
        }
        me.selectMonth.empty().append(montHtml.join(''));
        me.selectMonth.val(month + 1);
        // initial Month End
        me.selectMonth.trigger('change');
    },
    changeMonth: function () {
        var me = this, options = this.options,
            year=me.selectedDate.year, month=me.selectedDate.month,
            date = 1, i, dateTime, date, dateHtml;
        dateHtml = [];
        dateTime = new Date(year, month, date++);
        dateHtml.push('<tr>');
        for (i = 0; i < dateTime.getDay() ; i++) {
            dateHtml.push('<td>&nbsp;</td>');
        }
        i++;
        while (dateTime.getMonth() == month) {
            dateHtml.push('<td><a class="wa-datepicker-date' + (dateTime.getDay() == 0 || dateTime.getDay() == 6 ? ' wa-datepicker-weekend' : '') + (dateTime.getDay() == 0 || dateTime.getDay() == 6 ? ' wa-datepicker-weekend' : '') + '">' + dateTime.getDate() + '</a></td>');
            if (i % 7 == 0) {
                dateHtml.push('</tr><tr>');
            }
            dateTime = new Date(year, month, date++);
            i++;
        }
        if (i % 7 > 1) {
            for (var j = 7 - i % 7; j >= 0; j--) {
                dateHtml.push('<td>&nbsp;</td>');
            }
        }
        me.tbCalendar.find('tbody').empty().append(dateHtml.join(''));
    },
    destroy: function () {
    }
});