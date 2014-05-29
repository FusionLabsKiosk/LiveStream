function Widget(name, html) {
    
    var self = this;
    
    var n = typeof name === 'string' ? name : '';
    var h = typeof html === 'string' ? html : '';
    
    this.name = n;
    this.html = h;
    this.jhtml = $(h);
    
    this.widget = this.jhtml.filter('figure.widget');
    this.view = this.jhtml.filter('main.view');
    this.widgetView = this.widget.add(this.view);
    
    this.js = window[self.name];
    this.js.w = this.widget;
    this.js.v = this.view;
    this.js.wv = this.widgetView;
    
    this.initialize = function() {
        initializeFunction('initialize');
        initializeFunction('start');
        initializeFunction('end');
        
        self.widget.click(function() {
            live.setMain(self.view);
            //TODO: Better start() logic
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