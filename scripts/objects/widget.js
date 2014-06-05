function Widget(name, html) {
    
    var self = this;
    
    var n = typeof name === 'string' ? name : '';
    var h = typeof html === 'string' ? html : '';
    
    this.name = n;
    this.html = h;
    this.jhtml = $(h);
    
    this.widget = this.jhtml.filter('figure.widget');
    this.icon = this.jhtml.filter('figure.icon');
    if (this.icon.length === 0) {
        this.icon = this.widget;
    }
    this.view = this.jhtml.filter('main.view');
    this.v = this.view;
    this.widgetView = this.widget.add(this.view);
    this.wv = this.widgetView;
    this.widgetIcon = this.widget.add(this.icon);
    this.wi = this.widgetIcon;
    this.widgetIconView = this.widgetView.add(this.icon);
    this.wiv = this.widgetIconView;
    
    this.js = window[self.name];
    this.js.widget = this;
    this.js.w = this.widget;
    this.js.i = this.icon;
    this.js.v = this.view;
    this.js.wv = this.widgetView;
    this.js.wi = this.widgetIcon;
    this.js.wiv = this.widgetIconView;
    
    this.initialize = function() {
        initializeFunction('initialize');
        initializeFunction('setLocation');
        initializeFunction('start');
        initializeFunction('end');
        initializeFunction('viewStart');
        initializeFunction('viewEnd');
        initializeFunction('widgetStart');
        initializeFunction('widgetEnd');
        initializeFunction('iconStart');
        initializeFunction('iconEnd');
        
        self.widget.click(function() {
            self.addView(false);
        }).appendTo('#widgets');
        
        self.js.initialize();
        
        return self;
    };
    this.addView = function(dontHide) {
        var added = live.addView(self.view, dontHide);
            
        if (added) {
            self.js.viewStart();
        }
        else {
            self.js.viewEnd();
        }

        self.js.start();
    };
    var initializeFunction = function(name) {
        if (self.js[name] === undefined) {
            self.js[name] = function() {};
        }
    };
    
    this.showViewLoading = function() {
        self.showLoading(self.view);
    };
    this.hideViewLoading = function() {
        self.hideLoading(self.view);
    };
    this.js.showViewLoading = this.showViewLoading;
    this.js.hideViewLoading = this.hideViewLoading;
    this.showWidgetLoading = function() {
        self.showLoading(self.widget);
    };
    this.hideWidgetLoading = function() {
        self.hideLoading(self.widget);
    };
    this.js.showWidgetLoading = this.showWidgetLoading;
    this.js.hideWidgetLoading = this.hideWidgetLoading;
    this.showLoading = function(selector) {
        if (selector === undefined) {
            selector = self.widgetView;
        }
        selector.find('.loading').show();
    };
    this.hideLoading = function(selector) { 
        if (selector === undefined) {
            selector = self.widgetView;
        }
        selector.find('.loading').hide();
    };
    this.js.showLoading = this.showLoading;
    this.js.hideLoading = this.hideLoading;
}