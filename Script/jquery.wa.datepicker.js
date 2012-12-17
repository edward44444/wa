/// <reference path="jquery.wa.core.js" />
$.wa.widget('datepicker', {
    options: {
        minDate: null,
        maxDate: null,
        selectedDate:new Date()
    },
    _create: function () {
        var me = this, datePicker, datePickerHtml = [],
            btnPrev, btnNext, selectYear, selectMonth, tbCalendar;
        me.guid=$.wa.guid++;
        me.element.bind('click.' + me.name, function () {
            me.showDatePicker();
        });
        datePicker = $('#wa-datepicker');
        if (datePicker.length == 0) {
            datePickerHtml.push('<div class="wa-datepicker" style="display:none;">');
            datePickerHtml.push('<div class="wa-header">');
            datePickerHtml.push('<a class="wa-prev"><</a>');
            datePickerHtml.push('<a class="wa-next">></a>');
            datePickerHtml.push('<div class="wa-title">');
            datePickerHtml.push('<select class="wa-select-year"></select>');
            datePickerHtml.push('<select class="wa-select-month"></select>');
            datePickerHtml.push('</div>');
            datePickerHtml.push('</div>');
            datePickerHtml.push('<table class="wa-calendar">');
            datePickerHtml.push('<thead><tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr></thead>');
            datePickerHtml.push('<tbody></tbody>');
            datePickerHtml.push('</table>');
            datePickerHtml.push('</div>');
            datePicker = $(datePickerHtml.join('')).appendTo(document.body);
            btnPrev = $('.wa-prev', datePicker);
            btnNext = $('.wa-next', datePicker);
            selectYear = $('.wa-select-year', datePicker);
            selectMonth = $('.wa-select-month', datePicker);
            tbCalendar = $('.wa-calendar', datePicker);
        }
        me.btnPrev = btnPrev;
        me.btnNext = btnNext;
        me.selectYear = selectYear;
        me.selectMonth = selectMonth.bind('change', function () {
            me.selectedDate.month = $(this).val() - 1;
            me.changeDate();
        });
        me.tbCalendar = tbCalendar;
        me.ui = {};
        me.ui.datePicker = datePicker;

    },
    showDatePicker: function () {
        var me = this, options=this.options,
            i, year, month, yearHtml, montHtml;
        // initial Year Begin
        year = options.selectedDate.getFullYear();
        yearHtml = [];
        for (i = year - 10; i <= year + 10; i++) {
            yearHtml.push('<option value="' + i + '">' + i + '</option>');
        }
        me.selectYear.append(yearHtml.join(''));
        me.selectYear.val(year);
        // initial Year End

        // initial Month Begin
        month = options.selectedDate.getMonth();
        montHtml = [];
        for (i = 1; i < 13; i++) {
            montHtml.push('<option value="' + i + '">' + i + '</option>');
        }
        me.selectMonth.append(montHtml.join(''));
        me.selectMonth.val(month + 1);

        // initial Month End

        me.selectedDate = {};
        me.selectedDate.year = year;
        me.selectedDate.month = month;
        me.changeDate();
        me.ui.datePicker.show();
    },
    changeDate: function () {
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
            dateHtml.push('<td><a>' + dateTime.getDate() + '</a></td>');
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