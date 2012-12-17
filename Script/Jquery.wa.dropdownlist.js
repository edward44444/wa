/// <reference path="jquery.wa.core.js" />
$.wa.widget('dropdownlist', {
    options: {
        dataSource: [{ text: 'A', value: '1' }, { text: 'B', value: '2' }, { text: 'Bc', value: '21' }, { text: 'C', value: '3' }, { text: 'D', value: '4' }, { text: 'E', value: '5' }, { text: 'F', value: '6' }, { text: 'G', value: '7' }],
        tpl: '{text}',
        mutil: false,
        contentWidth: null,
        contentHeight: null,
        contentMinHeight: null,
        readonly: true,
        search:false,
        onSelect: function (data) {
        }
	},
	_create: function () {
	    var me = this, options = this.options, listItems, items,
            itemsHtml = [],buttonArrowDown,wrap,input,width,height;
	    width=me.element.outerWidth();
	    height=me.element.outerHeight();
	    wrap = $('<div class="wa-dropdownlist"></div>')
            .css({
                position: 'absolute',
                width: width + 'px',
                height: height + 'px'
            })
            .insertAfter(me.element)
            .bind('click', function (event) {
                me.toggleListItems();
            }).offset({
                left: me.element.offset().left,
                top: me.element.offset().top
            });
	    input = me.element.clone().removeAttr('id').appendTo(wrap)
            .css({
                margin: '0px'
            });
	    if(options.readonly&&!options.search){
	        //input.attr('disabled', 'disabled');
	        input.attr('readonly', 'true');
	        input.bind('mousedown', function (event) {
	            event.preventDefault();
	        });
	    }
        // for IE7
	    if ($.browser.msie && $.browser.version <= 7) {
	        input.css({
                'margin-top':'-1px'
	        });
	    }
	    buttonArrowDown = $('<a class="wa-button wa-button-arrow-down">▼</a>')
            .css({
                'position': 'absolute',
                right: '0px',
                top: '0px',
                height: height + 'px',
                'line-height': height + 'px'
            })
            .appendTo(wrap);
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
            + '" class="wa-items">');
	    //  /[^\{][^\{]+?(?=\})/g
	    for (var i = 0; i < options.dataSource.length; i++) {
	        itemsHtml.push('<li><a class="wa-item">');
	        if (options.mutil) {
	            var guid = $.wa.guid++;
	            itemsHtml.push('<label for="chk' + guid + '"><input type="checkbox" value="' + i + '" id="chk' + guid + '" /><label>');
	            itemsHtml.push(options.tpl.replace(/\{\S+?\}/g, function (match) {
	                return options.dataSource[i][match.replace(/\{|\}/g, '')];
	            }));
	            itemsHtml.push('</label></label>');
	        } else {
	            itemsHtml.push(options.tpl.replace(/\{\S+?\}/g, function (match) {
	                return options.dataSource[i][match.replace(/\{|\}/g, '')];
	            }));
	        }
	        itemsHtml.push('</a></li>');
	    }
	    itemsHtml.push('</ul>');
	    listItems.append(itemsHtml.join(''));
	    items = listItems.find('.wa-item');
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
	        });
	        items.bind('click', function (event) {
	            var $this = $(this);
	            var entity = options.dataSource[items.index($this)];
	            if ($.isFunction(options.onSelect)) {
	                options.onSelect.call($this, entity);
	            }
	        });
	    } else {
	        me.selectedItem = null;
	        items.bind('click', function (event) {
	            var $this = $(this);
	            var entity = options.dataSource[items.index($this)];
	            if ($.isFunction(options.onSelect)) {
	                options.onSelect.call($this, entity);
	            }
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
	        if (jQuery.contains(wrap.get(0), event.target)|| event.target == wrap.get(0)) {
	            return;
	        }
	        if (jQuery.contains(listItems.get(0), event.target) || event.target == listItems.get(0)) {
	            return;
	        }
	        me.hideListItems();
	    });
	    me.ui = {};
	    me.ui.listItems = listItems;
	    me.ui.wrap = wrap;
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
                    top = offset.top + this.ui.wrap.outerHeight();
	        if (showAll) {
	            this.ui.listItems.find('.wa-item').parent().show();
	        }
	        this.ui.listItems.show().offset({
	            left: left,
	            top: top
	        });
	    }
	},
	hideListItems: function () {
	    var input = this.ui.wrap.find('input'), selectedText='';
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
	    return this.selectedItem?this.selectedItem:null;
	},
	getSelectedItems: function () {
	    return this.selectedItems ? this.selectedItems : null;
	},
	destroy: function () {
	    $(document).unbind('click.' + this.name + this.guid);
	    $.wa.base.prototype.destroy.call(this);
	}
});