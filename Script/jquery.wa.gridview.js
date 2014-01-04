/// <reference path="jquery-1.7.1.js" />
/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />

(function ($, undefined) {
    $.wa.widget('gridview', {
        options: {
            columns: [{ field: 'name', headText: '名称', width: 200, locked: true }],
            dataBind: function (event,entity) {
                return entity;
            },
            select: function (event,entity, index) {
            },
            pageIndexChange: function (event,pageIndex, pageSize) {
            },
            width: 900,
            height: 300,
            pageSize:20,
            allowPage:true
        },
        _create: function () {
            var me = this,options=me.options;
            me.element.addClass('wa-gridview').css({
                width: options.width + 'px',
                height: options.height + 'px'
            });
            me.element.on('mouseover', '.wa-gridview-body tr', function () {
                $(this).addClass('wa-gridview-tr-hover');
                $(this).data('sibling').addClass('wa-gridview-tr-hover');
            }).on('mouseout', '.wa-gridview-body tr', function () {
                $(this).removeClass('wa-gridview-tr-hover');
                $(this).data('sibling').removeClass('wa-gridview-tr-hover');
            }).on('click', '.wa-gridview-body tr', function (event) {
                var $this = $(this);
                var entity = $this.data('entity');
                var index = $this.data('index');
                if (me.selectedRow) {
                    me.selectedRow.add(me.selectedRow.data('sibling')).removeClass('wa-gridview-tr-selected');
                }
                me._trigger('select', event, entity, index);
                me.selectedEntity = entity;
                me.selectedIndex = index;
                me.selectedRow = $this;
                $this.add($this.data('sibling')).addClass('wa-gridview-tr-selected');
            });
            var lockedPanel = $('<div class="wa-gridview-panel"><div class="wa-gridview-head"></div><div class="wa-gridview-body wa-gridview-body-locked"><div class="wa-gridview-container"><table class="wa-gridview-table"><tbody></tbody></table></div></div></div>').appendTo(me.element);
            var scrollablePanel = $('<div class="wa-gridview-panel"><div class="wa-gridview-head wa-gridview-head-scrollable"></div><div class="wa-gridview-body wa-gridview-body-scrollable"><div class="wa-gridview-container"><table class="wa-gridview-table"><tbody></tbody></table></div></div></div>').appendTo(me.element);
            me.lockedHead = $('>.wa-gridview-head', lockedPanel);
            me.scrollableHead = $('>.wa-gridview-head', scrollablePanel);
            me.lockedBody = $('>.wa-gridview-body', lockedPanel);
            me.scrollableBody = $('>.wa-gridview-body', scrollablePanel);
            me.ui = {};
            me.ui.lockedPanel = lockedPanel.css({
                left: '0px'
            });
            me.ui.scrollablePanel = scrollablePanel;
            me.initHead(options.columns);
            var left = $('>.wa-gridview-table', me.lockedHead).outerWidth();
            scrollablePanel.css({
                left: left + 'px'
            });
            me.scrollableBody.scroll(function () {
                me.lockedBody.scrollLeft($(this).scrollLeft());
                me.lockedBody.scrollTop($(this).scrollTop());
                me.scrollableHead.scrollLeft($(this).scrollLeft());
            });
            me.element.bind('resize.'+me.name, function () {
                var height = me.element.height() - me.scrollableHead.outerHeight() - (me.ui.footer ? me.ui.footer.outerHeight() : 0);
                var width = me.element.width(), left = $('>.wa-gridview-container>.wa-gridview-table', me.lockedHead).outerWidth();
                me.scrollableBody.css({
                    height: height + 'px',
                    width: width-left
                });
                me.scrollableHead.css({
                    width: width - left
                });
                me.lockedBody.css({
                    height: height + 'px'
                });
            });
            me.element.trigger('resize.' + me.name);
            //me.bindData(options.data, options.pageIndex,options.recordCount); 
        },
        initFooter: function () {
            var me = this;
            var footer = $('<div class="wa-gridview-footer"></div>').appendTo(me.element);
            var html = [];
            html.push('<table class="wa-gridview-pager"><tr>');
            html.push('<td>每页</td><td><input type="text" value="0" class="wa-gridview-pagesize" /></td><td>条，共<span class="wa-gridview-recordcount">0</span>条</td>');
            html.push('<td><a class="wa-gridview-nav wa-gridview-nav-first">首页</a>');
            html.push('<a class="wa-gridview-nav wa-gridview-nav-pre">上一页</a>');
            html.push('</td><td><input type="text" value="0" class="wa-gridview-pageindex" /></td><td> / <span class="wa-gridview-pagecount">0</span>');
            html.push('<a class="wa-gridview-nav wa-gridview-nav-next">下一页</a>');
            html.push('<a class="wa-gridview-nav wa-gridview-nav-last">尾页</a>');
            html.push('<a class="wa-gridview-nav wa-gridview-nav-refresh">刷新</a></td>');
            html.push('</tr></table>');
            footer.append(html.join(''));
            me.ui.footer = footer;
            me.inputPageSize = $('.wa-gridview-pagesize', me.ui.footer);
            me.inputPageIndex = $('.wa-gridview-pageindex', me.ui.footer);
            me.navFist = $('.wa-gridview-nav-first', me.ui.footer).bind('click', function (event) {
                if ($(this).is('.wa-button-disabled')) {
                    return;
                }
                me.pageIndex = 1;
                me._trigger('pageIndexChange', event, 1, me.pageSize);
            });
            me.navPre = $('.wa-gridview-nav-pre', me.ui.footer).bind('click', function (event) {
                if ($(this).is('.wa-button-disabled')) {
                    return;
                }
                me.pageIndex -= 1;
                me._trigger('pageIndexChange', event, me.pageIndex, me.pageSize);
            });
            me.navNext = $('.wa-gridview-nav-next', me.ui.footer).bind('click', function (event) {
                if ($(this).is('.wa-button-disabled')) {
                    return;
                }
                me.pageIndex += 1;
                me._trigger('pageIndexChange', event, me.pageIndex, me.pageSize);
            });
            me.navLast = $('.wa-gridview-nav-last', me.ui.footer).bind('click', function (event) {
                if ($(this).is('.wa-button-disabled')) {
                    return;
                }
                me.pageIndex = me.pageCount;
                me._trigger('pageIndexChange', event, me.pageIndex, me.pageSize);
            });
            me.navRefresh = $('.wa-gridview-nav-refresh', me.ui.footer).bind('click', function (event) {
                me._trigger('pageIndexChange', event, me.pageIndex, me.pageSize);
            });
            me.labelRecordCount = $('.wa-gridview-recordcount', me.ui.footer);
            me.labelPageCount = $('.wa-gridview-pagecount', me.ui.footer);
        },
        initHead: function (columns) {
            var me = this, lockedColumns = [], scrollableColumns = [];
            for (var i = 0; i < columns.length; i++) {
                columns[i].index = i;
                if (columns[i].locked == true) {
                    lockedColumns.push(columns[i]);
                }
                else {
                    scrollableColumns.push(columns[i]);
                }
            }
            me._initHead(lockedColumns, me.lockedHead);
            me._initHead(scrollableColumns, me.scrollableHead);
            me.columns = columns;
        },
        _initHead: function (columns, head) {
            var html = [], me = this;
            html.push('<div class="wa-gridview-container"><table class="wa-gridview-table"><thead><tr>');
            for (var i = 0; i < columns.length; i++) {
                html.push('<td><div style="width:' + columns[i].width + 'px;">' + columns[i].headText + '</div></td>');
            }
            html.push('</tr></thead></table></div>')
            head.empty().html(html.join(''));
            var isLockedPanel = (head == me.lockedHead);
            $('td>div', head).each(function (index) {
                var $this = $(this);
                $this.data('index', index);
                $this.resizable({ helper: false, orient: 'e', controlArea: 4, minWidth: 10, container: me.element }).bind('resize', function () {
                    var relativeIndex = $this.data('index'), width = $this.width();
                    columns[relativeIndex].width = width;
                    if (isLockedPanel) {
                        $('td:nth-child(' + (relativeIndex + 1) + ')>div', me.lockedBody).width(width);
                        var left = $('>.wa-gridview-container>.wa-gridview-table', me.lockedHead).outerWidth();
                        width = me.element.width();
                        //if (left > width) {
                        //    return;
                        //}
                        me.ui.scrollablePanel.css({
                            left: left + 'px'
                        });
                        me.scrollableBody.css({
                            width: width - left
                        });
                        me.scrollableHead.css({
                            width: width - left
                        });
                    } else {
                        $('td:nth-child(' + (relativeIndex + 1) + ')>div', me.scrollableBody).width(width);
                    }
                });
            });
        },
        lock: function () {
            this.element.overlay();
        },
        unlock: function () {
            if (this.element.hasOverlay()) {
                this.element.overlay('destroy');
            }
        },
        resize: function (width, height) {
            var me = this;
            me.element.css({
                width: width + 'px',
                height: height + 'px'
            });
            me.element.triggerHandler('resize');
        },
        bindData: function (entityList,pageIndex,recordCount,pageSize) {
            var me = this;
            if (!me.initializedFooter && me.options.allowPage) {
                me.initFooter();
                me.element.trigger('resize.' + me.name);
                me.initializedFooter = true;
            }
            me.element.trigger('resize.' + me.name);
            var columns = me.columns,lockedTable = $('<table class="wa-gridview-table"></table>'), 
                scrollableTable = $('<table class="wa-gridview-table"></table>'), entity, lockedTr, scrollableTr, td;
            lockedTr = $('<tr class="wa-gridview-widthholder"></tr>');
            scrollableTr = $('<tr class="wa-gridview-widthholder"></tr>');

            for (var i = 0; i < entityList.length; i++) {
                lockedTr = $('<tr class="' + (i % 2 == 0 ? 'wa-gridview-tr-odd' : 'wa-gridview-tr-even') + '"></tr>');
                scrollableTr = $('<tr class="' + (i % 2 == 0 ? 'wa-gridview-tr-odd' : 'wa-gridview-tr-even') + '"></tr>');
                entity = me._trigger('dataBind', {}, entityList[i]);
                for (var j = 0; j < columns.length; j++) {
                    td = $('<td><div style="width:' + columns[j].width + 'px;"></div></td>');
                    if ($.isArray(entity)) {
                        $('div', td).append(entity[columns[j].index]);
                    } else {
                        $('div', td).append(entity[columns[j].field]);
                    }
                    if (columns[j].locked == true) {
                        lockedTr.append(td);
                    } else {
                        scrollableTr.append(td);
                    }
                }
                lockedTr.data('entity', entityList[i]).data('index', i);
                lockedTable.append(lockedTr);

                scrollableTr.data('entity', entityList[i]).data('index', i);
                scrollableTable.append(scrollableTr);

                lockedTr.data('sibling', scrollableTr);
                scrollableTr.data('sibling', lockedTr);
            }
            $('>.wa-gridview-container', me.lockedBody).empty().append(lockedTable);
            $('>.wa-gridview-container', me.scrollableBody).empty().append(scrollableTable);

            if (me.options.allowPage) {
                pageSize == pageSize || me.options.pageSize;
                var pageCount = (recordCount - recordCount % pageSize) / pageSize + 1;
                me.labelRecordCount.text(recordCount);
                me.labelPageCount.text(pageCount);
                me.inputPageSize.val(pageSize);
                me.inputPageIndex.val(pageIndex);
                me.pageIndex = pageIndex;
                me.pageSize = pageSize;
                me.pageCount = pageCount;
                if (pageIndex == 1) {
                    me.navFist.addClass('wa-button-disabled');
                    me.navPre.addClass('wa-button-disabled');
                }
                else {
                    me.navFist.removeClass('wa-button-disabled');
                    me.navPre.removeClass('wa-button-disabled');
                }
                if (pageIndex == pageCount) {
                    me.navLast.addClass('wa-button-disabled');
                    me.navNext.addClass('wa-button-disabled');
                } else {
                    me.navLast.removeClass('wa-button-disabled');
                    me.navNext.removeClass('wa-button-disabled');
                }
            }
            me.unlock();
        }
    });
})(jQuery);