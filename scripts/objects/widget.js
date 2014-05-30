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
    this.widgetView = this.widget.add(this.view);
    this.widgetIcon = this.widget.add(this.icon);
    this.widgetIconView = this.widgetView.add(this.icon);
    
    this.js = window[self.name];
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
            var added = live.addView(self.view);
            
            if (added) {
                self.js.viewStart();
            }
            else {
                self.js.viewEnd();
            }
            
            self.js.start();
        }).appendTo('#widgets');
        
        self.js.initialize();
        
        return self;
    };
    var initializeFunction = function(name) {
        if (self.js[name] === undefined) {
            self.js[name] = function() {};
        }
    };
    
    this.setEndButton = function(e) {
        $(e).click(function() {
            //TODO: This calls all widgets whenever return is pressed
            self.js.end();
        });
    };
}