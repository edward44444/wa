/// <reference path="jquery.wa.date.js" />
/// <reference path="jquery.wa.core.js" />
$.wa.widget('datepicker', {
    options: {
        minDate: null,
        maxDate: null,
        selectedDate: null,
        dateFormat: 'yyyy-MM-dd',
        onSelect:null
    },
    _create: function () {
        var me = this, options = this.options, datePicker, datePickerHtml = [],
            btnPrev, btnNext, selectYear, selectMonth, tbCalendar, now;
        me.element.attr({
            'autocomplete': 'off',
            'readonly': 'true'
        }).val('');
        me.guid = $.wa.guid++;
        me.element.bind('click.' + me.name, function () {
            me.showDatePicker();
        });
        datePickerHtml.push('<div class="wa-datepicker" style="display:none;">');
        datePickerHtml.push('<div class="wa-datepicker-header">');
        datePickerHtml.push('<a class="wa-button wa-datepicker-prev"><</a>');
        datePickerHtml.push('<a class="wa-button wa-datepicker-next">></a>');
        datePickerHtml.push('<div class="wa-datepicker-title">');
        datePickerHtml.push('<select class="wa-datepicker-select-year"></select>');
        datePickerHtml.push('<select class="wa-datepicker-select-month"></select>');
        datePickerHtml.push('</div>');
        datePickerHtml.push('</div>');
        datePickerHtml.push('<table cellspacing="0" cellpadding="0" border="0"  class="wa-datepicker-calendar">');
        datePickerHtml.push('<thead class="wa-datepicker-week"><tr><th>Su</th><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th></tr></thead>');
        datePickerHtml.push('<tbody></tbody>');
        datePickerHtml.push('</table>');
        datePickerHtml.push('</div>');
        datePicker = $(datePickerHtml.join('')).disableSelection();
        btnPrev = $('.wa-datepicker-prev', datePicker);
        btnNext = $('.wa-datepicker-next', datePicker);
        selectYear = $('.wa-datepicker-select-year', datePicker);
        selectMonth = $('.wa-datepicker-select-month', datePicker);
        tbCalendar = $('.wa-datepicker-calendar', datePicker);
        me.btnPrev = btnPrev.bind('click', function () {
            var self = $(this);
            if (self.is('.wa-datepicker-nav-disbaled')) {
                return;
            }
            btnNext.removeClass('wa-datepicker-nav-disbaled');
            me.choosedDate.month--;
            if (me.choosedDate.month < 0) {
                me.choosedDate.month = 11;
                me.choosedDate.year--;
                me.selectYear.val(me.choosedDate.year).trigger('change');
            } else {
                me.selectMonth.val(me.choosedDate.month + 1).trigger('change');
            }
            if (options.minDate) {
                if (me.choosedDate.year == options.minDate.getFullYear() && me.choosedDate.month == options.minDate.getMonth()) {
                    self.addClass('wa-datepicker-nav-disbaled');
                }
            }
        });
        me.btnNext = btnNext.bind('click', function () {
            var self = $(this);
            if (self.is('.wa-datepicker-nav-disbaled')) {
                return;
            }
            btnPrev.removeClass('wa-datepicker-nav-disbaled');
            me.choosedDate.month++;
            if (me.choosedDate.month > 11) {
                me.choosedDate.month = 0;
                me.choosedDate.year++;
                me.selectYear.val(me.choosedDate.year).trigger('change');
            } else {
                me.selectMonth.val(me.choosedDate.month + 1).trigger('change');
            }
            if (options.maxDate) {
                if (me.choosedDate.year == options.maxDate.getFullYear() && me.choosedDate.month == options.maxDate.getMonth()) {
                    self.addClass('wa-datepicker-nav-disbaled');
                }
            }
        });
        me.selectYear = selectYear.bind('change', function () {
            me.choosedDate.year = parseInt($(this).val());
            me.changeYear();
        });
        me.selectMonth = selectMonth.bind('change', function () {
            me.choosedDate.month = parseInt($(this).val()) - 1;
            me.changeMonth();
        });
        now = new Date();
        if (options.selectedDate) {
            me.selectedDate = {
                year: options.selectedDate.getFullYear(),
                month: options.selectedDate.getMonth(),
                date: options.selectedDate.getDate()
            };
            me.choosedDate = {
                year: options.selectedDate.getFullYear(),
                month: options.selectedDate.getMonth(),
                date: options.selectedDate.getDate()
            };
        } else {
            me.selectedDate = {
                year: 0,
                month: 0,
                date: 0
            };
            me.choosedDate = {
                year: now.getFullYear(),
                month: now.getMonth(),
                date: now.getDate()
            };
        }
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
            var me = this, options = this.options, selectedDate, offset, left, top, value;
            if (!me.ui.datePicker.parent().length) {
                me.ui.datePicker.appendTo(document.body);
            }
            value=$.trim(me.element.val());
            if (value.length) {
                selectedDate = Date.wa.parseExact(value, options.dateFormat);
                me.selectedDate = {
                    year: selectedDate.getFullYear(),
                    month: selectedDate.getMonth(),
                    date: selectedDate.getDate()
                }
                me.choosedDate = {
                    year: selectedDate.getFullYear(),
                    month: selectedDate.getMonth(),
                    date: selectedDate.getDate()
                };
            }
            me.changeYear();
            offset = me.element.offset();
            left = offset.left;
            top = offset.top + me.element.outerHeight();
            if (top + me.ui.datePicker.outerHeight() > $(window).height()) {
                top = offset.top - me.ui.datePicker.outerHeight();
            }
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
        this.ui.datePicker.detach();
    },
    changeYear: function () {
        var me = this, options = this.options,
            i, year,minYear,maxYear, month,minMonth,maxMonth, yearHtml, montHtml;
        // initial Year Begin
        year = me.choosedDate.year;
        yearHtml = [];
        minYear = year - 10;
        maxYear = year + 10;
        if (options.minDate) {
            minYear = Math.max(minYear, options.minDate.getFullYear());
        }
        if (options.maxDate) {
            maxYear = Math.min(maxYear, options.maxDate.getFullYear());
        }
        for (i = minYear; i <= maxYear; i++) {
            
            yearHtml.push('<option value="' + i + '">' + i + '</option>');
        }
        me.selectYear.empty().append(yearHtml.join(''));
        me.selectYear.val(year);
        // initial Year End

        // initial Month Begin
        month = me.choosedDate.month;
        montHtml = [];
        minMonth = 1;
        maxMonth = 12;
        if (options.minDate) {
            if (year == options.minDate.getFullYear()) {
                minMonth = Math.max(options.minDate.getMonth() + 1, minMonth)
            }
        }
        if (options.maxDate) {
            if (year == options.maxDate.getFullYear()) {
                maxMonth = Math.min(options.maxDate.getMonth() + 1, maxMonth)
            }
        }
        for (i = minMonth; i <=maxMonth; i++) {
            montHtml.push('<option value="' + i + '">' + i + '</option>');
        }
        me.selectMonth.empty().append(montHtml.join(''));
        me.selectMonth.val(month + 1);
        // initial Month End
        me.selectMonth.trigger('change');
    },
    changeMonth: function () {
        var me = this, options = this.options,
            year = me.choosedDate.year, month = me.choosedDate.month,
            date = 1, i, dateTime,dateClass, dateHtml,now=new Date();
        dateHtml = [];
        dateTime = new Date(year, month, date++);
        dateHtml.push('<tr>');
        for (i = 0; i < dateTime.getDay() ; i++) {
            dateHtml.push('<td class="wa-datepicker-date-td">&nbsp;</td>');
        }
        i++;
        while (dateTime.getMonth() == month) {
            dateClass = 'wa-datepicker-date';
            disabled = '';
            dateClass += (dateTime.getDay() == 0 || dateTime.getDay() == 6 ? ' wa-datepicker-weekend' : '');
            dateClass += (dateTime.getFullYear() == now.getFullYear() && dateTime.getMonth() == now.getMonth() && dateTime.getDate() == now.getDate() ? ' wa-datepicker-now' : '');
            dateClass += (dateTime.getFullYear() == me.selectedDate.year && dateTime.getMonth() == me.selectedDate.month && dateTime.getDate() == me.selectedDate.date ? ' wa-datepicker-date-selected' : '');
            if (options.minDate) {
                if (dateTime < options.minDate) {
                    dateClass += ' wa-datepicker-date-disabled';
                }
            }
            if (options.maxDate) {
                if (dateTime > options.maxDate) {
                    dateClass += ' wa-datepicker-date-disabled';
                }
            }
            dateHtml.push('<td class="wa-datepicker-date-td"><a class="' + dateClass + '">' + dateTime.getDate() + '</a></td>');
            if (i % 7 == 0) {
                dateHtml.push('</tr><tr>');
            }
            dateTime = new Date(year, month, date++);
            i++;
        }
        if (i % 7 > 1) {
            for (var j = 7 - i % 7; j >= 0; j--) {
                dateHtml.push('<td class="wa-datepicker-date-td">&nbsp;</td>');
            }
        }
        me.tbCalendar.find('tbody').empty().append(dateHtml.join(''));
        me.tbCalendar.find('tbody .wa-datepicker-date:not(.wa-datepicker-date-disabled)').bind('click', function () {
            var selectedDate=new Date(me.choosedDate.year, me.choosedDate.month, parseInt($(this).text()));
            me.element.val(Date.wa.format(selectedDate, options.dateFormat));
            if ($.isFunction(options.onSelect)) {
                options.onSelect.call(me, selectedDate, me.ui);
            }
            me.hideDatePicker();
        }).hover(function () {
            $(this).addClass('wa-datepicker-date-hover');
        }, function () {
            $(this).removeClass('wa-datepicker-date-hover');
        });
        me.btnPrev.removeClass('wa-datepicker-nav-disbaled');
        me.btnNext.removeClass('wa-datepicker-nav-disbaled');
        if (options.minDate) {
            if (me.choosedDate.year == options.minDate.getFullYear() && me.choosedDate.month == options.minDate.getMonth()) {
                me.btnPrev.addClass('wa-datepicker-nav-disbaled');
            }
        }
        if (options.maxDate) {
            if (me.choosedDate.year == options.maxDate.getFullYear() && me.choosedDate.month == options.maxDate.getMonth()) {
                me.btnNext.addClass('wa-datepicker-nav-disbaled');
            }
        }
        // http: //jsfiddle.net/edward44444/v2NmD/1/
        if ($.browser.msie && $.browser.version >= 9) {
            me.ui.datePicker[0].style.display = '';
        }
    },
    destroy: function () {
        this.element.unbind('.' + this.name).removeAttr('readonly');
        $(document).unbind('click.' + this.name + this.guid);
        $.wa.base.prototype.destroy.call(this);
    }
});