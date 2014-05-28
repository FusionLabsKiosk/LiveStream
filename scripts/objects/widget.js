function Widget(name, html) {
    
    var self = this;
    
    var n = typeof name === 'string' ? name : '';
    var h = typeof html === 'string' ? html : '';
    
    this.name = n;
    this.html = h;
    this.jhtml = $(h);
    
    this.widget = this.jhtml.filter('figure.widget');
    this.view = this.jhtml.filter('main.view');
    
    this.initialize = function() {
        self.widget.click(function() {
            live.setMain(self.view);
        }).appendTo('#widgets');
        if (window[self.name] !== undefined && window[self.name].initialize !== undefined) {
            window[self.name].initialize();
        }
        return self;
    };
}