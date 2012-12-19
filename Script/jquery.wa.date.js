Date.wa = {};
Date.wa.format = function (date, format) {
    var yyyy, yy, MM, dd, HH, mm, ss, ms;
    yyyy = date.getFullYear().toString();
    yy = yyyy.substr(2);
    MM = date.getMonth() + 1;
    MM = MM > 9 ? MM : '0' + MM;
    dd = date.getDate();
    dd = dd > 9 ? dd : '0' + dd;
    HH = date.getHours();
    HH = HH > 9 ? HH : '0' + HH;
    mm = date.getMinutes();
    mm = mm > 9 ? mm : '0' + mm;
    ss = date.getSeconds();
    ss = ss > 9 ? ss : '0' + ss;
    ms = date.getMilliseconds();
    ms = ms > 99 ? ms : '0' + (ms > 9 ? ms : '0' + ms);
    return format.replace(/yyyy/g, yyyy).replace(/MM/g, MM).replace(/dd/g, dd).replace(/HH/g, HH).replace(/mm/g, mm).replace(/ss/g, ss).replace(/ms/g, ms);
}
Date.wa.parseExact = function (dateString, format) {
    var year = 0, month = 0, date = 1, hour = 0, minute = 0, second = 0, millisecond = 0,
        formatReg = /yyyy|MM|dd|HH|mm|ss|ms/g,
        formatMatches = format.match(formatReg),
        matches, index = 0;
    format = format.replace(/yyyy|yy/g, '(\\d{4})').replace(/MM|dd|HH|mm|ss/g, '(\\d{1,2})').replace(/ms/g, '(\\d{1,3})');
    matches = dateString.match(new RegExp(format));
    index = $.inArray('yyyy', formatMatches);
    if (index > -1) {
        year = parseInt(matches[index + 1]);
    }
    index = $.inArray('MM', formatMatches);
    if (index > -1) {
        month = parseInt(matches[index + 1]) - 1;
    }
    index = $.inArray('dd', formatMatches);
    if (index > -1) {
        date = parseInt(matches[index + 1]);
    }
    index = $.inArray('HH', formatMatches);
    if (index > -1) {
        hour = parseInt(matches[index + 1]);
    }
    index = $.inArray('mm', formatMatches);
    if (index > -1) {
        minute = parseInt(matches[index + 1]);
    }
    index = $.inArray('ss', formatMatches);
    if (index > -1) {
        second = parseInt(matches[index + 1]);
    }
    index = $.inArray('ms', formatMatches);
    if (index > -1) {
        millisecond = parseInt(matches[index + 1]);
    }
    return new Date(year, month, date, hour, minute, second, millisecond);
}