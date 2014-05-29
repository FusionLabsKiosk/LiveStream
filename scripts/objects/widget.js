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
            //TODO: Better start() logic
            window[self.name].start();
        }).appendTo('#widgets');
        window[self.name].initialize();
        return self;
    };
    this.setEndButton = function(e) {
        $(e).click(function() {
            //TODO: This calls all widgets whenever return is pressed
            window[self.name].end();
        });
    };
}