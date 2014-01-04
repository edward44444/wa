/// <reference path="jquery.wa.core.js" />
/// <reference path="jquery.wa.widget.js" />

(function ($, undefined) {
    $.wa.widget('dropdownlist', {
        options: {
            dataSource: [],
            tpl: '{text}',
            mutil: false,
            contentWidth: null,
            contentHeight: null,
            contentMinHeight: null,
            readonly: true,
            search: false
        },
        _create: function () {
            var me = this, options = this.options, listItems, items,positionIndicator,
                itemsHtml = [], buttonArrowDown, wrap, input, width, height;
            width = me.element.outerWidth();
            height = me.element.outerHeight();
            positionIndicator = $('<div class="wa-position-indicator"></div>').insertAfter(me.element);
            wrap = $('<div class="wa-dropdownlist"></div>')
                .css({
                    position: 'absolute',
                    width: width + 'px'
                })
                .appendTo(positionIndicator)
                .bind('click', function (event) {
                    me.toggleListItems();
                }).offset({
                    left: me.element.offset().left,
                    top: me.element.offset().top-1
                });
            input = me.element.clone().removeAttr('id').appendTo(wrap).addClass('wa-dropdownlist-input');
            me.element.addClass('wa-invisible');
            if (options.readonly && !options.search) {
                //input.attr('disabled', 'disabled');
                input.attr('readonly', 'true');
                input.bind('mousedown', function (event) {
                    event.preventDefault();
                });
            }
            // for IE7
            //if ($.browser.msie && $.browser.version <= 7) {
            //    input.css({
            //        'margin-top': '-1px'
            //    });
            //}
            buttonArrowDown = $('<a class="wa-button wa-dropdownlist-button-arrow-down"><div class="wa-arrow wa-arrow-down"></div></a>').appendTo(wrap);
            listItems = $('<div style="display:none;"></div>')
                .appendTo(document.body)
                .addClass('wa-dropdownlist-content');
            listItems.css({
                'position': 'absolute'
            });
            if (options.contentWidth) {
                listItems.css({
                    width: options.contentWidth
                });
            } else {
                listItems.css({
                    width: (width - parseInt(listItems.css('border-left-width')) - parseInt(listItems.css('border-right-width'))) + 'px'
                });
            }
            itemsHtml.push('<ul style="'
                + (options.contentHeight ? 'height:' + options.contentHeight + 'px;' : '')
                + (options.contentMinHeight ? 'min-height:' + options.contentMinHeight + 'px;' : '')
                + '" class="wa-dropdownlist-items">');
            //  /[^\{][^\{]+?(?=\})/g
            for (var i = 0; i < options.dataSource.length; i++) {
                itemsHtml.push('<li><a class="wa-dropdownlist-item">');
                if (options.mutil) {
                    var guid = $.wa.guid++;
                    itemsHtml.push('<label class="wa-dropdownlist-label" for="chk' + guid + '"><input type="checkbox" value="' + i + '" id="chk' + guid + '" />');
                    itemsHtml.push(options.tpl.replace(/\{\S+?\}/g, function (match) {
                        return options.dataSource[i][match.replace(/\{|\}/g, '')];
                    }));
                    itemsHtml.push('</label>');
                } else {
                    itemsHtml.push('<label class="wa-dropdownlist-label">');
                    itemsHtml.push(options.tpl.replace(/\{\S+?\}/g, function (match) {
                        return options.dataSource[i][match.replace(/\{|\}/g, '')];
                    }));
                    itemsHtml.push('</label>');
                }
                itemsHtml.push('</a></li>');
            }
            itemsHtml.push('</ul>');
            listItems.append(itemsHtml.join(''));
            items = listItems.find('.wa-dropdownlist-item').bind('mouseover', function () {
                $(this).addClass('wa-dropdownlist-item-hover');
            }).bind('mouseout', function () {
                $(this).removeClass('wa-dropdownlist-item-hover');
            });
            if (options.mutil) {
                me.selectedItems = [];
                items.find('input:checkbox').bind('click', function (event) {
                    var selectedItems = [];
                    var selectedText;
                    items.each(function (index) {
                        if ($(this).find('input:checkbox').get(0).checked) {
                            selectedItems.push(options.dataSource[index]);
                        }
                    });
                    me.selectedItems = selectedItems;
                    selectedText = $.map(selectedItems, function (value) {
                        return value.text;
                    }).join(',');
                    me.element.val(selectedText);
                    input.val(selectedText);
                }).bind('click', function (event) {
                    var $this = $(this);
                    var entity = options.dataSource[items.find('input:checkbox').index($this)];
                    me._trigger('select', event, entity);
                });
            } else {
                me.selectedItem = null;
                items.bind('click', function (event) {
                    var $this = $(this);
                    var entity = options.dataSource[items.index($this)];
                    me._trigger('select', event, entity);
                    me.element.val(entity.text);
                    input.val(entity.text);
                    me.selectedItem = entity;
                    me.hideListItems();
                });
            }
            if (options.search) {
                input.bind('keyup', function (event) {
                    var keyWord = $.trim(input.val()), n = -1;
                    items.parent().hide();
                    items.each(function (index) {
                        if (options.dataSource[index].text.toUpperCase().indexOf(keyWord.toUpperCase()) > -1) {
                            $(this).parent().show();
                            n = index;
                        }
                    });
                    if (n == -1) {
                        items.parent().show();
                    }
                    me.showListItems();
                });
            }
            me.guid = $.wa.guid++;
            $(document).bind('click.' + me.name + me.guid, function (event) {
                if (jQuery.contains(wrap.get(0), event.target) || event.target == wrap.get(0)) {
                    return;
                }
                if (jQuery.contains(listItems.get(0), event.target) || event.target == listItems.get(0)) {
                    return;
                }
                me.hideListItems();
            });
            //$(window).bind('resize.' + me.name + me.guid, function () {
            //    me.resizeTimeOut = setTimeout(function () {
            //        wrap.offset(me.element.offset());
            //        clearTimeout(me.resizeTimeOut);
            //    }, 0);
            //});
            me.ui = {};
            me.ui.listItems = listItems;
            me.ui.wrap = wrap;
            me.ui.positionIndicator = positionIndicator;
        },
        toggleListItems: function () {
            if (this.ui.listItems.is(':hidden')) {
                this.showListItems(true);
            }
            else {
                this.hideListItems();
            }
        },
        showListItems: function (showAll) {
            if (this.ui.listItems.is(':hidden')) {
                var offset = this.ui.wrap.offset(),
                        left = offset.left,
                        top = offset.top + this.ui.wrap.outerHeight() - 1;
                if (top + this.ui.listItems.outerHeight() - 1 > $(window).height()) {
                    top = offset.top - this.ui.listItems.outerHeight() + 1;
                    // in ie6 and ie7 the offset not render correct
                    this.ui.listItems.removeClass('wa-dropdownlist-content-down-ie').addClass('wa-dropdownlist-content-up-ie');
                } else {
                    this.ui.listItems.removeClass('wa-dropdownlist-content-up-ie').addClass('wa-dropdownlist-content-down-ie');
                }
                if (showAll) {
                    this.ui.listItems.find('.wa-dropdownlist-item').parent().show();
                }
                this.ui.listItems.css({
                    'z-index': (2 + $.wa.overlayZindex)
                }).show().offset({
                    left: left,
                    top: top
                });
            }
        },
        hideListItems: function () {
            if (this.ui.listItems.is(':hidden')) {
                return;
            }
            var input = this.ui.wrap.find('input'), selectedText = '';
            if (this.selectedItems && this.selectedItems.length) {
                selectedText = $.map(this.selectedItems, function (value) {
                    return value.text;
                }).join(',');

            } else if (this.selectedItem) {
                selectedText = this.selectedItem.text;
            }
            input.val(selectedText);
            this.ui.listItems.hide();
        },
        getSelectedItem: function () {
            return this.selectedItem ? this.selectedItem : null;
        },
        getSelectedItems: function () {
            return this.selectedItems ? this.selectedItems : null;
        },
        destroy: function () {
            $(document).unbind('click.' + this.name + this.guid);
            //$(window).unbind('resize.' + this.name + this.guid);
            this.element.removeClass('wa-invisible');
            this.callParent();
        }
    });
})(jQuery);