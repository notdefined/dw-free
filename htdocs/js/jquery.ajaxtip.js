(function($) {
$.widget("dw.ajaxtip", {
    options: {
        namespace: undefined,
        content: undefined,
        tooltip: { dynamic: true },
        persist: false,
        multiple: false // allow multiple ajaxtip requests, even if we're not done processing the previous
    },
    _namespace: function() {
        return this.options.namespace ? "."+this.options.namespace : "";
    },
    _create: function() {
        var self = this;
        var ns = self._namespace();

        var tipcontainer = $("<div class='ajaxtooltip ajaxtip' style='display: none'></div>")
                        .click(function(e) {e.stopPropagation()})

        if ( self.options.persist ) {
            $(self.element).attr("type", "persistent").bind("mouseout"+self._namespace(), function(e) {
                self.element.trigger("tooltipout" + self._namespace());
            } )
        }

        self.element
            .after(tipcontainer)
            .bind("ajaxresult"+ns, function(e) {
                var tip = self.element.data("tooltip").getTip()
                     .addClass("ajaxresult-" + e.ajaxresult.status);
                if ( e.ajaxresult.message ) tip.text(e.ajaxresult.message);
            })
            .tooltip($.extend({
                predelay: 0,
                delay: 1500,
                events: {
                    // just fade away after a preset period
                    def       : "ajaxstart"+ns+", tooltipout"+ns+" ajaxresult"+ns,
                    // persist until the user takes some action (including moving the mouse away from trigger)
                    persistent: "ajaxstart"+ns+", tooltipout"+ns,
                    widget    : "ajaxstart"+ns+", ajaxresult"+ns,
                    tooltip   : "mouseover,mouseleave"
                },
                relative: true,
                effect: "fade",
                onBeforeShow: function(e) {
                    var tooltipAPI = this;
                    var tip = tooltipAPI.getTip();
                    tip.removeClass("ajaxresult ajaxresult-success ajaxresult-error")
                        .appendTo("body");
                    if ( ! tip.data( "boundclose" ) ) {
                        tip.bind( "close", function () {

                            // abort any existing request
                            var xhr = tip.data( "xhr" );
                            if ( xhr ) xhr.abort();

                            // hide any currently shown ones
                            tooltipAPI.hide();
                        } );
                        tip.data( "boundclose", true );
                    }

                    if ( self.options.content && ! this.inprogress ){
                        tip.html(self.options.content)
                    } else {
                        tip.empty().append($("<img />", { src: Site.imgprefix + "/ajax-loader.gif" }))
                            .addClass("ajaxresult")
                    }

                    tip.css({position: "absolute", top: "", left: ""})
                    self._reposition( tip );
                },
                onShow: function(e) {
                    self._reposition( this.getTip() );
                }
            },  self.options.tooltip));
    },
    _init: function() {
        if(this.options.content)
            this.element.data("tooltip").show()
    },
    _reposition: function( tip ) {
        tip.position({ my: "left top", at: "left bottom", of: this.element, collision: "fit"})
    },
    _endpointurl : function( action ) {
        // if we are on a journal subdomain then our url will be
        // /journalname/__rpc_action instead of /__rpc_action
        return Site.currentJournal
            ? "/" + Site.currentJournal + "/__rpc_" + action
            : "/__rpc_" + action;
    },
    widget: function() {
        return this.element.data("tooltip").getTip();
    },
    cancel: function() {
        var tip = this.element.data("tooltip");
        if( tip && tip.isShown() ) tip.hide();
     },
    show: function() {
        var tip = this.element.data("tooltip");
        tip.show();
        this.success(/*no msg*/);
    },
    load: function(opts) {
        var self = this;

        var tip = self.element.data("tooltip");
        if( tip && ! opts.multiple ) {
            if( tip.inprogress ) return;
            if( tip.isShown() ) tip.hide();
            tip.inprogress = true;
        }

        self.element.trigger("ajaxstart" + self._namespace());

        var xhr = $.ajax({
            type: opts.formmethod || "POST",
            url : opts.endpoint ? self._endpointurl( opts.endpoint) : opts.url,
            data: opts.data,
            context: opts.context,

            dataType: "json",
            complete: function() {
                var tip = self.element.data("tooltip");
                if ( tip ) {
                    tip.inprogress = false;
                    var tipele = tip.getTip();
                    self._reposition( tipele );
                    tipele.removeData("xhr");
                }
            },
            success: opts.success,
            error: opts.error ? opts.error : function( jqxhr, status, error ) {
                if ( status == "abort" )
                    this.element.ajaxtip("cancel");
                else
                    this.element.ajaxtip( "error", "Error contacting server. " + error);

                this._trigger( "complete" );
            }
        });

        if ( tip ) tip.getTip().data( "xhr", xhr );
    },
    success: function(msg) {
        this.element.trigger({ type: "ajaxresult"+this._namespace(),
                                ajaxresult: { message: msg, status: "success" } })
    },
    error: function(msg) {
        this.element.trigger({ type: "ajaxresult"+this._namespace(),
                                ajaxresult: { message: msg, status: "error" } })
    },
    abort: function(msg) {
        this.element.data("tooltip").show();
        this.element.trigger({ type: "ajaxresult"+this._namespace(),
                                ajaxresult: { message: msg, status: "error" } })
    }
});

$.extend( $.dw.ajaxtip, {
    closeall: function(e) {
        $(".ajaxtip:visible").each(
            function(){
                var $this = $(this);

                if ( e && e.target && $this.has( e.target ).length > 0 ) {
                    // clicked inside this popup; do nothing
                } else {
                    $(this).trigger("close");
                }
            })
    }
})
})(jQuery);

jQuery(function($) {
    $(document).click(function(e) {
        $.dw.ajaxtip.closeall(e);
    });
});
